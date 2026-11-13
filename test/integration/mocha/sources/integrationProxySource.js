const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const proxySource = require('../../../../src/js/sources/proxySource');
const responseWriter = require('../../../../src/js/sources/proxyResponseWriter');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
const Point = require('../../../../src/js/geometry/point');
const logManager = require('../logManager');
const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../documentation/configuration/sources/valhalla-proxy.mapping')));

describe('Test de la classe proxySource', function() {

  before(function() {
    logManager.manageLogs();
  });

  const sourceDescription = {
    "id": "proxy-test",
    "type": "proxy",
    "projection": "EPSG:4326",
    "bbox": "-180,-90,180,90",
    "proxy": { "url": "http://valhalla:8002/", "timeout": 5000, "mapping": mapping },
    "costs": [{ "profile": "car", "optimization": "fastest", "costType": "time", "parameters": { "costing": "auto", "contourDivisor": 60 } }]
  };

  let source;
  beforeEach(function() {
    source = new proxySource(sourceDescription);
  });

  it('getters', function() {
    assert.equal(source.id, "proxy-test");
    assert.equal(source.type, "proxy");
    assert.equal(source.connected, false);
    assert.equal(source.isOperationMapped("route"), true);
    assert.equal(source.isOperationMapped("nearest"), false);
  });

  it('buildContext() pour un itinéraire', function() {
    const start = { getCoordinatesIn() { return [8.73, 41.92]; } };
    const end = { getCoordinatesIn() { return [8.76, 41.95]; } };
    const request = new RouteRequest("res", start, end, "car", "fastest");
    const context = source.buildContext(request);
    assert.deepStrictEqual(context.coordinates, [[8.73, 41.92], [8.76, 41.95]]);
    assert.deepStrictEqual(context.cost, sourceDescription.costs[0].parameters);
  });

  it('computeRequest() envoie le corps traduit', async function() {
    const start = { getCoordinatesIn() { return [8.73, 41.92]; } };
    const end = { getCoordinatesIn() { return [8.76, 41.95]; } };
    const request = new RouteRequest("res", start, end, "car", "fastest");
    request.constraints = [{ type: "banned", field: "exclude_tolls" }];
    const cost = source._costs["car|fastest"];
    source._costs["car|fastest"] = {
      ...cost,
      parameters: { ...cost.parameters, options: { walking_speed: 4 } }
    };

    source._httpQuery.post = sinon.stub().resolves({ waypoints: [] });
    // La réponse invalide déclenche une erreur, mais la requête sortante est celle qui nous intéresse
    await source.computeRequest(request).catch(() => {});

    const [url, options] = source._httpQuery.post.firstCall.args;
    assert.equal(url, "http://valhalla:8002/route");
    assert.deepStrictEqual(options.json.locations, [{ lat: 41.92, lon: 8.73 }, { lat: 41.95, lon: 8.76 }]);
    assert.equal(options.json.costing, "auto");
    assert.equal(options.json.date_time, undefined);
    assert.deepStrictEqual(options.json.costing_options.auto, { walking_speed: 4, exclude_tolls: true });
    assert.deepStrictEqual(source._httpQuery._options.https, { rejectUnauthorized: true });
  });

  it('computeRequest() passe la source en red si le service est injoignable', async function() {
    const start = { getCoordinatesIn() { return [8.73, 41.92]; } };
    const end = { getCoordinatesIn() { return [8.76, 41.95]; } };
    const request = new RouteRequest("res", start, end, "car", "fastest");

    source._httpQuery.post = sinon.stub().rejects(new Error("ECONNREFUSED"));
    await assert.rejects(source.computeRequest(request));
    assert.equal(source.state, "red");
  });

  it('computeRequest() omet les paramètres de recherche conditionnels indéfinis', async function() {
    const start = { getCoordinatesIn() { return [8.73, 41.92]; } };
    const end = { getCoordinatesIn() { return [8.76, 41.95]; } };
    const request = new RouteRequest("res", start, end, "car", "fastest");
    source._mapping = {
      route: {
        method: "GET",
        path: "/route",
        query: { $if: "date_time", $then: { date: "${date_time}" } },
        response: { format: "osrm" }
      }
    };
    source._httpQuery.get = sinon.stub().resolves({});

    await source.computeRequest(request).catch(() => {});

    assert.strictEqual(source._httpQuery.get.firstCall.args[1].searchParams, undefined);
  });

  it('computeRequest() retourne une erreur 502 si le service distant échoue', async function() {
    const start = { getCoordinatesIn() { return [8.73, 41.92]; } };
    const end = { getCoordinatesIn() { return [8.76, 41.95]; } };
    const request = new RouteRequest("res", start, end, "car", "fastest");
    const upstreamError = new Error("Service unavailable");
    upstreamError.response = { statusCode: 503 };
    source._httpQuery.post = sinon.stub().rejects(upstreamError);

    await assert.rejects(source.computeRequest(request), (error) => error.status === 502);
    assert.equal(source.state, "green");
  });

  it('computeRequest() retourne 404 pour les erreurs OSRM sans itinéraire', async function() {
    const start = { getCoordinatesIn() { return [8.73, 41.92]; } };
    const end = { getCoordinatesIn() { return [8.76, 41.95]; } };
    const request = new RouteRequest("res", start, end, "car", "fastest");
    const upstreamError = new Error("Not Found");
    upstreamError.response = { statusCode: 404, body: { code: "NoRoute" } };
    source._httpQuery.post = sinon.stub().rejects(upstreamError);

    await assert.rejects(source.computeRequest(request), (error) => error.status === 404);
    assert.equal(source.state, "green");
  });

  it('computeRequest() rejette une erreur pour les problèmes de connexion', async function() {
    const start = { getCoordinatesIn() { return [8.73, 41.92]; } };
    const end = { getCoordinatesIn() { return [8.76, 41.95]; } };
    const request = new RouteRequest("res", start, end, "car", "fastest");
    source._httpQuery.post = sinon.stub().rejects(new Error("ECONNREFUSED"));

    await assert.rejects(source.computeRequest(request), (error) => error instanceof Error && error.message === "Internal PROXY error");
  });

  it('writeRouteResponse() preserve les métadonnées OSRM et reprojette leurs coordonnées', function() {
    const request = new RouteRequest("res", new Point(0, 0, "EPSG:3857"), new Point(0, 0, "EPSG:3857"), "car", "fastest");
    const response = {
      waypoints: [
        { hint: "start-hint", distance: 1, name: "start", location: [8.73, 41.92] },
        { hint: "end-hint", distance: 2, name: "end", location: [8.76, 41.95] }
      ],
      routes: [{
        geometry: "??",
        distance: 1,
        duration: 1,
        legs: [{
          summary: "road",
          distance: 1,
          duration: 1,
          steps: [{
            geometry: "??",
            name: "road",
            distance: 1,
            duration: 1,
            mode: "driving",
            maneuver: { type: "turn", bearing_before: 10, bearing_after: 20, location: [8.74, 41.93] },
            intersections: [{ location: [8.74, 41.93], bearings: [10, 20] }]
          }]
        }]
      }]
    };

    const result = responseWriter.writeRouteResponse(request, response, "EPSG:4326", 5);
    const expectedLocation = new Point(8.74, 41.93, "EPSG:4326");
    expectedLocation.transform("EPSG:3857");

    assert.equal(result.engineExtras.code, "Ok");
    assert.equal(result.engineExtras.waypoints[0].hint, "start-hint");
    assert.equal(result.engineExtras.routes[0].legs[0].summary, "road");
    assert.deepStrictEqual(result.engineExtras.routes[0].legs[0].steps[0].maneuver.location, [expectedLocation.x, expectedLocation.y]);
    assert.deepStrictEqual(result.engineExtras.routes[0].legs[0].steps[0].intersections[0].location, [expectedLocation.x, expectedLocation.y]);
  });

});
