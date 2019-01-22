'use strict';


var express = require('express');
var router = express.Router();
const RouteRequest = require('../../../requests/routeRequest');
var errorManager = require('../../../utils/errorManager');
var LOGGER = global.log4js.getLogger("SIMPLE");
var PROXY = require('../../../proxy/proxy');
var async = require('async');

// Accueil de l'API
router.all("/", function(req, res) {
  res.send("Road2 via l'API simple 1.0.0");
});

// GetCapabilities
router.all("/getcapabilities", function(req, res) {
  //création du getCapabilities
  var getCapabilities = {
    info: {
      name: "Calcul d'itinéraire"
    }
  };
  res.send(getCapabilities);
});

// Route
// Pour effectuer un calcul d'itinéraire
router.route("/route")
  .get(function(req, res, next) {

    async.waterfall(
      [
        // Vérification des paramètres de la requête
        async.apply(checkRouteParameters, req),
        // Envoie au proxy et récupération de l'objet réponse du proxy
        PROXY.computeRoute,
        // Formattage de la réponse
        writeRouteResponse
      ],
      function (error, result) {
        if (error) {
          return next(error);
        } else {
          res.status(200).json(result);
        }
      }

    );

})
  .post(function(req, res) {
  res.send("/route en POST");
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
* @name checkRouteParameters
* @description Vérification des paramètres d'une requête sur /route
*
*/

function checkRouteParameters(req, callback) {

  // Resource
  if (!req.query.resource) {
      callback(errorManager.createError(" Parameter 'resource' not found ", 400));
      return;
  } else {
    // Vérification de la disponibilité de la ressource
  }

  // Start
  if (!req.query.start) {
      callback(errorManager.createError(" Parameter 'start' not found ", 400));
      return;
  } else {
    // Vérification de la validité des coordonnées fournies
  }

  // End
  if (!req.query.end) {
      callback(errorManager.createError(" Parameter 'end' not found ", 400));
      return;
  } else {
    // Vérification de la validité des coordonnées fournies
  }

  var routeRequest = new RouteRequest(req.query.resource, req.query.start, req.query.end);

  callback(null, routeRequest);
  return;

}



/**
*
* @function
* @name writeRouteResponse
* @description Ré-écriture de la réponse d'un moteur pour une requête sur /route
*
*/

function writeRouteResponse(routeResponse, callback) {

  callback(null, {response: true, write: "ok"});

}

/**
*
* @function
* @name logError
* @description Callback pour écrire l'erreur dans les logs
*
*/

function logError(err, req, res, next) {
  LOGGER.debug({
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
