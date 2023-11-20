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
  * @description Vérification des paramètres d'une requête sur /route
  * @param {object} parameters - ensemble des paramètres de la requête
  * @param {object} service - Instance de la classe Service
  * @param {string} method - Méthode de la requête
  * @return {object} RouteRequest - Instance de la classe RouteRequest
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

      // Vérification de la disponibilité de la ressource et de la compatibilité de son type avec la requête
      if (!service.verifyResourceExistenceById(parameters.resource)) {
        throw errorManager.createError(" Parameter 'resourceId' is invalid: it does not exist on this service ", 400);
      } else {

        resource = service.getResourceById(parameters.resource);
        // On vérifie que la ressource peut accepter cette opération
        if (!resource.verifyAvailabilityOperation("route")){
          throw errorManager.createError(" Operation 'route' is not permitted on this resource ", 400);
        } else {
          LOGGER.debug("operation route valide on this resource");
        }

      }
    }

    // On récupère l'opération route pour faire des vérifications
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
      // Vérification de la validité du paramètre
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
      // Vérification de la validité du paramètre
      let validity = routeOperation.getParameterById("optimization").check(parameters.optimization);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'optimizationId' is invalid: " + validity.message, 400);
      } else {
        optimization = parameters.optimization;
        LOGGER.debug("user optimization is valid");
      }
    }

    // Paramètres spécifiques à l'API OSRM
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

      if (coordinatesSequence.length > 2) {

        LOGGER.debug("user intermediates:");
        LOGGER.debug(coordinatesSequence.slice(1, coordinatesSequence.length-1));

        let finalIntermediates = "";
        for (let i = 1; i < (coordinatesSequence.length - 2); i++) {
          finalIntermediates = finalIntermediates.concat(coordinatesSequence[i].join(","), "|");
        }
        finalIntermediates = finalIntermediates.concat(coordinatesSequence[coordinatesSequence.length - 2].join(","));

        // Vérification de la validité des coordonnées fournies
        let validity = routeOperation.getParameterById("intermediates").check(finalIntermediates, defaultProjection);
        if (validity.code !== "ok") {
          throw errorManager.createError(" Parameter 'coordinates' is invalid: " + validity.message, 400);
        } else {

          LOGGER.debug("intermediates valides");

          if (!routeOperation.getParameterById("intermediates").convertIntoTable(finalIntermediates, routeRequest.intermediates, defaultProjection)) {
            throw errorManager.createError(" Parameter 'intermediates' is invalid. Wrong format or out of the bbox. ", 400);
          } else {
            LOGGER.debug("intermediates in a table:");
            LOGGER.debug(routeRequest.intermediates);
          }
        }
      }
    }


    // alternatives

    // steps

    // annotations

    // geometries

    // overview

    // continue_straight


    // On définit la routeRequest avec les paramètres obligatoires
    let routeRequest = new RouteRequest(parameters.resource, start, end, profile, optimization);

    LOGGER.debug(routeRequest);

    // Vérification de la validité du profile et de sa compatibilité avec l'optimisation
    if (!resource.checkSourceAvailibilityFromRequest(routeRequest)) {
      throw errorManager.createError(" Parameters 'profile' and 'optimization' are not compatible ", 400);
    } else {
      LOGGER.debug("profile et optimization compatibles");
    }



  },

  /**
  *
  * @function
  * @name writeRouteResponse
  * @description Ré-écriture de la réponse d'un moteur pour une requête sur /route
  * @param {object} RouteRequest - Instance de la classe RouteRequest
  * @param {object} RouteResponse - Instance de la classe RouteResponse
  * @param {object} service - Instance de la classe Service
  * @return {object} userResponse - Réponse envoyée à l'utilisateur
  *
  */

  writeRouteResponse: function(routeRequest, routeResponse, service) {

    
  },

  /**
  *
  * @function
  * @name convertPostArrayToGetParameters
  * @description Transformation d'un paramètre POST en chaîne de caractères pour avoir l'équivalent d'un paramètre GET.
  * @param {object} userParameter - Paramètre POST donné par l'utilisateur
  * @param {Parameter} serviceParameter - Instance de la classe Parameter
  * @param {string} parameterName - Nom du paramètre converti
  * @return {string|array} Paramètre en GET
  *
  */

  convertPostArrayToGetParameters: function(userParameter, serviceParameter, parameterName) {

    LOGGER.debug("convertPostArrayToGetParameters() for " + parameterName);

    let finalParameter = "";
    let separator = "";

    if (serviceParameter.explode === "false") {
      if (serviceParameter.style === "pipeDelimited") {
        separator = "|";
        LOGGER.debug("separateur trouve pour ce parametre");
      } else {
        // ne doit pas arriver
        throw errorManager.createError(" Error in parameter configuration. ");
      }
    } else {
      // C'est déjà un tableau qu'on retourne car c'est ce qu'on attend pour le GET
      LOGGER.debug("nothing to do for this parameter");
      return userParameter;
    }

    if (!Array.isArray(userParameter)) {
      throw errorManager.createError(" The parameter " + parameterName + " is not an array. ", 400);
    } else {
      LOGGER.debug("Le parametre est un tableau");
    }
    if (userParameter.length === 0) {
      throw errorManager.createError(" The parameter " + parameterName + " is an empty array. ", 400);
    } else {
      LOGGER.debug("Le parametre est un tableau non vide");
    }

    try {
      if (typeof userParameter[0] !== "object") {
        finalParameter = userParameter[0];
      } else {
        finalParameter = JSON.stringify(userParameter[0]);
      }
    } catch(err) {
      throw errorManager.createError(" The parameter " + parameterName + " can't be converted to a string. ", 400);
    }

    for (let i = 1; i < userParameter.length; i++) {
      try {
        //TODO: vérifier que l'on peut mettre i à la place de 0
        if (typeof userParameter[0] !== "object") {
          finalParameter = finalParameter + separator + userParameter[i];
        } else {
          finalParameter = finalParameter + separator + JSON.stringify(userParameter[i]);
        }
      } catch(err) {
        throw errorManager.createError(" The parameter " + parameterName + " can't be converted to a string. ", 400);
      }
    }

    return finalParameter;

  }

}