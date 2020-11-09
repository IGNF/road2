'use strict';


const express = require('express');
const log4js = require('log4js');
const cors = require('cors');
const helmet = require('helmet');
const controller = require('./controller/controller');
const errorManager = require('../../../utils/errorManager');

var LOGGER = log4js.getLogger("SIMPLE");
var router = express.Router();

// CORS
// ---
// Pour cette API, on va appliquer les CORS sur l'ensemble du router
router.use(cors());
// ---

// Sécurisation de l'API
// --- 
// Gestion des en-têtes avec helmet selon les préconisations d'ExpressJS
router.use(helmet());
// ---

// POST
// ---
// Pour cette API, on va permettre la lecture des requêtes POST en parsant les contenus du type application/json
router.use(express.json(
  // Fonctions utilisées pour vérifier le body d'un POST et ainsi récupérer les erreurs
  {
    type: (req) => {
      // Le seul content-type accepté a toujours été application/json, on rend cela plus explicite
      // Cette fonction permet d'arrêter le traitement de la requête si le content-type n'est pas correct. 
      // Sans elle, le traitement continue.
      if (req.get('Content-Type') !== "application/json") {
        throw errorManager.createError(" Wrong Content-Type. Must be 'application/json' ", 400);
      } else {
        return true;
      }
    },
    verify: (req, res, buf, encoding) => {
      // Cette fonction permet de vérifier que le JSON envoyé est valide. 
      // Si ce n'est pas le cas, le traitement de la requête est arrêté. 
      try {
        JSON.parse(buf);
      } catch (error) {
        throw errorManager.createError("Invalid request body. Error during the parsing of the body: " + error.message, 400);
      }
    }
  }
)); 
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
      const routeRequest = controller.checkRouteParameters(parameters, service, "GET");
      // Envoie au service et récupération de l'objet réponse
      const routeResponse = await service.computeRequest(routeRequest);
      // Formattage de la réponse
      const userResponse = controller.writeRouteResponse(routeRequest, routeResponse, service);

      res.set('content-type', 'application/json');
      res.status(200).json(userResponse);

    } catch (error) {
      return next(error);
    }

  })

  .post(async function(req, res, next) {

    // On récupère l'instance de Service pour faire les calculs
    let service = req.app.get("service");

    // on vérifie que l'on peut faire cette opération sur l'instance du service
    if (!service.verifyAvailabilityOperation("route")) {
      return next(errorManager.createError(" Operation not permitted on this service ", 400));
    }

    // on récupère l'ensemble des paramètres de la requête
    let parameters = req.body;

    try {

      // Vérification des paramètres de la requête
      const routeRequest = controller.checkRouteParameters(parameters, service, "POST");
      // Envoie au service et récupération de l'objet réponse
      const routeResponse = await service.computeRequest(routeRequest);
      // Formattage de la réponse
      const userResponse = controller.writeRouteResponse(routeRequest, routeResponse, service);

      res.set('content-type', 'application/json');
      res.status(200).json(userResponse);

    } catch (error) {
      return next(error);
    }

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
      const isochroneRequest = controller.checkIsochroneParameters(parameters, service, "GET");
      // Envoie au service et récupération de l'objet réponse
      const isochroneResponse = await service.computeRequest(isochroneRequest);
      // Formattage de la réponse.
      const userResponse = controller.writeIsochroneResponse(isochroneRequest, isochroneResponse, service);

      res.set('content-type', 'application/json');
      res.status(200).json(userResponse);
    } catch (error) {
      return next(error);
    }
  })

  .post(async function(req, res, next) {
    let service = req.app.get("service");

    if (!service.verifyAvailabilityOperation("isochrone")) {
      return next(errorManager.createError(" Operation not permitted on this service ", 400));
    }

    let parameters = req.body;

    try {
      // Vérification des paramètres de la requête
      const isochroneRequest = controller.checkIsochroneParameters(parameters, service, "POST");
      // Envoie au service et récupération de l'objet réponse
      const isochroneResponse = await service.computeRequest(isochroneRequest);
      // Formattage de la réponse.
      const userResponse = controller.writeIsochroneResponse(isochroneRequest, isochroneResponse, service);

      res.set('content-type', 'application/json');
      res.status(200).json(userResponse);
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
  LOGGER.error({
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
  // On ne veut pas le même comportement en prod et en dev 
  if (process.env.NODE_ENV === "production") {
    if (err.status) {
      // S'il y a un status dans le code, alors cela veut dire qu'on veut remonter l'erreur au client 
      res.status(err.status);
      res.json({ error: {errorType: err.code, message: err.message}});
    } else {
      // S'il n'y a pas de status dans le code alors on ne veut pas remonter l'erreur 
      res.status(500);
      res.json({ error: {errorType: "internal", message: "Internal Server Error"}});
    }
  } else if ((process.env.NODE_ENV === "debug")) {
      res.status(err.status || 500);
      res.json({ error: {errorType: err.code,
        message: err.message,
        stack: err.stack,
        // utile lorsqu'une erreur sql remonte
        more: err
      }});
  } else {
    // En dev, on veut faire remonter n'importe quelle erreur 
    res.status(err.status || 500);
    res.json({ error: {errorType: err.code, message: err.message}});
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
  res.send({ error: "Not found" });
}

module.exports = router;
