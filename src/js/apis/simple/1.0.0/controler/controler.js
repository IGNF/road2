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
        // TODO: vérification de la compatibilité de son type avec la requête
      }
    }

    // Start
    if (!parameters.start) {
        throw errorManager.createError(" Parameter 'start' not found ", 400);
    } else {
      // Vérification de la validité des coordonnées fournies
      tmpStringCoordinates = parameters.start.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)/g);
      if (!tmpStringCoordinates) {
        throw errorManager.createError(" Parameter 'start' is invalid ", 400);
      } else {
        tmpStringCoordinates = tmpStringCoordinates[0].split(",");
        start.lon = Number(tmpStringCoordinates[0]);
        start.lat = Number(tmpStringCoordinates[1]);
        // TODO: vérification de l'inclusion des coordonnées dans la bbox de la ressource
      }
    }

    // End
    if (!parameters.end) {
        throw errorManager.createError(" Parameter 'end' not found ", 400);
    } else {
      // Vérification de la validité des coordonnées fournies
      tmpStringCoordinates = parameters.end.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)/g);
      if (!tmpStringCoordinates) {
        throw errorManager.createError(" Parameter 'end' is invalid ", 400);
      } else {
        tmpStringCoordinates = tmpStringCoordinates[0].split(",");
        end.lon = Number(tmpStringCoordinates[0]);
        end.lat = Number(tmpStringCoordinates[1]);
        // TODO: vérification de l'inclusion des coordonnées dans la bbox de la ressource
      }
    }

    // Profile and Optimization
    // ---

    if (!parameters.profile) {
      // Récupération du paramètre par défaut
      profile = resource.defaultProfile;
    } else {
      // TODO: vérification de la validité du paramètre
      profile = parameters.profile;
    }
    if (!parameters.optimization) {
      // Récupération du paramètre par défaut
      optimization = resource.defaultOptimization;
    } else {
      // TODO: vérification de la validité du paramètre
      optimization = parameters.optimization;
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
      let intermediatesTable = parameters.intermediates.split("|");

      // TODO: vérifier le nombre de point intermédiaires par rapport à la configuration

      for (let i = 0; i < intermediatesTable.length; i++) {

        tmpStringCoordinates = intermediatesTable[i].match(/^(\d+\.?\d*),(\d+\.?\d*)/g);

        if (!tmpStringCoordinates) {
          throw errorManager.createError(" Parameter 'intermediates' is invalid ", 400);
        } else {
          tmpStringCoordinates = tmpStringCoordinates[0].split(",");
          intermediatesPoints[i] = {};
          intermediatesPoints[i].lon = Number(tmpStringCoordinates[0]);
          intermediatesPoints[i].lat = Number(tmpStringCoordinates[1]);
          // TODO: vérification de l'inclusion des coordonnées dans la bbox de la ressource
        }

      }

      routeRequest.intermediates = intermediatesPoints;

    } else {
      // il n'y a rien à faire
    }
    // ---

    // getGeometry
    // ---
    if (parameters.getGeometry) {
      if (parameters.getGeometry === "true") {
        routeRequest.computeGeometry = true;
      } else {
        if (parameters.getGeometry === "false") {
          routeRequest.computeGeometry = false;
        } else {
          throw errorManager.createError(" Parameter 'getGeometry' is invalid ", 400);
        }
      }

    } else {
      // TODO: on met la valeur par défaut issue de la configuration
    }
    // ---

    // waysAttributes
    // ---
    if (parameters.waysAttributes) {

      // Vérification de la validité des attributs demandés
      let attributesTable = parameters.waysAttributes.split("|");

      if (attributesTable.length !== 0) {

        for (let i=0; i < attributesTable.length; i++) {
          if (resource.isWayAttributeAvailable(attributesTable[i])) {
            routeRequest.waysAttributes.push(attributesTable[i]);
          } else {
            throw errorManager.createError(" Parameter 'waysAttributes' is invalid: " + attributesTable[i], 400);
          }
        }

      } else {
        // rien à faire
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
