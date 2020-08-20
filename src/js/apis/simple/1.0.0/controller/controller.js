'use strict';

const errorManager = require('../../../../utils/errorManager');
const RouteRequest = require('../../../../requests/routeRequest');
const IsochroneRequest = require('../../../../requests/isochroneRequest');
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
      if (!routeOperation.getParameterById("start").check(parameters.start, askedProjection)) {
        throw errorManager.createError(" Parameter 'start' is invalid. Wrong format or out of the bbox.", 400);
      } else {
        tmpStringCoordinates = parameters.start.split(",");
        start = new Point(Number(tmpStringCoordinates[0]), Number(tmpStringCoordinates[1]), askedProjection);
      }
    }

    // End
    if (!parameters.end) {
        throw errorManager.createError(" Parameter 'end' not found. Wrong format or out of the bbox.", 400);
    } else {
      // Vérification de la validité des coordonnées fournies
      if (!routeOperation.getParameterById("end").check(parameters.end, askedProjection)) {
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

      // -- TODO: enlever cette partie, en passant par l'ajout de la notion de méthodes HTTP dans les paramètres
      // Cette vérification se fera donc dans le check du paramètre
      let finalIntermediates = "";
      if (method === "POST") {
        finalIntermediates = this.convertPostArrayToGetParameters(parameters.intermediates, routeOperation.getParameterById("intermediates").serviceParameter);
      } else {
        finalIntermediates = parameters.intermediates;
      }
      // --

      // Vérification de la validité des coordonnées fournies
      if (!routeOperation.getParameterById("intermediates").check(finalIntermediates, askedProjection)) {
        throw errorManager.createError(" Parameter 'intermediates' is invalid. Wrong format or out of the bbox. ", 400);
      } else {
        if (!routeOperation.getParameterById("intermediates").convertIntoTable(finalIntermediates, routeRequest.intermediates, askedProjection)) {
          throw errorManager.createError(" Parameter 'intermediates' is invalid. Wrong format or out of the bbox. ", 400);
        }
      }

    } else {
      // il n'y a rien à faire
    }
    // ---

    // getSteps
    // ---
    if (parameters.getSteps) {
      // Vérification de la validité des coordonnées fournies
      if (!routeOperation.getParameterById("getSteps").check(parameters.getSteps)) {
        throw errorManager.createError(" Parameter 'getSteps' is invalid ", 400);
      } else {
        routeRequest.computeSteps = routeOperation.getParameterById("getSteps").specificConvertion(parameters.getSteps)
        if (routeRequest.computeSteps === null) {
          throw errorManager.createError(" Parameter 'getSteps' is invalid ", 400);
        }
      }
    } else {
      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.computeSteps = routeOperation.getParameterById("getSteps").defaultValueContent;
    }
    // ---


    // waysAttributes
    // ---
    if (parameters.waysAttributes) {

      // -- TODO: enlever cette partie, en passant par l'ajout de la notion de méthodes HTTP dans les paramètres
      // Cette vérification se fera donc dans le check du paramètre
      let finalWaysAttributes = "";
      if (method === "POST") {
        finalWaysAttributes = this.convertPostArrayToGetParameters(parameters.waysAttributes, routeOperation.getParameterById("waysAttributes").serviceParameter);
      } else {
        finalWaysAttributes = parameters.waysAttributes;
      }
      // --

      // Vérification de la validité des attributs demandés
      if (!routeOperation.getParameterById("waysAttributes").check(finalWaysAttributes)) {
        throw errorManager.createError(" Parameter 'waysAttributes' is invalid ", 400);
      } else {
        if (!routeOperation.getParameterById("waysAttributes").convertIntoTable(finalWaysAttributes, routeRequest.waysAttributes)) {
          throw errorManager.createError(" Parameter 'waysAttributes' is invalid ", 400);
        }
      }

    } else {
      // on ne fait rien, il n'y aucun attribut à ajouter
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

    // Contraintes
    // ---
    if (parameters.constraints) {

      // -- TODO: enlever cette partie, en passant par l'ajout de la notion de méthodes HTTP dans les paramètres
      // Cette vérification se fera donc dans le check du paramètre
      let finalConstraints = "";
      if (method === "POST") {
        finalConstraints = this.convertPostArrayToGetParameters(parameters.constraints, routeOperation.getParameterById("constraints").serviceParameter);
      } else {
        finalConstraints = parameters.constraints;
      }
      // --

      // Vérification de la validité des contraintes fournies
      if (!routeOperation.getParameterById("constraints").check(finalConstraints)) {
        throw errorManager.createError(" Parameter 'constraints' is invalid ", 400);
      } else {
        if (!routeOperation.getParameterById("constraints").convertIntoTable(finalConstraints, routeRequest.constraints)) {
          throw errorManager.createError(" Parameter 'constraints' is invalid ", 400);
        }
      }

    } else {
      // il n'y a rien à faire
    }
    return routeRequest;

  },

  /**
  *
  * @function
  * @name checkIsochroneParameters
  * @description Vérification des paramètres d'une requête sur /isochrone
  * @param {object} parameters - ensemble des paramètres de la requête
  * @param {object} service - Instance de la classe Service
  * @param {string} method - Méthode de la requête
  * @return {object} IsochroneRequest - Instance de la classe IsochroneRequest
  *
  */
  checkIsochroneParameters: function(parameters, service, method) {
    let resource;
    let point = {};
    let costType;
    let costValue;
    let profile;
    let direction;
    let askedProjection;
    let geometryFormat;

    /* Paramètre 'resource'. */
    if (!parameters.resource) {
        throw errorManager.createError("Parameter 'resource' not found.", 400);
    } else {
      /* Vérification de la disponibilité de la ressource et de la compatibilité de son type avec la requête. */
      if (!service.verifyResourceExistenceById(parameters.resource)) {
        throw errorManager.createError("Parameter 'resource' is invalid.", 400);
      } else {
        resource = service.getResourceById(parameters.resource);
        /* Vérification de la disponibilité de l'opération isochrone sur la ressource. */
        if (!resource.verifyAvailabilityOperation("isochrone")){
          throw errorManager.createError("Operation not permitted on this resource.", 400);
        }
      }
    }

    /* On récupère l'opération 'isochrone' pour faire des vérifications. */
    let isochroneOperation = resource.getOperationById("isochrone");

    // Projection
    if (parameters.crs) {
      // Vérification de la validité des coordonnées fournies
      if (!isochroneOperation.getParameterById("projection").check(parameters.crs)) {
        throw errorManager.createError(" Parameter 'crs' is invalid ", 400);
      } else {
        askedProjection = parameters.crs;
      }
    } else {
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      askedProjection = isochroneOperation.getParameterById("projection").defaultValueContent;
    }

    /* Paramètre 'point'. */
    if (!parameters.point) {
        throw errorManager.createError("Parameter 'point' not found.", 400);
    } else {
      /* Vérification de la validité des coordonnées fournies. */
      if (!isochroneOperation.getParameterById("point").check(parameters.point, askedProjection)) {
        throw errorManager.createError("Parameter 'point' is invalid.", 400);
      } else {
        const tmpStringCoordinates = parameters.point.split(",");
        point.lon = Number(tmpStringCoordinates[0]);
        point.lat = Number(tmpStringCoordinates[1]);
      }
    }

    /* Paramètre 'costType'. */
    if (!parameters.costType) {
      throw errorManager.createError("Parameter 'costType' not found.", 400);
    } else {
      /* Vérification de la validité du paramètre fourni. */
      if (!isochroneOperation.getParameterById("costType").check(parameters.costType)) {
        throw errorManager.createError("Parameter 'costType' is invalid.", 400);
      } else {
        costType = parameters.costType;
      }
    }

    /* Paramètre 'costValue'. */
    if (!parameters.costValue) {
      throw errorManager.createError("Parameter 'costValue' not found.", 400);
    } else {
      /* Vérification de la validité du paramètre fourni. */
      if (!isochroneOperation.getParameterById("costValue").check(parameters.costValue)) {
        throw errorManager.createError("Parameter 'costValue' is invalid.", 400);
      } else {
        costValue = parameters.costValue;
      }
    }

    /* Paramètre 'profile'. */
    if (parameters.profile) {
      /* Vérification de la validité du paramètre fourni. */
      if (!isochroneOperation.getParameterById("profile").check(parameters.profile)) {
        throw errorManager.createError("Parameter 'profile' is invalid.", 400);
      } else {
        profile = parameters.profile;
      }
    } else {
      /* Récupération du paramètre par défaut. */
      profile = isochroneOperation.getParameterById("profile").defaultValueContent;
    }

    /* Vérification de la validité du profile et de sa compatibilité avec le costType. */
    if (!resource.linkedSource[profile+costType]) {
      throw errorManager.createError("Parameters 'profile' and 'costType' are not compatible.", 400);
    }

    /* Paramètre 'direction'. */
    if (parameters.direction) {
      /* Vérification de la validité du paramètre fourni. */
      if (!isochroneOperation.getParameterById("direction").check(parameters.direction)) {
        throw errorManager.createError("Parameter 'direction' is invalid.", 400);
      } else {
        direction = parameters.direction;
      }
    } else {
      direction = isochroneOperation.getParameterById("direction").defaultValueContent;
    }

    /* Paramètre 'geometryFormat'. */
    if (parameters.geometryFormat) {
      /* Vérification de la validité du paramètre fourni. */
      if (!isochroneOperation.getParameterById("geometryFormat").check(parameters.geometryFormat)) {
        throw errorManager.createError("Parameter 'geometryFormat' is invalid.", 400);
      } else {
        geometryFormat = parameters.geometryFormat;
      }
    } else {
      geometryFormat = isochroneOperation.getParameterById("geometryFormat").defaultValueContent;
    }

    let isochroneRequest = new IsochroneRequest(parameters.resource, point, costType, costValue, profile, direction, askedProjection, geometryFormat);

    // Contraintes
    // ---
    if (parameters.constraints) {

      // -- TODO: enlever cette partie, en passant par l'ajout de la notion de méthodes HTTP dans les paramètres
      // Cette vérification se fera donc dans le check du paramètre
      let finalConstraints = "";
      if (method === "POST") {
        finalConstraints = this.convertPostArrayToGetParameters(parameters.constraints, isochroneOperation.getParameterById("constraints").serviceParameter);
      } else {
        finalConstraints = parameters.constraints;
      }
      // --

      // Vérification de la validité des contraintes fournies
      if (!isochroneOperation.getParameterById("constraints").check(finalConstraints)) {
        throw errorManager.createError(" Parameter 'constraints' is invalid ", 400);
      } else {
        if (!isochroneOperation.getParameterById("constraints").convertIntoTable(finalConstraints, isochroneRequest.constraints)) {
          throw errorManager.createError(" Parameter 'constraints' is invalid ", 400);
        }
      }

    } else {
      // il n'y a rien à faire
    }

    return isochroneRequest;

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

    // Units
    // distance
    userResponse.distanceUnit = routeRequest.distanceUnit;

    // duration
    userResponse.timeUnit = routeRequest.timeUnit;

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

    // constraints
    userResponse.constraints = new Array();

    if (routeRequest.constraints.length !== 0) {

      for (let i = 0; i < routeRequest.constraints.length; i++) {
        userResponse.constraints[i] = {};
        userResponse.constraints[i].type = routeRequest.constraints[i].type;
        userResponse.constraints[i].key = routeRequest.constraints[i].key;
        userResponse.constraints[i].operator = routeRequest.constraints[i].operator;
        userResponse.constraints[i].value = routeRequest.constraints[i].value;
      }
    }

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

      // Bbox de la portion
      if (routeRequest.bbox) {

        if (route.portions.length > 1) {

          // Découpage de la géométrie de l'itinéraire à partir des points intérmédiaires
          let portionGeometry = Turf.lineSlice([route.portions[i].start.x, route.portions[i].start.y],
            [route.portions[i].end.x, route.portions[i].end.y],
            route.geometry.getGeometryWithFormat("geojson"));

          // Génération de la Bbox
          currentPortion.bbox = Turf.bbox(portionGeometry);

        } else {
          // La bbox est donc la même que celle de l'itinéraire
          currentPortion.bbox = userResponse.bbox;
        }

      }

      // Steps
      currentPortion.steps = new Array();

      if (routeRequest.computeSteps && route.portions[i].steps.length !== 0) {

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

  },

  /**
  *
  * @function
  * @name writeIsochroneResponse
  * @description Ré-écriture de la réponse d'un moteur pour une requête sur /isochrone
  * @param {object} IsochroneRequest - Instance de la classe IsochroneRequest
  * @param {object} IsochroneResponse - Instance de la classe IsochroneResponse
  * @return {object} userResponse - Réponse envoyée à l'utilisateur
  *
  */

  writeIsochroneResponse: function(isochroneRequest, isochroneResponse) {

    let userResponse = {};

    // point
    userResponse.point = isochroneResponse.point.toString();

    // resource
    userResponse.resource = isochroneResponse.resource;

    // costType
    userResponse.costType = isochroneResponse.costType;

    // costValue
    userResponse.costValue = isochroneResponse.costValue;

    // profile
    userResponse.profile = isochroneResponse.profile;

    // direction
    userResponse.direction = isochroneResponse.direction;

    // crs
    userResponse.crs = isochroneResponse.askedProjection;

    // geometry
    userResponse.geometry = isochroneResponse.geometry;

    // optimiszation
    userResponse.optimization = isochroneResponse.optimization;

    // constraints
    userResponse.constraints = new Array();

    if (isochroneRequest.constraints.length !== 0) {

      for (let i = 0; i < isochroneRequest.constraints.length; i++) {
        userResponse.constraints[i] = {};
        userResponse.constraints[i].type = isochroneRequest.constraints[i].type;
        userResponse.constraints[i].key = isochroneRequest.constraints[i].key;
        userResponse.constraints[i].operator = isochroneRequest.constraints[i].operator;
        userResponse.constraints[i].value = isochroneRequest.constraints[i].value;
      }
    }

    return userResponse;

  },

  /**
  *
  * @function
  * @name convertPostArrayToGetParameters
  * @description Transformation d'un paramètre POST en chaîne de caractères pour avoir l'équivalent d'un paramètre GET.
  * @param {object} userParameter - Paramètre POST donné par l'utilisateur
  * @param {Parameter} serviceParameter - Instance de la classe Parameter
  * @return {string|array} Paramètre en GET
  *
  */

  convertPostArrayToGetParameters: function(userParameter, serviceParameter) {

    let finalParameter = "";
    let separator = "";

    if (serviceParameter.explode === "false") {
      if (serviceParameter.style === "pipeDelimited") {
        separator = "|";
      } else {
        // ne doit pas arriver
        throw errorManager.createError(" Error in parameter configuration. ");
      }
    } else {
      // C'est déjà un tableau qu'on retourne car c'est ce qu'on attend pour le GET
      return userParameter;
    }

    if (!Array.isArray(userParameter)) {
      throw errorManager.createError(" The parameter is not an array. ", 400);
    }
    if (userParameter.length === 0) {
      throw errorManager.createError(" The parameter is an empty array. ", 400);
    }

    try {
      if (typeof userParameter[0] !== "object") {
        finalParameter = userParameter[0];
      } else {
        finalParameter = JSON.stringify(userParameter[0]);
      }
    } catch(err) {
      throw errorManager.createError(" The parameter can't be converted to a string. ", 400);
    }

    for (let i = 1; i < userParameter.length; i++) {
      try {
        if (typeof userParameter[0] !== "object") {
          finalParameter = finalParameter + separator + userParameter[i];
        } else {
          finalParameter = finalParameter + separator + JSON.stringify(userParameter[i]);
        }
      } catch(err) {
        throw errorManager.createError(" The parameter can't be converted to a string. ", 400);
      }
    }

    return finalParameter;

  }

}
