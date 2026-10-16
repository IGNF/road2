const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const proxySource = require('../../../../src/js/sources/proxySource');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
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

    source._httpQuery.post = sinon.stub().resolves({ waypoints: [] });
    // La réponse invalide déclenche une erreur, mais la requête sortante est celle qui nous intéresse
    await source.computeRequest(request).catch(() => {});

    const [url, options] = source._httpQuery.post.firstCall.args;
    assert.equal(url, "http://valhalla:8002/route");
    assert.deepStrictEqual(options.json.locations, [{ lat: 41.92, lon: 8.73 }, { lat: 41.95, lon: 8.76 }]);
    assert.equal(options.json.costing, "auto");
    assert.equal(options.json.date_time, undefined);
  });

  it('computeRequest() passe la source en red si le service est injoignable', async function() {
    const start = { getCoordinatesIn() { return [8.73, 41.92]; } };
    const end = { getCoordinatesIn() { return [8.76, 41.95]; } };
    const request = new RouteRequest("res", start, end, "car", "fastest");

    source._httpQuery.post = sinon.stub().rejects(new Error("ECONNREFUSED"));
    await assert.rejects(source.computeRequest(request));
    assert.equal(source.state, "red");
  });

});
