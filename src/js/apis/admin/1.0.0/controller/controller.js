'use strict';

const errorManager = require('../../../../utils/errorManager');
const log4js = require('log4js');
const HealthRequest = require('../../../../requests/healthRequest');
const ServiceRequest = require('../../../../requests/serviceRequest');
const ProjectionRequest = require('../../../../requests/projectionRequest');

var LOGGER = log4js.getLogger("CONTROLLER");

module.exports = {

  /**
  *
  * @function
  * @name checkHealthParameters
  * @description Vérification des paramètres d'une requête sur /health
  * @param {object} parameters - ensemble des paramètres de la requête ExpressJS
  * @return {object} HealthRequest - Instance de la classe HealthRequest
  *
  */

  checkHealthParameters: function(parameters) {

    LOGGER.debug("checkHealthParameters()");

    // Il n'y a aucun paramètre obligatoire donc on peut créer l'objet request
    let healthRequest = new HealthRequest();

    // Verbose
    if (parameters.verbose) {

      LOGGER.debug("user verbose:");
      LOGGER.debug(parameters.verbose);

      if (parameters.verbose === "true") {
        healthRequest.verbose = true;
      } else if (parameters.verbose === "false") {
        healthRequest.verbose = false;
      } else {
        throw errorManager.createError(" Parameter 'verbose' is invalid: value should be 'true' or 'false'", 400);
      }
      
    } else {
      // paramètre non obligatoire
      LOGGER.debug("default verbose used: false");
    }

    return healthRequest;

  },

  /**
  *
  * @function
  * @name writeHealthResponse
  * @description Ré-écriture de la réponse pour une requête sur /health
  * @param {object} HealthRequest - Instance de la classe HealthRequest
  * @param {object} HealthResponse - Instance de la classe HealthResponse
  * @return {object} userResponse - Réponse envoyée à l'utilisateur
  *
  */

  writeHealthResponse: function(healthRequest, healthResponse) {

    let userResponse = {};

    LOGGER.debug("writeHealthResponse()");

    userResponse.state = healthResponse.globalState;

    if (!healthRequest.verbose) {
      return userResponse;
    }

    userResponse.administrator = {};
    userResponse.administrator.state = healthResponse.adminState;

    userResponse.services = healthResponse.serviceStates;

    return userResponse;

  },

  /**
  *
  * @function
  * @name checkServiceParameters
  * @description Vérification des paramètres d'une requête sur /services/{service}
  * @param {object} parameters - ensemble des paramètres de la requête ExpressJS
  * @return {ServiceRequest} request - Instance de la classe ServiceRequest
  *
  */

  checkServiceParameters: function(parameters) {

    LOGGER.debug("checkServiceParameters()");

    // Service
    if (!parameters.service) {
      throw errorManager.createError(" Parameter 'service' is invalid: there is no value", 400);
    } 
    
    if (parameters.service === "") {
      throw errorManager.createError(" Parameter 'service' is invalid: value should not be empty", 400);
    }
    
    // TODO : vérifier ici que le service exite (appel à une fonction de la classe administrator)

    const request = new ServiceRequest(parameters.service);

    return request;

  },


  /**
  *
  * @function
  * @name checkProjectionParameters
  * @description Vérification des paramètres d'une requête sur /services/{service}/projections/{projection}
  * @param {object} parameters - ensemble des paramètres de la requête ExpressJS
  * @return {ProjectionRequest} request - Instance de la classe ProjectionRequest
  *
  */

  checkProjectionParameters: function(parameters) {

    LOGGER.debug("checkProjectionParameters()");

    // Service
    if (!parameters.service) {
      throw errorManager.createError(" Parameter 'service' is invalid: there is no value", 400);
    } 
    
    if (parameters.service === "") {
      throw errorManager.createError(" Parameter 'service' is invalid: value should not be empty", 400);
    }

    // Projection
    if (!parameters.projection) {
      throw errorManager.createError(" Parameter 'projection' is invalid: there is no value", 400);
    } 
    
    if (parameters.projection === "") {
      throw errorManager.createError(" Parameter 'projection' is invalid: value should not be empty", 400);
    }
    
    // TODO : vérifier ici que le service existe (appel à une fonction de la classe administrator)

    const request = new ProjectionRequest(parameters.service, parameters.projection);

    return request;

  },
  /**
  *
  * @function
  * @name writeProjectionResponse
  * @description Ré-écriture de la réponse pour une requête sur /services/<service>/projections/<projection>
  * @param {object} projectionResponse - Instance de la classe ProjectionResponse
  * @return {object} userResponse - Réponse envoyée à l'utilisateur
  *
  */

  writeProjectionResponse: function(projectionResponse) {

    let userResponse = {};

    LOGGER.debug("writeProjectionResponse()");

    // On doit utiliser les attributs avec _ car les méthodes ne sont pas disponible dans le cadre d'une communication IPC
    userResponse.id = projectionResponse._id;

    return userResponse;

  }

}