'use strict';

const errorManager = require('../../../../utils/errorManager');
const log4js = require('log4js');
const HealthRequest = require('../../../../requests/healthRequest');

var LOGGER = log4js.getLogger("CONTROLLER");

module.exports = {

  /**
  *
  * @function
  * @name checkHealthParameters
  * @description Vérification des paramètres d'une requête sur /health
  * @param {object} parameters - ensemble des paramètres de la requête
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

    userResponse.services = new Array();

    return userResponse;

  }

}