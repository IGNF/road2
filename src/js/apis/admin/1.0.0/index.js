'use strict';


const express = require('express');
const log4js = require('log4js');
const packageJSON = require('../../../../../package.json');
const errorManager = require('../../../utils/errorManager');
const controller = require('./controller/controller');

var LOGGER = log4js.getLogger("ADMIN");
var router = express.Router();

// Accueil de l'API
router.all("/", function(req, res) {
  LOGGER.debug("requete sur /admin/1.0.0/");
  res.send("Road2 via l'API admin 1.0.0");
});

// Version
// Pour avoir la version de Road2 utilisée 
router.route("/version")

  .get(async function(req, res, next) {

    LOGGER.debug("requete GET sur /admin/1.0.0/version?");
    LOGGER.debug(req.originalUrl);

    res.set('content-type', 'application/json');
    res.status(200).json({
      "version": packageJSON.version
    });

  });

// Health
// Pour avoir l'état du service
router.route("/health")

  .get(async function(req, res, next) {

    LOGGER.debug("requete GET sur /admin/1.0.0/health?");
    LOGGER.debug(req.originalUrl);

    // On récupère l'instance d'Administrator pour répondre aux requêtes
    let administrator = req.app.get("administrator");

    // on récupère l'ensemble des paramètres de la requête
    let parameters = req.query;
    LOGGER.debug(parameters);

    try {

      // Vérification des paramètres de la requête
      const healthRequest = controller.checkHealthParameters(parameters);
      LOGGER.debug(healthRequest);
      // Envoie à l'administrateur et récupération de l'objet réponse
      const healthResponse = await administrator.computeHealthRequest(healthRequest);
      LOGGER.debug(healthResponse);
      // Formattage de la réponse
      const userResponse = controller.writeHealthResponse(healthRequest, healthResponse);
      LOGGER.debug(userResponse);

      res.set('content-type', 'application/json');
      res.status(200).json(userResponse);

    } catch (error) {
      return next(error);
    }

  });

// Configuration
// Pour avoir ou changer la configuration de l'administrateur
router.route("/configuration")

  .get(async function(req, res, next) {

    LOGGER.debug("requete GET sur /admin/1.0.0/configuration?");
    LOGGER.debug(req.originalUrl);

    // On récupère l'instance d'Administrator pour répondre aux requêtes
    let administrator = req.app.get("administrator");

    try {

      // Envoie à l'administrateur et récupération de l'objet réponse
      const configurationResponse = administrator.configuration;
      LOGGER.debug(configurationResponse);

      res.set('content-type', 'application/json');
      res.status(200).json(configurationResponse);

    } catch (error) {
      return next(error);
    }

  });

// Services
// Pour avoir des informations sur les services
router.route("/services")

  .get(async function(req, res, next) {

    LOGGER.debug("requete GET sur /admin/1.0.0/services?");
    LOGGER.debug(req.originalUrl);

    // On récupère l'instance d'Administrator pour répondre aux requêtes
    let administrator = req.app.get("administrator");

    try {

      const servicesResponse = administrator.getServicesConfigurations()
      res.set('content-type', 'application/json');
      res.status(200).json(servicesResponse);

    } catch (error) {
      return next(error);
    }

  });

// Services/{service}
// Récupérer les informations d'un service
router.route("/services/:service")

  .get(async function(req, res, next) {

    LOGGER.debug("requete GET sur /admin/1.0.0/services/:service?");
    LOGGER.debug(req.originalUrl);

    // On récupère l'instance d'Administrator pour répondre aux requêtes
    let administrator = req.app.get("administrator");

    // on récupère l'ensemble des paramètres de la requête
    const parameters = req.params;
    LOGGER.debug(parameters);

    try {

      // Vérification des paramètres de la requête
      const serviceRequest = controller.checkServiceParameters(parameters);
      LOGGER.debug(serviceRequest);

      // Envoie à l'administrateur et récupération de l'objet réponse
      const serviceResponse = administrator.getServiceConfiguration(serviceRequest.service);
      
      // Formattage de la réponse
      res.set('content-type', 'application/json');
      res.status(200).json(serviceResponse);

    } catch (error) {
      return next(error);
    }

  });

// Services/{service}/restart
// Récupérer les informations d'un service
router.route("/services/:service/restart")

  .get(async function(req, res, next) {

    LOGGER.debug("requete GET sur /admin/1.0.0/services/:service/restart");
    LOGGER.debug(req.originalUrl);

    // On récupère l'instance d'Administrator pour répondre aux requêtes
    let administrator = req.app.get("administrator");

    // on récupère l'ensemble des paramètres de la requête
    const parameters = req.params;
    LOGGER.debug(parameters);

    try {

      // Vérification des paramètres de la requête
      const serviceRequest = controller.checkServiceParameters(parameters);
      LOGGER.debug(serviceRequest);

      // Envoie à l'administrateur et récupération de l'objet réponse
      const restartStatus = await administrator.restartService(serviceRequest.service);

      if (restartStatus) {

        const serviceResponse = administrator.getServiceConfiguration(serviceRequest.service);
        // Formattage de la réponse
        res.set('content-type', 'application/json');
        res.status(200).json(serviceResponse);

      } else {
        next(errorManager.createError("Unknown error during the reload"));
      }

    } catch (error) {
      return next(error);
    }

  });

// Gestion des erreurs
// Cette partie doit être placée après la définition des routes normales
// ---
router.use(logError);
router.use(sendError);
// Celui-ci doit être le dernier pour renvoyer un 404 si toutes les autres routes font appel à next
router.use(notFoundError);
// ---

/**
*
* @function
* @name logError
* @description Callback pour écrire l'erreur dans les logs
*
*/

function logError(err, req, res, next) {
  
  let message = {
    request: req.originalUrl,
    query: req.query,
    body: req.body,
    error: {
      message: err.message,
      stack: err.stack
    }
  };

  if (err.status) {
    LOGGER.debug(message);
  } else {
    LOGGER.error(message);
  }
  next(err);
}

/**
*
* @function
* @name sendError
* @description Callback pour envoyer l'erreur au client
*
*/

function sendError(err, req, res, next) {
  // On ne veut pas le même comportement en prod et en dev 
  if (process.env.NODE_ENV === "production") {
    if (err.status) {
      // S'il y a un status dans le code, alors cela veut dire qu'on veut remonter l'erreur au client 
      res.status(err.status);
      res.json({ error: {message: err.message}});
    } else {
      // S'il n'y a pas de status dans le code alors on ne veut pas remonter l'erreur 
      res.status(500);
      res.json({ error: {message: "Internal Server Error"}});
    }
  } else if ((process.env.NODE_ENV === "debug")) {
      res.status(err.status || 500);
      res.json({ error: {
        message: err.message,
        stack: err.stack,
        // utile lorsqu'une erreur sql remonte
        more: err
      }});
  } else {
    // En dev, on veut faire remonter n'importe quelle erreur 
    res.status(err.status || 500);
    res.json({ error: {message: err.message}});
  }

}

/**
*
* @function
* @name sendError
* @description Callback pour envoyer l'erreur au client
*
*/

function notFoundError(req, res) {
  res.status(404);
  res.send({ error: { message: "Not found" }});
}

module.exports = router;
