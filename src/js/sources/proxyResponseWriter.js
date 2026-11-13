'use strict';

const RouteResponse = require('../responses/routeResponse');
const IsochroneResponse = require('../responses/isochroneResponse');
const Route = require('../responses/route');
const Portion = require('../responses/portion');
const Line = require('../geometry/line');
const Point = require('../geometry/point');
const Polygon = require('../geometry/polygon');
const Step = require('../responses/step');
const Distance = require('../geography/distance');
const Duration = require('../time/duration');
const errorManager = require('../utils/errorManager');
const copyManager = require('../utils/copyManager');
const turf = require('@turf/turf');

/**
*
* @function
* @name writeRouteResponse
* @description Convertir une réponse au format OSRM en RouteResponse.
* @param {RouteRequest} routeRequest - Requête d'origine
* @param {object} osrmResponse - Réponse du moteur au format OSRM
* @param {string} projection - Projection des coordonnées du moteur
* @param {number} precision - Précision des polylines
* @return {RouteResponse}
*
*/
function writeRouteResponse(routeRequest, osrmResponse, projection, precision) {

  if (!osrmResponse || !Array.isArray(osrmResponse.waypoints) || osrmResponse.waypoints.length < 2) {
    throw errorManager.createError(" Proxy response is invalid: the number of waypoints is lower than 2. ");
  }

  if (!Array.isArray(osrmResponse.routes) || osrmResponse.routes.length === 0) {
    throw errorManager.createError(" No route found ", 404);
  }

  const askedProjection = routeRequest.start.projection;
  const waypoints = osrmResponse.waypoints;
  const engineExtras = {
    code: "Ok",
    waypoints: waypoints.map((waypoint) => ({
      hint: waypoint.hint,
      distance: waypoint.distance,
      name: waypoint.name
    })),
    routes: []
  };

  const toPoint = (waypoint) => {
    const point = new Point(waypoint.location[0], waypoint.location[1], projection);
    if (!point.transform(askedProjection)) {
      throw errorManager.createError(" Error during reprojection of a point in proxy response. ");
    }
    return point;
  };

  const routeResponse = new RouteResponse(routeRequest.resource, toPoint(waypoints[0]), toPoint(waypoints[waypoints.length - 1]), routeRequest.profile, routeRequest.optimization);

  const routes = [];

  for (let i = 0; i < osrmResponse.routes.length; i++) {

    const current = osrmResponse.routes[i];

    routes[i] = new Route(new Line(current.geometry, "polyline", projection, precision));
    if (!routes[i].geometry.transform(askedProjection)) {
      throw errorManager.createError(" Error during reprojection of geometry in proxy response. ");
    }

    routes[i].distance = new Distance(current.distance, "meter");
    routes[i].duration = new Duration(current.duration, "second");

    if (current.legs.length !== waypoints.length - 1) {
      throw errorManager.createError(" Proxy response is invalid: the number of legs is not proportionnal to the number of waypoints. ");
    }

    const portions = [];
    const nativeLegs = [];

    for (let j = 0; j < current.legs.length; j++) {

      const leg = current.legs[j];
      nativeLegs[j] = { summary: leg.summary, steps: [] };

      portions[j] = new Portion(toPoint(waypoints[j]), toPoint(waypoints[j + 1]));
      portions[j].distance = new Distance(leg.distance, "meter");
      portions[j].duration = new Duration(leg.duration, "second");

      const steps = [];
      const legSteps = leg.steps || [];

      for (let k = 0; k < legSteps.length; k++) {

        const legStep = legSteps[k];

        steps[k] = new Step(new Line(legStep.geometry, "polyline", projection, precision));
        if (!steps[k].geometry.transform(askedProjection)) {
          throw errorManager.createError(" Error during reprojection of step's geometry in proxy response. ");
        }

        let nameAttributs;
        try {
          nameAttributs = JSON.parse(legStep.name);
        } catch (error) {
          nameAttributs = legStep.name;
        }
        steps[k].setAttributById("name", nameAttributs);

        steps[k].distance = new Distance(legStep.distance, "meter");
        steps[k].duration = new Duration(legStep.duration, "second");

        steps[k].instruction = {};
        steps[k].instruction.type = legStep.maneuver.type;
        if (legStep.maneuver.modifier) {
          steps[k].instruction.modifier = legStep.maneuver.modifier;
        }
        if (legStep.maneuver.exit) {
          steps[k].instruction.exit = legStep.maneuver.exit;
        }

        const nativeStep = { mode: legStep.mode, intersections: [], maneuver: {} };
        for (const intersection of legStep.intersections || []) {
          const nativeIntersection = copyManager.deepCopy(intersection);
          const location = new Point(intersection.location[0], intersection.location[1], projection);
          if (!location.transform(askedProjection)) {
            throw errorManager.createError(" Error during reprojection of intersection in proxy response. ");
          }
          nativeIntersection.location = [location.x, location.y];
          nativeStep.intersections.push(nativeIntersection);
        }

        for (const bearing of ["bearing_before", "bearing_after"]) {
          if (Object.prototype.hasOwnProperty.call(legStep.maneuver, bearing)) {
            nativeStep.maneuver[bearing] = legStep.maneuver[bearing];
          }
        }
        if (Object.prototype.hasOwnProperty.call(legStep.maneuver, "location")) {
          const location = new Point(legStep.maneuver.location[0], legStep.maneuver.location[1], projection);
          if (!location.transform(askedProjection)) {
            throw errorManager.createError(" Error during reprojection of step location in proxy response. ");
          }
          nativeStep.maneuver.location = [location.x, location.y];
        }
        nativeLegs[j].steps[k] = nativeStep;
      }

      portions[j].steps = steps;

    }

    routes[i].portions = portions;
    engineExtras.routes[i] = { legs: nativeLegs };

  }

  routeResponse.routes = routes;
  routeResponse.engineExtras = engineExtras;

  return routeResponse;

}

/**
*
* @function
* @name writeIsochroneResponse
* @description Convertir une réponse GeoJSON en IsochroneResponse.
* @param {IsochroneRequest} isochroneRequest - Requête d'origine
* @param {object} geojsonResponse - Réponse du moteur au format GeoJSON (FeatureCollection)
* @param {string} projection - Projection des coordonnées du moteur
* @return {IsochroneResponse}
*
*/
function writeIsochroneResponse(isochroneRequest, geojsonResponse, projection) {

  if (!geojsonResponse || !Array.isArray(geojsonResponse.features) || geojsonResponse.features.length === 0) {
    throw errorManager.createError(" No data found ", 404);
  }

  const askedProjection = isochroneRequest.point.projection;

  const point = isochroneRequest.point;
  if (!point.transform(askedProjection)) {
    throw errorManager.createError(" Error during reprojection of point in proxy response");
  }

  const rawGeometry = geojsonResponse.features[0].geometry;
  let geometry;

  if (rawGeometry === null) {
    // Pas d'isochrone, par exemple si costValue est trop faible
    geometry = new Polygon({type: 'Point', coordinates: [point.x, point.y]}, "geojson", askedProjection);
  } else {
    turf.cleanCoords(rawGeometry, {mutate: true});
    geometry = new Polygon(rawGeometry, "geojson", projection);
    if (!geometry.transform(askedProjection)) {
      throw errorManager.createError(" Error during reprojection of geometry in proxy response");
    }
  }

  return new IsochroneResponse(
    point,
    isochroneRequest.resource,
    isochroneRequest.costType,
    isochroneRequest.costValue,
    geometry,
    isochroneRequest.profile,
    isochroneRequest.direction,
    isochroneRequest.askedProjection,
    isochroneRequest.timeUnit,
    isochroneRequest.distanceUnit
  );

}

module.exports = { writeRouteResponse, writeIsochroneResponse };
