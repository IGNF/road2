'use strict';

const errorManager = require('../../../../utils/errorManager');
const RouteRequest = require('../../../../requests/routeRequest');
const Point = require('../../../../geometry/point');
const Turf = require('@turf/turf');

module.exports = {

  /**
  *
  * @function
  * @name checkRouteParameters
  * @description Vérification des paramètres d'une requête sur /route
  * @param {object} parameters - ensemble des paramètres de la requête
  * @param {object} service - Instance de la classe Service
  * @return {object} RouteRequest - Instance de la classe RouteRequest
  *
  */

  checkRouteParameters: function(parameters, service) {

    let resource;
    let start = {};
    let end = {};
    let profile;
    let optimization;
    let tmpStringCoordinates;
    let askedProjection;

    // Resource
    if (!parameters.resource) {
        throw errorManager.createError(" Parameter 'resource' not found ", 400);
    } else {
      // Vérification de la disponibilité de la ressource et de la compatibilité de son type avec la requête
      if (!service.verifyResourceExistenceById(parameters.resource)) {
        throw errorManager.createError(" Parameter 'resource' is invalid ", 400);
      } else {
        resource = service.getResourceById(parameters.resource);
        // On vérifie que la ressource peut accepter cette opération
        if (!resource.verifyAvailabilityOperation("route")){
          throw errorManager.createError(" Operation not permitted on this resource ", 400);
        }
      }
    }

    // On récupère l'opération route pour faire des vérifications
    let routeOperation = resource.getOperationById("route");

    // Projection
    if (parameters.crs) {
      // Vérification de la validité des coordonnées fournies
      if (!routeOperation.getParameterById("projection").check(parameters.crs)) {
        throw errorManager.createError(" Parameter 'crs' is invalid ", 400);
      } else {
        askedProjection = parameters.crs;
      }
    } else {
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      askedProjection = routeOperation.getParameterById("projection").defaultValueContent;
    }

    // Start
    if (!parameters.start) {
        throw errorManager.createError(" Parameter 'start' not found ", 400);
    } else {
      // Vérification de la validité des coordonnées fournies
      if (!routeOperation.getParameterById("start").check(parameters.start)) {
        throw errorManager.createError(" Parameter 'start' is invalid ", 400);
      } else {
        tmpStringCoordinates = parameters.start.split(",");
        start = new Point(Number(tmpStringCoordinates[0]), Number(tmpStringCoordinates[1]), askedProjection);
      }
    }

    // End
    if (!parameters.end) {
        throw errorManager.createError(" Parameter 'end' not found ", 400);
    } else {
      // Vérification de la validité des coordonnées fournies
      if (!routeOperation.getParameterById("end").check(parameters.end)) {
        throw errorManager.createError(" Parameter 'end' is invalid ", 400);
      } else {
        tmpStringCoordinates = parameters.end.split(",");
        end = new Point(Number(tmpStringCoordinates[0]), Number(tmpStringCoordinates[1]), askedProjection);
      }
    }

    // Profile and Optimization
    // ---

    if (!parameters.profile) {
      // Récupération du paramètre par défaut
      profile = routeOperation.getParameterById("profile").defaultValueContent;
    } else {
      // Vérification de la validité du paramètre
      if (!routeOperation.getParameterById("profile").check(parameters.profile)) {
        throw errorManager.createError(" Parameter 'profile' is invalid ", 400);
      } else {
        profile = parameters.profile;
      }
    }
    if (!parameters.optimization) {
      // Récupération du paramètre par défaut
      optimization = routeOperation.getParameterById("optimization").defaultValueContent;
    } else {
      // Vérification de la validité du paramètre
      if (!routeOperation.getParameterById("optimization").check(parameters.optimization)) {
        throw errorManager.createError(" Parameter 'optimization' is invalid ", 400);
      } else {
        optimization = parameters.optimization;
      }
    }
    // Vérification de la validité du profile et de sa compatibilité avec l'optimisation
    if (!resource.linkedSource[profile+optimization]) {
      throw errorManager.createError(" Parameters 'profile' and 'optimization' are not compatible ", 400);
    }
    // ---

    // On définit la routeRequest avec les paramètres obligatoires
    let routeRequest = new RouteRequest(parameters.resource, start, end, profile, optimization);

    // On va vérifier la présence des paramètres non obligatoires pour l'API et l'objet RouteRequest

    // Points intermédiaires
    // ---
    if (parameters.intermediates) {

      // Vérification de la validité des coordonnées fournies
      if (!routeOperation.getParameterById("intermediates").check(parameters.intermediates)) {
        throw errorManager.createError(" Parameter 'intermediates' is invalid ", 400);
      } else {
        if (!routeOperation.getParameterById("intermediates").convertIntoTable(parameters.intermediates, routeRequest.intermediates, askedProjection)) {
          throw errorManager.createError(" Parameter 'intermediates' is invalid ", 400);
        }
      }

    } else {
      // il n'y a rien à faire
    }
    // ---

    // getGeometry
    // ---
    if (parameters.getGeometry) {
      // Vérification de la validité des coordonnées fournies
      if (!routeOperation.getParameterById("stepsGeometry").check(parameters.getGeometry)) {
        throw errorManager.createError(" Parameter 'getGeometry' is invalid ", 400);
      } else {
        routeRequest.computeGeometry = routeOperation.getParameterById("stepsGeometry").specificConvertion(parameters.getGeometry)
        if (routeRequest.computeGeometry === null) {
          throw errorManager.createError(" Parameter 'getGeometry' is invalid ", 400);
        }
      }
    } else {
      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.computeGeometry = routeOperation.getParameterById("stepsGeometry").defaultValueContent;
    }
    // ---


    // waysAttributes
    // ---
    if (parameters.waysAttributes) {

      // Vérification de la validité des attributs demandés
      if (!routeOperation.getParameterById("waysAttributes").check(parameters.waysAttributes)) {
        throw errorManager.createError(" Parameter 'waysAttributes' is invalid ", 400);
      } else {
        if (!routeOperation.getParameterById("waysAttributes").convertIntoTable(parameters.waysAttributes, routeRequest.waysAttributes)) {
          throw errorManager.createError(" Parameter 'waysAttributes' is invalid ", 400);
        }
      }

    } else {
      // on ne fait rien, il n'y aucun attribut à ajouter
    }
    // ---

    // algoritm
    if (parameters.algorithm) {
      // Vérification de la validité du paramètre fourni
      if (!routeOperation.getParameterById("algorithm").check(parameters.algorithm)) {
        throw errorManager.createError(" Parameter 'algorithm' is invalid ", 400);
      }
      routeRequest.algorithm = parameters.algorithm;
    } else {
      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.algorithm = routeOperation.getParameterById("algorithm").defaultValueContent;
    }
    // ---

    // geometryFormat
    if (parameters.geometryFormat) {
      // Vérification de la validité du paramètre fourni
      if (!routeOperation.getParameterById("geometryFormat").check(parameters.geometryFormat)) {
        throw errorManager.createError(" Parameter 'geometryFormat' is invalid ", 400);
      }
      routeRequest.geometryFormat = parameters.geometryFormat;
    } else {
      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.geometryFormat = routeOperation.getParameterById("geometryFormat").defaultValueContent;
    }
    // ---

    // getBbox
    if (parameters.getBbox) {
      // Vérification de la validité du paramètre fourni
      if (!routeOperation.getParameterById("bbox").check(parameters.getBbox)) {
        throw errorManager.createError(" Parameter 'getBbox' is invalid ", 400);
      } else {
        routeRequest.bbox = routeOperation.getParameterById("bbox").specificConvertion(parameters.getBbox)
        if (routeRequest.bbox === null) {
          throw errorManager.createError(" Parameter 'getBbox' is invalid ", 400);
        }
      }

    } else {
      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.bbox = routeOperation.getParameterById("bbox").defaultValueContent;
    }
    // ---

    // timeUnit
    if (parameters.timeUnit) {
      // Vérification de la validité du paramètre fourni
      if (!routeOperation.getParameterById("timeUnit").check(parameters.timeUnit)) {
        throw errorManager.createError(" Parameter 'timeUnit' is invalid ", 400);
      }
      routeRequest.timeUnit = parameters.timeUnit;
    } else {
      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.timeUnit = routeOperation.getParameterById("timeUnit").defaultValueContent;
    }
    // ---

    // distanceUnit
    if (parameters.distanceUnit) {
      // Vérification de la validité du paramètre fourni
      if (!routeOperation.getParameterById("distanceUnit").check(parameters.distanceUnit)) {
        throw errorManager.createError(" Parameter 'distanceUnit' is invalid ", 400);
      }
      routeRequest.distanceUnit = parameters.distanceUnit;
    } else {
      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.distanceUnit = routeOperation.getParameterById("distanceUnit").defaultValueContent;
    }
    // ---

    return routeRequest;

  },

  /**
  *
  * @function
  * @name writeRouteResponse
  * @description Ré-écriture de la réponse d'un moteur pour une requête sur /route
  * @param {object} RouteRequest - Instance de la classe RouteRequest
  * @param {object} RouteResponse - Instance de la classe RouteResponse
  * @return {object} userResponse - Réponse envoyée à l'utilisateur
  *
  */

  writeRouteResponse: function(routeRequest, routeResponse) {

    let userResponse = {};
    let route = routeResponse.routes[0];

    // resource
    userResponse.resource = routeResponse.resource;

    // start
    userResponse.start = routeResponse.start.toString();

    // end
    userResponse.end = routeResponse.end.toString();

    // profile
    userResponse.profile = routeResponse.profile;

    // optimiszation
    userResponse.optimization = routeResponse.optimization;

    // geometry
    userResponse.geometry = route.geometry.getGeometryWithFormat(routeRequest.geometryFormat);

    // crs 
    userResponse.crs = route.geometry.projection;

    // bbox
    if (routeRequest.bbox) {
      userResponse.bbox = Turf.bbox(route.geometry.getGeometryWithFormat("geojson"));
    }

    // distance
    if (!route.distance.convert(routeRequest.distanceUnit)) {
      throw errorManager.createError(" Error during convertion of route distance in response. ", 400);
    } else {
      userResponse.distance = route.distance.value;
    }

    // duration
    if (!route.duration.convert(routeRequest.timeUnit)) {
      throw errorManager.createError(" Error during convertion of route duration in response. ", 400);
    } else {
      userResponse.duration = route.duration.value;
    }

    // distance
    userResponse.distance = route.distance.value;

    // duration
    userResponse.duration = route.duration.value;

    // On ne considère que le premier itinéraire renvoyé par routeResponse
    // Portions
    userResponse.portions = new Array();

    for (let i = 0; i < route.portions.length; i++) {

      let currentPortion = {};

      // start
      currentPortion.start = route.portions[i].start.toString();
      // end
      currentPortion.end = route.portions[i].end.toString();

      // distance
      if (!route.portions[i].distance.convert(routeRequest.distanceUnit)) {
        throw errorManager.createError(" Error during convertion of portion distance in response. ", 400);
      } else {
        currentPortion.distance = route.portions[i].distance.value;
      }

      // duration
      if (!route.portions[i].duration.convert(routeRequest.timeUnit)) {
        throw errorManager.createError(" Error during convertion of portion duration in response. ", 400);
      } else {
        currentPortion.duration = route.portions[i].duration.value;
      }

      // Steps
      currentPortion.steps = new Array();

      if (routeRequest.computeGeometry && route.portions[i].steps.length !== 0) {

        for (let j = 0; j < route.portions[i].steps.length; j++) {

          let currentStep = {};

          currentStep.geometry = route.portions[i].steps[j].geometry.getGeometryWithFormat(routeRequest.geometryFormat);

          // attributs des voies
          if (route.portions[i].steps[j].attributes) {

            currentStep.attributes = route.portions[i].steps[j].attributes;

          } else {
            // on ne fait rien
          }

          // distance
          if (!route.portions[i].steps[j].distance.convert(routeRequest.distanceUnit)) {
            throw errorManager.createError(" Error during convertion of step distance in response. ", 400);
          } else {
            currentStep.distance = route.portions[i].steps[j].distance.value;
          }

          // duration
          if (!route.portions[i].steps[j].duration.convert(routeRequest.timeUnit)) {
            throw errorManager.createError(" Error during convertion of step duration in response. ", 400);
          } else {
            currentStep.duration = route.portions[i].steps[j].duration.value;
          }

          currentPortion.steps.push(currentStep);

        }
      } else {
        // il n'y a rien à ajouter
      }

      userResponse.portions.push(currentPortion);

    }

    return userResponse;

  }

}
