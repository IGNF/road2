'use strict';

const errorManager = require('../../../../utils/errorManager');
const log4js = require('log4js');
const HealthRequest = require('../../../../requests/healthRequest');
const ServiceRequest = require('../../../../requests/serviceRequest');
const ConfigurationRequest = require('../../../../requests/configurationRequest');
const assert = require('assert').strict;

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
  * @name checkConfigurationParameters
  * @description Vérification des paramètres d'une requête sur /configuration
  * @param {object} parameters - Body de la requête ExpressJS
  * @param {object} admin - Instance de la classe Administrator
  * @return {ConfigurationRequest} request - Instance de la classe ConfigurationRequest
  *
  */

  checkConfigurationParameters: function(parameters, admin) {

    LOGGER.info("checkConfigurationParameters()...");

    if (!parameters) {
      throw errorManager.createError("No body found", 400);
    } else {
      LOGGER.debug("Body présent");
    }

    if (!parameters.administration) {
      throw errorManager.createError("Body parameter is invalid : no 'administration' attribute", 400);
    } else {
      LOGGER.debug("Attribut 'administration' présent dans le body");
    }

    // On vérifie spécifiquement que seules les changements implémentés sont demandés
    if (parameters.administration.api) {
      try {
        assert.deepStrictEqual(parameters.administration.api, admin.configuration.administration.api);
      } catch (error) {
        throw errorManager.createError("Body parameter is invalid : 'api' modifications are not implemented", 400);
      }
    }

    if (parameters.administration.network) {
      try {
        assert.deepStrictEqual(parameters.administration.network, admin.configuration.administration.network);
      } catch (error) {
        throw errorManager.createError("Body parameter is invalid : 'network' modifications are not implemented", 400);
      }
    }

    if (parameters.administration.logs) {
      try {
        assert.deepStrictEqual(parameters.administration.logs, admin.configuration.administration.logs);
      } catch (error) {
        throw errorManager.createError("Body parameter is invalid : 'logs' modifications are not implemented", 400);
      }
    }

    // On fusionne le body avec la configuration pour avoir la configuration finale demandée
    LOGGER.debug("Merge de la configuration avec la requête");
    let mergeConfiguration = {};
    try {
      mergeConfiguration = {administration: {...admin.configuration.administration, ...parameters.administration}};
      LOGGER.debug(mergeConfiguration);
    } catch(error) {
      throw errorManager.createError("Body parameter is invalid : impossible to merge the resquest with the configuration", 400);
    }

    // On vérifie qu'il n'y ait pas une égalité 
    let identicalConfiguration = false;
    try {

      LOGGER.info("Test de l'égalité avec la configuration actuelle");
      assert.deepStrictEqual(mergeConfiguration, admin.configuration);
      LOGGER.info("Aucune modification n'est nécessaire. On s'arrête là.");
      identicalConfiguration = true;
      
    } catch(error) {

      LOGGER.info("La configuration demandée est bien différente de l'actuelle.");
      LOGGER.debug(error);

    }

    if (identicalConfiguration) {

      // On s'arrête là car ce n'est pas un reload de l'administrateur
      // On renvoie une erreur pour signifier à l'utilisateur que rien n'a été fait
      throw errorManager.createError("I'm a teapot : merged configuration is identical to actual configuration so nothing to do", 418);

    }
    
    // On vérifie la configuration ainsi obtenue 
    if (!admin.checkAdminConfiguration(mergeConfiguration, {onlyForm : true})) {
      throw errorManager.createError("Body parameter is invalid : merged configuration is invalid", 400);
    } else {
      LOGGER.info("La configuration résultante est valide");
    }

    // On crée une configurationRequest 
    return new ConfigurationRequest(mergeConfiguration);
    
  }

}