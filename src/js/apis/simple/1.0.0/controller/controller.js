'use strict';

const errorManager = require('../../../../utils/errorManager');
const RouteRequest = require('../../../../requests/routeRequest');
const IsochroneRequest = require('../../../../requests/isochroneRequest');
const Point = require('../../../../geometry/point');
const Turf = require('@turf/turf');
const Duration = require('../../../../time/duration');
const Distance = require('../../../../geography/distance');
const log4js = require('log4js');
const validationManager = require('../../../../utils/validationManager');

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
    let askedProjection;

    LOGGER.debug("checkRouteParameters()");

    // Resource
    if (!parameters.resource) {
        throw errorManager.createError(" Parameter 'resource' not found ", 400);
    } else {

      LOGGER.debug("user resource:");
      LOGGER.debug(parameters.resource);

      // Vérification de la disponibilité de la ressource et de la compatibilité de son type avec la requête
      if (!service.verifyResourceExistenceById(parameters.resource)) {
        throw errorManager.createError(" Parameter 'resource' is invalid: it does not exist on this service ", 400);
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

    // Projection
    if (parameters.crs) {

      LOGGER.debug("user crs:");
      LOGGER.debug(parameters.crs);

      // Vérification de la validité des coordonnées fournies
      let validity = routeOperation.getParameterById("projection").check(parameters.crs);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'crs' is invalid: " + validity.message, 400);
      } else {
        askedProjection = parameters.crs;
        LOGGER.debug("user crs valide");
      }

    } else {

      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      askedProjection = routeOperation.getParameterById("projection").defaultValueContent;
      LOGGER.debug("default crs: " + askedProjection);

    }

    // Start
    if (!parameters.start) {
        throw errorManager.createError(" Parameter 'start' not found ", 400);
    } else {

      LOGGER.debug("user start:");
      LOGGER.debug(parameters.start);

      // Vérification de la validité des coordonnées fournies
      let validity = routeOperation.getParameterById("start").check(parameters.start, askedProjection);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'start' is invalid: " + validity.message, 400);
      } else {

        LOGGER.debug("user start valide")
        tmpStringCoordinates = parameters.start.split(",");
        start = new Point(Number(tmpStringCoordinates[0]), Number(tmpStringCoordinates[1]), askedProjection);
        LOGGER.debug("user start in road2' object:");
        LOGGER.debug(start);

      }

    }

    // End
    if (!parameters.end) {
        throw errorManager.createError(" Parameter 'end' not found ", 400);
    } else {

      LOGGER.debug("user end:");
      LOGGER.debug(parameters.end);

      // Vérification de la validité des coordonnées fournies
      let validity = routeOperation.getParameterById("end").check(parameters.end, askedProjection);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'end' is invalid: " + validity.message, 400);
      } else {

        LOGGER.debug("user end valide")
        tmpStringCoordinates = parameters.end.split(",");
        end = new Point(Number(tmpStringCoordinates[0]), Number(tmpStringCoordinates[1]), askedProjection);
        LOGGER.debug("user end in road2' object:");
        LOGGER.debug(end);

      }

    }

    // Profile and Optimization
    // ---

    if (!parameters.profile) {

      // Récupération du paramètre par défaut
      profile = routeOperation.getParameterById("profile").defaultValueContent;
      LOGGER.debug("default profile:" + profile);

    } else {

      LOGGER.debug("user profile:");
      LOGGER.debug(parameters.profile);

      // Vérification de la validité du paramètre
      let validity = routeOperation.getParameterById("profile").check(parameters.profile);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'profile' is invalid: " + validity.message, 400);
      } else {
        profile = parameters.profile;
        LOGGER.debug("user profile valide");
      }

    }


    if (!parameters.optimization) {

      // Récupération du paramètre par défaut
      optimization = routeOperation.getParameterById("optimization").defaultValueContent;
      LOGGER.debug("default optimization:" + optimization);

    } else {

      LOGGER.debug("user optimization:");
      LOGGER.debug(parameters.optimization);

      // Vérification de la validité du paramètre
      let validity = routeOperation.getParameterById("optimization").check(parameters.optimization);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'optimization' is invalid: " + validity.message, 400);
      } else {
        optimization = parameters.optimization;
        LOGGER.debug("user optmization valide");
      }

    }


    // Vérification de la validité du profile et de sa compatibilité avec l'optimisation
    if (!resource.linkedSource[profile+optimization]) {
      throw errorManager.createError(" Parameters 'profile' and 'optimization' are not compatible ", 400);
    } else {
      LOGGER.debug("profile et optimization compatibles");
    }
    // ---


    // On définit la routeRequest avec les paramètres obligatoires
    let routeRequest = new RouteRequest(parameters.resource, start, end, profile, optimization);

    LOGGER.debug(routeRequest);


    // On va vérifier la présence des paramètres non obligatoires pour l'API et l'objet RouteRequest

    // Points intermédiaires
    // ---
    if (parameters.intermediates) {

      LOGGER.debug("user intermediates:");
      LOGGER.debug(parameters.intermediates);

      // -- TODO: enlever cette partie, en passant par l'ajout de la notion de méthodes HTTP dans les paramètres
      // Cette vérification se fera donc dans le check du paramètre
      let finalIntermediates = "";

      if (method === "POST") {

        finalIntermediates = this.convertPostArrayToGetParameters(parameters.intermediates, routeOperation.getParameterById("intermediates").serviceParameter, "intermediates");
        LOGGER.debug("POST intermediates:");
        LOGGER.debug(parameters.intermediates);

      } else {
        finalIntermediates = parameters.intermediates;
      }
      // --
      

      // Vérification de la validité des coordonnées fournies
      let validity = routeOperation.getParameterById("intermediates").check(finalIntermediates, askedProjection);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'intermediates' is invalid: " + validity.message, 400);
      } else {

        LOGGER.debug("intermediates valides");

        if (!routeOperation.getParameterById("intermediates").convertIntoTable(finalIntermediates, routeRequest.intermediates, askedProjection)) {
          throw errorManager.createError(" Parameter 'intermediates' is invalid. Wrong format or out of the bbox. ", 400);
        } else {
          LOGGER.debug("intermdiates in a table:");
          LOGGER.debug(routeRequest.intermediates);
        }

      }

    } else {
      // il n'y a rien à faire
    }
    // ---

    // getSteps
    // ---
    if (parameters.getSteps) {

      LOGGER.debug("user getSteps:");
      LOGGER.debug(parameters.getSteps);

      // Vérification de la validité des coordonnées fournies
      let validity = routeOperation.getParameterById("getSteps").check(parameters.getSteps);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'getSteps' is invalid: " + validity.message, 400);
      } else {

        routeRequest.computeSteps = routeOperation.getParameterById("getSteps").specificConvertion(parameters.getSteps)
        if (routeRequest.computeSteps === null) {
          throw errorManager.createError(" Parameter 'getSteps' is invalid ", 400);
        } else {
          LOGGER.debug("converted getSteps: " + routeRequest.computeSteps);
        }

      }

    } else {

      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.computeSteps = routeOperation.getParameterById("getSteps").defaultValueContent;
      LOGGER.debug("default getSteps: " + routeRequest.computeSteps);

    }
    // ---


    // waysAttributes
    // ---
    if (parameters.waysAttributes) {
      LOGGER.debug("user waysAttributes:");
      LOGGER.debug(parameters.waysAttributes);

      // -- TODO: enlever cette partie, en passant par l'ajout de la notion de méthodes HTTP dans les paramètres
      // Cette vérification se fera donc dans le check du paramètre
      let finalWaysAttributes = "";
      if (method === "POST") {
        finalWaysAttributes = this.convertPostArrayToGetParameters(parameters.waysAttributes, routeOperation.getParameterById("waysAttributes").serviceParameter, "waysAttributes");
        LOGGER.debug("POST waysAttributes:");
        LOGGER.debug(finalWaysAttributes);
      } else {
        finalWaysAttributes = parameters.waysAttributes;
      }
      // --

      // Vérification de la validité des attributs demandés
      let validity = routeOperation.getParameterById("waysAttributes").check(finalWaysAttributes);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'waysAttributes' is invalid: " + validity.message, 400);
      } else {
        LOGGER.debug("waysAttributes valides");
        if (!routeOperation.getParameterById("waysAttributes").convertIntoTable(finalWaysAttributes, routeRequest.waysAttributes)) {
          throw errorManager.createError(" Parameter 'waysAttributes' is invalid ", 400);
        } else {
          LOGGER.debug("waysAttributes in a table");
          LOGGER.debug(routeRequest.waysAttributes);
        }
      }

    } else {
      // on ne fait rien, il n'y aucun attribut à ajouter
    }
    // ---

    // geometryFormat
    if (parameters.geometryFormat) {

      LOGGER.debug("user geometryFormat:");
      LOGGER.debug(parameters.geometryFormat);

      // Vérification de la validité du paramètre fourni
      let validity = routeOperation.getParameterById("geometryFormat").check(parameters.geometryFormat);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'geometryFormat' is invalid: " + validity.message, 400);
      } else {
        LOGGER.debug("geometryFormat valide");
      }

      routeRequest.geometryFormat = parameters.geometryFormat;

    } else {

      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.geometryFormat = routeOperation.getParameterById("geometryFormat").defaultValueContent;
      LOGGER.debug("default geometryFormat used: " + routeRequest.geometryFormat);

    }
    // ---

    // getBbox
    if (parameters.getBbox) {

      LOGGER.debug("user getBbox:");
      LOGGER.debug(parameters.getBbox);

      // Vérification de la validité du paramètre fourni
      let validity = routeOperation.getParameterById("bbox").check(parameters.getBbox);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'getBbox' is invalid: " + validity.message, 400);
      } else {

        LOGGER.debug("getBbox valide");

        routeRequest.bbox = routeOperation.getParameterById("bbox").specificConvertion(parameters.getBbox)
        if (routeRequest.bbox === null) {
          throw errorManager.createError(" Parameter 'getBbox' is invalid ", 400);
        } else {
          LOGGER.debug("getBbox converted: " + routeRequest.bbox);
        }

      }

    } else {

      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.bbox = routeOperation.getParameterById("bbox").defaultValueContent;
      LOGGER.debug("default getBbox: " + routeRequest.bbox);

    }
    // ---

    // timeUnit
    if (parameters.timeUnit) {

      LOGGER.debug("user timeUnit:");
      LOGGER.debug(parameters.timeUnit);

      // Vérification de la validité du paramètre fourni
      let validity = routeOperation.getParameterById("timeUnit").check(parameters.timeUnit);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'timeUnit' is invalid: " + validity.message, 400);
      } else {
        LOGGER.debug("timeUnit valide");
        routeRequest.timeUnit = parameters.timeUnit;
      }
      
    } else {

      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.timeUnit = routeOperation.getParameterById("timeUnit").defaultValueContent;
      LOGGER.debug("default timeUnit: " + routeRequest.timeUnit);

    }
    // ---

    // distanceUnit
    if (parameters.distanceUnit) {

      LOGGER.debug("user distanceUnit:");
      LOGGER.debug(parameters.distanceUnit);

      // Vérification de la validité du paramètre fourni
      let validity = routeOperation.getParameterById("distanceUnit").check(parameters.distanceUnit);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'distanceUnit' is invalid: " + validity.message, 400);
      } else {
        LOGGER.debug("distanceUnit valide");
        routeRequest.distanceUnit = parameters.distanceUnit;
      }

    } else {

      // On met la valeur par défaut issue de la configuration
      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      routeRequest.distanceUnit = routeOperation.getParameterById("distanceUnit").defaultValueContent;
      LOGGER.debug("default distanceUnit: " + routeRequest.distanceUnit);

    }
    // ---

    // Contraintes
    // ---
    if (parameters.constraints) {

      LOGGER.debug("user constraints:");
      LOGGER.debug(parameters.constraints);

      // -- TODO: enlever cette partie, en passant par l'ajout de la notion de méthodes HTTP dans les paramètres
      // Cette vérification se fera donc dans le check du paramètre
      let finalConstraints = "";
      if (method === "POST") {
        finalConstraints = this.convertPostArrayToGetParameters(parameters.constraints, routeOperation.getParameterById("constraints").serviceParameter, "constraints");
        LOGGER.debug("POST constraints:");
        LOGGER.debug(finalConstraints);
      } else {
        finalConstraints = parameters.constraints;
      }
      // --

      // Récupération des costRation par défaut
      const defaultCostRatios = {
        defaultPreferredCostRatio: routeOperation.getParameterById("constraints").defaultPreferredCostRatio,
        defaultAvoidCostRatio: routeOperation.getParameterById("constraints").defaultAvoidCostRatio,
      }

      // Vérification de la validité des contraintes fournies
      let validity = routeOperation.getParameterById("constraints").check(finalConstraints);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'constraints' is invalid: " + validity.message, 400);
      } else {

        LOGGER.debug("constraints valide");
        if (!routeOperation.getParameterById("constraints").convertIntoTable(finalConstraints, routeRequest.constraints, defaultCostRatios)) {
          throw errorManager.createError(" Parameter 'constraints' is invalid ", 400);
        } else {
          LOGGER.debug("constraints in a table:");
          LOGGER.debug(routeRequest.constraints);
        }

      }

    } else {

      // il n'y a rien à faire
      LOGGER.debug("No constraints asked by user");

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

    LOGGER.debug("checkIsochroneParameters()");

    let resource;
    let point = {};
    let costType;
    let costValue = 0;
    let profile;
    let direction;
    let askedProjection;
    let geometryFormat;
    let timeUnit;
    let distanceUnit;

    // Paramètre 'resource'. 
    if (!parameters.resource) {
        throw errorManager.createError("Parameter 'resource' not found.", 400);
    } else {

      LOGGER.debug("user resource:");
      LOGGER.debug(parameters.resource);

      /* Vérification de la disponibilité de la ressource et de la compatibilité de son type avec la requête. */
      if (!service.verifyResourceExistenceById(parameters.resource)) {
        throw errorManager.createError("Parameter 'resource' is invalid.", 400);
      } else {

        LOGGER.debug("resource valide");

        resource = service.getResourceById(parameters.resource);
        /* Vérification de la disponibilité de l'opération isochrone sur la ressource. */
        if (!resource.verifyAvailabilityOperation("isochrone")){
          throw errorManager.createError("Operation not permitted on this resource.", 400);
        } else {
          LOGGER.debug("operation isochrone valide sur cette resource");
        }

      }

    }

    /* On récupère l'opération 'isochrone' pour faire des vérifications. */
    let isochroneOperation = resource.getOperationById("isochrone");

    // Projection
    if (parameters.crs) {

      LOGGER.debug("user crs:");
      LOGGER.debug(parameters.crs);

      // Vérification de la validité des coordonnées fournies
      let validity = isochroneOperation.getParameterById("projection").check(parameters.crs);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'crs' is invalid: " + validity.message, 400);
      } else {
        askedProjection = parameters.crs;
        LOGGER.debug("crs valide");
      }

    } else {

      // TODO: que faire s'il n'y a pas de valeur par défaut ?
      askedProjection = isochroneOperation.getParameterById("projection").defaultValueContent;
      LOGGER.debug("default crs: " + askedProjection);
      
    }

    /* Paramètre 'point'. */
    if (!parameters.point) {
        throw errorManager.createError("Parameter 'point' not found.", 400);
    } else {

      LOGGER.debug("user point:");
      LOGGER.debug(parameters.point);

      /* Vérification de la validité des coordonnées fournies. */
      let validity = isochroneOperation.getParameterById("point").check(parameters.point, askedProjection);
      if (validity.code != "ok") {
        throw errorManager.createError("Parameter 'point' is invalid: " + validity.message, 400);
      } else {

        LOGGER.debug("point valide");
        //TODO: passer par la classe Point 
        const tmpStringCoordinates = parameters.point.split(",");
        point.lon = Number(tmpStringCoordinates[0]);
        point.lat = Number(tmpStringCoordinates[1]);

      }

    }

    /* Paramètre 'costType'. */
    if (!parameters.costType) {
      throw errorManager.createError("Parameter 'costType' not found.", 400);
    } else {

      LOGGER.debug("user costType:");
      LOGGER.debug(parameters.costType);

      /* Vérification de la validité du paramètre fourni. */
      let validity = isochroneOperation.getParameterById("costType").check(parameters.costType);
      if (validity.code != "ok") {
        throw errorManager.createError("Parameter 'costType' is invalid: " + validity.message, 400);
      } else {
        costType = parameters.costType;
        LOGGER.debug("costType valide");
      }

    }

    /* Paramètre 'costValue'. */
    if (!parameters.costValue) {
      throw errorManager.createError("Parameter 'costValue' not found.", 400);
    } else {

      LOGGER.debug("user costValue:");
      LOGGER.debug(parameters.costValue);

      /* Vérification de la validité du paramètre fourni. */
      let validity = isochroneOperation.getParameterById("costValue").check(parameters.costValue);
      if (validity.code != "ok") {
        throw errorManager.createError("Parameter 'costValue' is invalid: " + validity.message, 400);
      } else {

        LOGGER.debug("costValue valide");

        if (costType === "time") {

          if (parameters.timeUnit) {

            LOGGER.debug("user timeUnit:");
            LOGGER.debug(parameters.timeUnit);

            // Vérification de la validité du paramètre fourni.
            let subValidity = isochroneOperation.getParameterById("timeUnit").check(parameters.timeUnit);
            if (subValidity.code !== "ok") {
              throw errorManager.createError(" Parameter 'timeUnit' is invalid: " + subValidity.message, 400);
            } else {
              timeUnit = parameters.timeUnit;
              LOGGER.debug("timeUnit valide");
            }
            
          } else {
            timeUnit = isochroneOperation.getParameterById("timeUnit").defaultValueContent;
            LOGGER.debug("default timeUnit: " + timeUnit);
          }

          // Conversion de costValue en secondes (car le calcul côté moteur se fait en secondes).
          const duration = new Duration(Math.round(parameters.costValue * 10) / 10, timeUnit);
          if (duration.convert("second") === true) {
            costValue = duration.value;
            LOGGER.debug("costValue is converted in seconds: " + costValue);
          } else {
            throw errorManager.createError(" Parameter 'costValue' is invalid ", 400);
          }

        } else if (costType === "distance") {

          if (parameters.distanceUnit) {

            LOGGER.debug("user distanceUnit:");
            LOGGER.debug(parameters.distanceUnit);

            // Vérification de la validité du paramètre fourni.
            let subValidity = isochroneOperation.getParameterById("distanceUnit").check(parameters.distanceUnit);
            if (subValidity.code !== "ok") {
              throw errorManager.createError(" Parameter 'distanceUnit' is invalid: " + subValidity.message, 400);
            } else {
              distanceUnit = parameters.distanceUnit;
              LOGGER.debug("distanceUnit valide");
            }
            
          } else {
            distanceUnit = isochroneOperation.getParameterById("distanceUnit").defaultValueContent;
            LOGGER.debug("default distanceUnit: " + distanceUnit);
          }

          // Conversion de costValue en mètres (car le calcul côté moteur se fait en mètres).
          const distance = new Distance(Math.round(parameters.costValue * 10) / 10, distanceUnit);
          if (distance.convert("meter") === true) {
            costValue = distance.value;
            LOGGER.debug("costValue is converted in meters: " + costValue);
          } else {
            throw errorManager.createError(" Parameter 'costValue' is invalid ", 400);
          }

        } else {
          throw errorManager.createError("Parameter 'costType' not found.", 400);
        }

      }

    }

    /* Paramètre 'profile'. */
    if (parameters.profile) {

      LOGGER.debug("user profile:");
      LOGGER.debug(parameters.profile);

      /* Vérification de la validité du paramètre fourni. */
      let validity = isochroneOperation.getParameterById("profile").check(parameters.profile);
      if (validity.code !== "ok") {
        throw errorManager.createError("Parameter 'profile' is invalid: " + validity.message, 400);
      } else {
        profile = parameters.profile;
        LOGGER.debug("profile valide");
      }

    } else {

      /* Récupération du paramètre par défaut. */
      profile = isochroneOperation.getParameterById("profile").defaultValueContent;
      LOGGER.debug("default profile: " + profile);

    }

    /* Vérification de la validité du profile et de sa compatibilité avec le costType. */
    if (!resource.linkedSource[profile+costType]) {
      throw errorManager.createError("Parameters 'profile' and 'costType' are not compatible.", 400);
    } else {
      LOGGER.debug("Parameters 'profile' and 'costType' are compatible");
    }

    /* Paramètre 'direction'. */
    if (parameters.direction) {

      LOGGER.debug("user direction:");
      LOGGER.debug(parameters.direction);

      /* Vérification de la validité du paramètre fourni. */
      let validity = isochroneOperation.getParameterById("direction").check(parameters.direction);
      if (validity.code !== "ok") {
        throw errorManager.createError("Parameter 'direction' is invalid: " + validity.message, 400);
      } else {
        direction = parameters.direction;
        LOGGER.debug("direction valide");
      }

    } else {

      direction = isochroneOperation.getParameterById("direction").defaultValueContent;
      LOGGER.debug("default direction: " + direction);

    }

    /* Paramètre 'geometryFormat'. */
    if (parameters.geometryFormat) {

      LOGGER.debug("user geometryFormat:");
      LOGGER.debug(parameters.geometryFormat);

      /* Vérification de la validité du paramètre fourni. */
      let validity = isochroneOperation.getParameterById("geometryFormat").check(parameters.geometryFormat);
      if (validity.code !== "ok") {
        throw errorManager.createError("Parameter 'geometryFormat' is invalid: " + validity.message, 400);
      } else {
        geometryFormat = parameters.geometryFormat;
        LOGGER.debug("geometryFormat valide");
      }

    } else {

      geometryFormat = isochroneOperation.getParameterById("geometryFormat").defaultValueContent;
      LOGGER.debug("default geometryFormat: " + geometryFormat);

    }

    let isochroneRequest = new IsochroneRequest(
      parameters.resource,
      point,
      costType,
      costValue,
      profile,
      direction,
      askedProjection,
      geometryFormat,
      timeUnit,
      distanceUnit
    );

    // Contraintes
    // ---
    if (parameters.constraints) {

      LOGGER.debug("user constraints:");
      LOGGER.debug(parameters.constraints);

      // -- TODO: enlever cette partie, en passant par l'ajout de la notion de méthodes HTTP dans les paramètres
      // Cette vérification se fera donc dans le check du paramètre
      let finalConstraints = "";
      if (method === "POST") {
        finalConstraints = this.convertPostArrayToGetParameters(parameters.constraints, isochroneOperation.getParameterById("constraints").serviceParameter, "constraints");
        LOGGER.debug("POST constraints:");
        LOGGER.debug(finalConstraints);
      } else {
        finalConstraints = parameters.constraints;
      }
      // --

      // Vérification de la validité des contraintes fournies
      let validity = isochroneOperation.getParameterById("constraints").check(finalConstraints);
      if (validity.code !== "ok") {
        throw errorManager.createError(" Parameter 'constraints' is invalid: " + validity.message, 400);
      } else {

        LOGGER.debug("constraints valide");
        if (!isochroneOperation.getParameterById("constraints").convertIntoTable(finalConstraints, isochroneRequest.constraints)) {
          throw errorManager.createError(" Parameter 'constraints' is invalid ", 400);
        } else {
          LOGGER.debug("constraints in a table:");
          LOGGER.debug(isochroneRequest.constraints);
        }

      }

    } else {

      // il n'y a rien à faire
      LOGGER.debug("no constraints asked by user");

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
  * @param {object} service - Instance de la classe Service
  * @return {object} userResponse - Réponse envoyée à l'utilisateur
  *
  */

  writeRouteResponse: function(routeRequest, routeResponse, service) {

    LOGGER.debug("writeRouteResponse()");

    let userResponse = {};
    let route = routeResponse.routes[0];

    // resource
    userResponse.resource = routeResponse.resource;

    // resourceVersion
    userResponse.resourceVersion = service.getResourceById(routeResponse.resource).version;
    LOGGER.debug("resourceVersion: " + userResponse.resourceVersion);

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
    LOGGER.debug("geometry: " + userResponse.geometry);

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
      LOGGER.debug("bbox:");
      LOGGER.debug(userResponse.bbox);
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
      LOGGER.debug("duration convertion ok");
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
        LOGGER.debug(userResponse.constraints[i]);
      }
    } else {
      LOGGER.debug("no constraints asked by user");
    }

    // On ne considère que le premier itinéraire renvoyé par routeResponse
    // Portions
    userResponse.portions = new Array();

    for (let i = 0; i < route.portions.length; i++) {

      LOGGER.debug("Portion " + i + " en cours");

      let currentPortion = {};

      // start
      currentPortion.start = route.portions[i].start.toString();
      // end
      currentPortion.end = route.portions[i].end.toString();

      // distance
      if (!route.portions[i].distance.convert(routeRequest.distanceUnit)) {
        LOGGER.debug("error during distance conversion: distance " + route.portions[i].distance);
        throw errorManager.createError(" Error during convertion of portion distance in response. ", 400);
      } else {
        currentPortion.distance = route.portions[i].distance.value;
      }

      // duration
      if (!route.portions[i].duration.convert(routeRequest.timeUnit)) {
        LOGGER.debug("error during duration conversion: duration " + route.portions[i].duration);
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

      } else {
        LOGGER.debug("no bbox asked by user");
      }

      // Steps
      currentPortion.steps = new Array();

      if (routeRequest.computeSteps && route.portions[i].steps.length !== 0) {

        for (let j = 0; j < route.portions[i].steps.length; j++) {

          LOGGER.debug("Step " + j + " de la portion " + i + " en cours");

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
            LOGGER.debug("error during distance conversion: distance " + route.portions[i].steps[j].distance);
            throw errorManager.createError(" Error during convertion of step distance in response. ", 400);
          } else {
            currentStep.distance = route.portions[i].steps[j].distance.value;
          }

          // duration
          if (!route.portions[i].steps[j].duration.convert(routeRequest.timeUnit)) {
            LOGGER.debug("error during duration conversion: duration " + route.portions[i].steps[j].duration);
            throw errorManager.createError(" Error during convertion of step duration in response. ", 400);
          } else {
            currentStep.duration = route.portions[i].steps[j].duration.value;
          }

          currentPortion.steps.push(currentStep);

        }

      } else {
        // il n'y a rien à ajouter
        LOGGER.debug("no steps asked by user");
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
  * @param {object} service - Instance de la classe Service
  * @return {object} userResponse - Réponse envoyée à l'utilisateur
  *
  */

  writeIsochroneResponse: function(isochroneRequest, isochroneResponse, service) {

    LOGGER.debug("writeIsochroneResponse()");

    let userResponse = {};

    // point
    userResponse.point = isochroneResponse.point.toString();

    // resource
    userResponse.resource = isochroneResponse.resource;

    // resourceVersion
    userResponse.resourceVersion = service.getResourceById(isochroneResponse.resource).version;
    LOGGER.debug("resourceVersion: " + userResponse.resourceVersion);

    // costType
    userResponse.costType = isochroneResponse.costType;

    // costValue, timeUnit et distanceUnit.
    if (userResponse.costType === "time") {

      const duration = new Duration(isochroneResponse.costValue, "second");

      if (duration.convert(isochroneResponse.timeUnit) === true) {
        userResponse.costValue = duration.value;
        userResponse.timeUnit = isochroneResponse.timeUnit;
      } else {
        LOGGER.debug("error during duration conversion: duration " + duration);
        throw errorManager.createError(" Error during convertion of duration in response. ", 400);
      }

    } else if (userResponse.costType === "distance") {

      const distance = new Distance(isochroneResponse.costValue, "meter");

      if (distance.convert(isochroneResponse.distanceUnit) === true) {
        userResponse.costValue = distance.value;
        userResponse.distanceUnit = isochroneResponse.distanceUnit;
      } else {
        LOGGER.debug("error during duration conversion: duration " + distance);
        throw errorManager.createError(" Error during convertion of distance in response. ", 400);
      }

    } else {
      // cela ne devrait pas arriver 
      LOGGER.debug("costType is unknown: " + userResponse.costType);
      throw errorManager.createError(" costType of motor response is unknown ");
    }

    // profile
    userResponse.profile = isochroneResponse.profile;

    // direction
    userResponse.direction = isochroneResponse.direction;

    // crs
    userResponse.crs = isochroneResponse.askedProjection;

    // geometry
    userResponse.geometry = isochroneResponse.geometry.getGeometryWithFormat(isochroneRequest.geometryFormat);

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
        LOGGER.debug(userResponse.constraints[i]);
      }

    } else {
      LOGGER.debug("no constraints asked by user");
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
