'use strict';

const errorManager = require('../../../../utils/errorManager');
const RouteRequest = require('../../../../requests/routeRequest');

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
    let intermediatesPoints = new Array();
    let tmpStringCoordinates;

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

    // Start
    if (!parameters.start) {
        throw errorManager.createError(" Parameter 'start' not found ", 400);
    } else {
      // Vérification de la validité des coordonnées fournies
      if (!routeOperation.getParameterById("start").check(parameters.start)) {
        throw errorManager.createError(" Parameter 'start' is invalid ", 400);
      } else {
        tmpStringCoordinates = parameters.start.split(",");
        start.lon = Number(tmpStringCoordinates[0]);
        start.lat = Number(tmpStringCoordinates[1]);
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
        end.lon = Number(tmpStringCoordinates[0]);
        end.lat = Number(tmpStringCoordinates[1]);
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
        if (!routeOperation.getParameterById("intermediates").convertIntoTable(parameters.intermediates, routeRequest.intermediates)) {
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

    if (parameters.algorithm) {
      routeRequest.algorithm = parameters.algorithm;
    } else {
      // TODO: on met la valeur par défaut issue de la configuration
    }

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
    userResponse.start = routeResponse.start;

    // end
    userResponse.end = routeResponse.end;

    // profile
    userResponse.profile = routeResponse.profile;

    // optimiszation
    userResponse.optimization = routeResponse.optimization;

    // geometry
    userResponse.geometry = route.geometry;

    // On ne considère que le premier itinéraire renvoyé par routeResponse
    // Portions
    userResponse.portions = new Array();

    for (let i = 0; i < route.portions.length; i++) {

      let currentPortion = {};

      // start
      currentPortion.start = route.portions[i].start;
      // end
      currentPortion.end = route.portions[i].end;

      // Steps
      currentPortion.steps = new Array();

      if (routeRequest.computeGeometry && route.portions[i].steps.length !== 0) {

        for (let j = 0; j < route.portions[i].steps.length; j++) {

          let currentStep = {};

          currentStep.geometry = route.portions[i].steps[j].geometry;

          // si c'est demandé et qu'il existe alors on met le nom
          if (routeRequest.isAttributeRequested("name")) {
            currentStep.name = route.portions[i].steps[j].name;
          } else {
            // on ne fait rien
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
