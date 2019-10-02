'use strict';


const express = require('express');
const log4js = require('log4js');
const cors = require('cors');
const controller = require('./controller/controller');
const errorManager = require('../../../utils/errorManager');

var LOGGER = log4js.getLogger("SIMPLE");
var router = express.Router();

// CORS
// ---
// Pour cette API, on va applicer les CORS sur l'ensemble du router
router.use(cors());
// ---

// Accueil de l'API
router.all("/", function(req, res) {
  res.send("Road2 via l'API simple 1.0.0");
});

// GetCapabilities
router.all("/getcapabilities", function(req, res) {

  // récupération du service
  let service = req.app.get("service");

  // récupération du uid
  let uid = service.apisManager.getApi("simple","1.0.0").uid;

  // récupération du getCapabilities précalculé dans init.js
  let getCapabilities = req.app.get(uid + "-getcap");

  res.set('content-type', 'application/json');
  res.status(200).json(getCapabilities);

});

// Route
// Pour effectuer un calcul d'itinéraire
router.route("/route")
  .get(async function(req, res, next) {

    // On récupère l'instance de Service pour faire les calculs
    let service = req.app.get("service");

    // on vérifie que l'on peut faire cette opération sur l'instance du service
    if (!service.verifyAvailabilityOperation("route")) {
      return next(errorManager.createError(" Operation not permitted on this service ", 400));
    }

    // on récupère l'ensemble des paramètres de la requête
    let parameters = req.query;

    try {

      // Vérification des paramètres de la requête
      const routeRequest = controller.checkRouteParameters(parameters, service);
      // Envoie au service et récupération de l'objet réponse
      const routeResponse = await service.computeRequest(routeRequest);
      // Formattage de la réponse
      const userResponse = controller.writeRouteResponse(routeRequest, routeResponse);

      res.set('content-type', 'application/json');
      res.status(200).json(userResponse);

    } catch (error) {
      return next(error);
    }

})
  .post(function(req, res) {
  res.send("/route en POST");
});

/* Génération d'isochrone. */
router.route("/isochrone")
  .get(async function(req, res, next) {
    let service = req.app.get("service");

    if (!service.verifyAvailabilityOperation("isochrone")) {
      return next(errorManager.createError(" Operation not permitted on this service ", 400));
    }

    let parameters = req.query;

    try {
      // Vérification des paramètres de la requête
      const isochroneRequest = controller.checkIsochroneParameters(parameters, service);
      // Envoie au service et récupération de l'objet réponse
      const isochroneResponse = await service.computeRequest(isochroneRequest);
      // Formattage de la réponse.
      const userResponse = controller.writeIsochroneResponse(isochroneRequest, isochroneResponse);

      res.status(200).json(userResponse);
      res.status(200).json({});
    } catch (error) {
      return next(error);
    }
  })
  .post(function(req, res) {
    res.send("/isochrone en POST");
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
  LOGGER.info({
    request: req.originalUrl,
    error: {
      errorType: err.code,
      message: err.message,
      stack: err.stack
    }
  });
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
  res.status(err.status || 500);
  res.json({ error: {errorType: err.code, message: err.message}});
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
  res.send({ error: "Not found" });
}

module.exports = router;
