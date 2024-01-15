'use strict';

const log4js = require('log4js');

const polyline = require('@mapbox/polyline');
const Turf = require('@turf/turf');

const Distance = require('../../../../geography/distance');
const Duration = require('../../../../time/duration');
const errorManager = require('../../../../utils/errorManager');
const NearestRequest = require('../../../../requests/nearestRequest');
const Point = require('../../../../geometry/point');
const RouteRequest = require('../../../../requests/routeRequest');

var LOGGER = log4js.getLogger("CONTROLLER");

module.exports = {

  /**
  *
  * @function
  * @name checkRouteParameters
  * @description Check parameters for a request on /route
  * @param {object} parameters - request parameters
  * @param {object} service - Service class' instance
  * @param {string} method - request method
  * @return {object} RouteRequest - RouteRequest class' instance
  *
  */

  checkRouteParameters: function(parameters, service, method) {

    let resource;
    let start = {};
    let end = {};
    let profile;
    let optimization;
    let tmpStringCoordinates;
    let coordinatesSequence;
    let defaultProjection;

    LOGGER.debug("checkRouteParameters()");

    // Resource
    if (!parameters.resource) {
        throw errorManager.createError(" Parameter 'resourceId' not found ", 400);
    } else {

      LOGGER.debug("user resource:");
      LOGGER.debug(parameters.resource);

      // Check resource availability, and compatibility between its type and the request
      if (!service.verifyResourceExistenceById(parameters.resource)) {
        throw errorManager.createError(" Parameter 'resourceId' is invalid: it does not exist on this service ", 400);
      } else {

        resource = service.getResourceById(parameters.resource);
        // Check if this operation is allowed for this resource
        if (!resource.verifyAvailabilityOperation("route")){
          throw errorManager.createError(" Operation 'route' is not permitted on this resource ", 400);
        } else {
          LOGGER.debug("operation route valide on this resource");
        }

      }
    }

    // Get route operation to check some things
    let routeOperation = resource.getOperationById("route");
    defaultProjection = routeOperation.getParameterById("projection").defaultValueContent;
    LOGGER.debug("default crs: " + defaultProjection);


    // Profile and Optimization
    // ---

    if (!parameters.profile) {
        throw errorManager.createError(" Parameter 'profileId' not found", 400);
    } else {
      LOGGER.debug("user profile:");
      LOGGER.debug(parameters.profile);
      // Parameter's validity check
      let validity = routeOperation.getParameterById("profile").check(parameters.profile);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'profileId' is invalid: " + validity.message, 400);
      } else {
        profile = parameters.profile;
        LOGGER.debug("user profile valide");
      }
    }

    if (!parameters.optimization) {
        throw errorManager.createError(" Parameter 'optimizationId' not found", 400);
    } else {
      LOGGER.debug("user optimization:");
      LOGGER.debug(parameters.optimization);
      // Parameter's validity check
      let validity = routeOperation.getParameterById("optimization").check(parameters.optimization);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'optimizationId' is invalid: " + validity.message, 400);
      } else {
        optimization = parameters.optimization;
        LOGGER.debug("user optimization is valid");
      }
    }

    // OSRM API specific parameters
    // coordinates (2 possible formats)
    if (!parameters.coordinates) {
        throw errorManager.createError(" Parameter 'coordinates' not found", 400);
    } else {
      LOGGER.debug("raw coordinates:");
      LOGGER.debug(parameters.coordinates);

      let rawStringPattern = /^(-?\d+(\.\d+)?,-?\d+(\.\d+)?;){1,}-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
      let polylinePattern = /^polyline\(\S+\)$/;

      // TODO : extract coordinates in a single format
      if (rawStringPattern.test(parameters.coordinates)) {
        coordinatesSequence = []
        const coordinatesMatchList = parameters.coordinates.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)
        for (const matchItem in coordinatesMatchList) {
          coordinatesSequence.push([parseFloat(matchItem[1]), parseFloat(matchItem[2])]);
        }
      } else if (polylinePattern.test(parameters.coordinates)) {
        coordinatesSequence = polyline.decode(parameters.coordinates);
      } else {
        throw errorManager.createError(" Parameter 'coordinates' is invalid: does not match allowed formats", 400);
      }
      LOGGER.debug("coordinates sequence:");
      LOGGER.debug(coordinatesSequence);

      if (coordinatesSequence.length >= 2) {
        // Route start point
        parameters.start = coordinatesSequence[0].join(",");
        LOGGER.debug("user start:");
        LOGGER.debug(parameters.start);
        let validity = routeOperation.getParameterById("start").check(parameters.start, defaultProjection);
        if (validity.code !== "ok") {
          throw errorManager.createError(" Parameter 'start' is invalid: " + validity.message, 400);
        } else {
          LOGGER.debug("user start valide")
          start = new Point(coordinatesSequence[0][0], coordinatesSequence[0][1], defaultProjection);
          LOGGER.debug("user start in road2' object:");
          LOGGER.debug(start);
        }
        validity = null;

        // Route end point
        parameters.end = coordinatesSequence[coordinatesSequence.length-1].join(",");
        LOGGER.debug("user end:");
        LOGGER.debug(parameters.end);
        validity = routeOperation.getParameterById("end").check(parameters.end, askedProjection);
        if (validity.code !== "ok") {
          throw errorManager.createError(" Parameter 'end' is invalid: " + validity.message, 400);
        } else {
          LOGGER.debug("user end valide")
          end = new Point(coordinatesSequence[coordinatesSequence.length-1][0], coordinatesSequence[coordinatesSequence.length-1][1], defaultProjection);
          LOGGER.debug("user end in road2' object:");
          LOGGER.debug(end);
        }
      } else {
        throw errorManager.createError(" Parameter 'coordinates' is invalid: it must contain at least two points");
      }
    }

    // Instanciate routeRequest with mandatory parameters
    let routeRequest = new RouteRequest(parameters.resource, start, end, profile, optimization);

    LOGGER.debug(routeRequest);

    // Check profile's validity and compatibility with the chosen optimization
    if (!resource.checkSourceAvailibilityFromRequest(routeRequest)) {
      throw errorManager.createError(" Parameters 'profile' and 'optimization' are not compatible ", 400);
    } else {
      LOGGER.debug("profile et optimization compatibles");
    }

    // Intermediate points
    if (coordinatesSequence.length > 2) {

      LOGGER.debug("user intermediates:");
      LOGGER.debug(coordinatesSequence.slice(1, coordinatesSequence.length-1));

      let finalIntermediates = "";
      for (let i = 1; i < (coordinatesSequence.length - 2); i++) {
        finalIntermediates = finalIntermediates.concat(coordinatesSequence[i].join(","), "|");
      }
      finalIntermediates = finalIntermediates.concat(coordinatesSequence[coordinatesSequence.length - 2].join(","));

      // Check coordinates validity
      let validity = routeOperation.getParameterById("intermediates").check(finalIntermediates, defaultProjection);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'coordinates' is invalid: " + validity.message, 400);
      } else {

        LOGGER.debug("valid intermediates");

        if (!routeOperation.getParameterById("intermediates").convertIntoTable(finalIntermediates, routeRequest.intermediates, defaultProjection)) {
          throw errorManager.createError(" Parameter 'intermediates' is invalid. Wrong format or out of the bbox. ", 400);
        } else {
          LOGGER.debug("intermediates in a table:");
          LOGGER.debug(routeRequest.intermediates);
        }
      }
    }

    // steps (OSRM) / getSteps (Road2)
    if (parameters.steps) {
      LOGGER.debug("user getSteps:");
      LOGGER.debug(parameters.steps);

      // Check coordinates validity
      let validity = routeOperation.getParameterById("getSteps").check(parameters.steps);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'steps' is invalid: " + validity.message, 400);
      } else {

        routeRequest.computeSteps = routeOperation.getParameterById("getSteps").specificConvertion(parameters.steps)
        if (routeRequest.computeSteps === null) {
          throw errorManager.createError(" Parameter 'steps' is invalid ", 400);
        } else {
          LOGGER.debug("converted getSteps: " + routeRequest.computeSteps);
        }

    } else if ("defaultValueContent" in routeOperation.getParameterById("getSteps") && typeof(routeOperation.getParameterById("getSteps").defaultValueContent) !== "undefined") {
      // Default value from configuration
      routeRequest.computeSteps = routeOperation.getParameterById("getSteps").defaultValueContent;
      LOGGER.debug("configuration default getSteps: " + routeRequest.computeSteps);
    } else {
      routeRequest.computeSteps = false;
      LOGGER.debug("general default getSteps: " + routeRequest.computeSteps);
    }

    // geometries (OSRM) / geometryFormat (Road2)
    if (parameters.geometries) {

      LOGGER.debug("user geometryFormat:");
      LOGGER.debug(parameters.geometries);

      // Check coordinates validity
      let validity = routeOperation.getParameterById("geometryFormat").check(parameters.geometries);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'geometries' is invalid: " + validity.message, 400);
      } else {
        LOGGER.debug("geometryFormat valide");
      }

      routeRequest.geometryFormat = parameters.geometries;

    } else {

      // Default value from configuration
      routeRequest.geometryFormat = routeOperation.getParameterById("geometryFormat").defaultValueContent;
      LOGGER.debug("default geometryFormat used: " + routeRequest.geometryFormat);

    }

    /* The following OSRM optional parameters are ignored for now, as they don't seem to match any routeRequest property:
       - alternatives
       - annotations
       - bearings
       - continue_straight (can maybe be converted to a "constraints" routeRequest property)
       - format
       - hints
       - overview (always "full" in road2)
       - radiuses
    */
    // optional routeRequest parameters with no OSRM equivalent are ignored or fixed

    routeRequest.bbox = false
    routeRequest.distanceUnit = "meter"
    routeRequest.timeUnit = "second"

    return routeRequest;

  },

  /**
  *
  * @function
  * @name writeRouteResponse
  * @description Rewrite engine's response to respond to a /route request
  * @param {object} RouteRequest - RouteRequest class instance
  * @param {object} RouteResponse - RouteResponse class instance
  * @param {object} service - Service class instance
  * @return {object} userResponse - Response body to serialize for the user
  *
  */

  writeRouteResponse: function(routeRequest, routeResponse, service) {

    LOGGER.debug("writeRouteResponse()");

    // Initialize userResponse
    let userResponse = {
      "code": routeResponse.engineExtras.code
    };

    let askedProjection = routeRequest.start.projection;

    // Waypoints
    let waypointArray = JSON.parse(JSON.stringify(routeResponse.engineExtras.waypoints));
    let startingPoint = routeResponse.routes[0].portions[0].start;
    waypointArray[0].location = [startingPoint.x, startingPoint.y];
    for (let i = 1; i < waypointArray.length; i++) {
      let point = routeResponse.routes[0].portions[i-1].end;
      waypointArray[i].location = [point.x, point.y];
    }
    userResponse.waypoints = waypointArray;

    let routeArray = new Array();
    for (let routeIdx = 0; routeIdx < routeResponse.routes.length; routeIdx++) {
    // for (let route in routeResponse.routes) {
      let simpleRoute = routeResponse.routes[routeIdx];
      let extraRoute = routeResponse.engineExtras.routes[routeIdx];
      routeArray[routeIdx] = {
        "distance": simpleRoute.distance,
        "duration": simpleRoute.duration,
        "geometry": simpleRoute.geometry.getGeometryWithFormat(routeRequest.geometryFormat),
        "legs": []
      };

      let legArray = new Array();
      for (let legIdx = 0; legIdx < route.portions.length; legIdx++) {
        let portion = route.portions[legIdx]
        legArray = {
          "distance": portion.distance,
          "duration": portion.duration,
          "steps": []
        };
      }
    }


  }

}