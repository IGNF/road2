'use strict';


var express = require('express');
var router = express.Router();
const RouteRequest = require('../../../requests/routeRequest');
var LOGGER = global.log4js.getLogger("SIMPLE");
var PROXY = require('../../../proxy/proxy');

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

    // Vérification des paramètres de la requête de manière synchrone
    if (checkRouteParameters(req, res, next)) {

      // Transformation de la requête en objet pour le proxy
      var routeRequest = new RouteRequest(req.query.resource, req.query.start, req.query.end);

      // Envoie au proxy en asynchrone et récupération de l'objet réponse du proxy
      PROXY.computeRoute(routeRequest,

        // Callback de succes
        (routeResponse) => {
        // Formattage de la réponse de manière synchrone
        var userResponse = writeRouteResponse(routeResponse);
        // Envoie de la réponse
        res.status(200).json(userResponse);

        },
        // Callback d'erreur
        (err) => {
          return next(createError(500,err));
        }
      );

    } else {
      // FIXME: Normalement, si il y a eu problème, le programme ne doit pas passer ici
      // next(error(500," Bad request "));
    }


})
  .post(function(req, res) {
  res.send("/route en POST");
});

// Gestion des erreurs
// Cette partie doit être placée après la définition des routes normales
// ---
router.use(logError);
router.use(sendError);
// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
router.use(notFoundError);
// ---


/**
*
* @function
* @name checkRouteParameters
* @description Vérification des paramètres d'une requête sur /route
*
*/

function checkRouteParameters(req, res, next) {

  // Resource
  if (!req.query.resource) {
      return next(createError(400," Parameter 'resource' not found "));
  } else {
    // Vérification de la disponibilité de la ressource
  }

  // Start
  if (!req.query.start) {
      return next(createError(400," Parameter 'start' not found "));
  } else {
    // Vérification de la validité des coordonnées fournies
  }

  // End
  if (!req.query.end) {
      return next(createError(400," Parameter 'end' not found "));
  } else {
    // Vérification de la validité des coordonnées fournies
  }

  return true;

}



/**
*
* @function
* @name checkRouteParameters
* @description Vérification des paramètres d'une requête sur /route
*
*/

function writeRouteResponse(routeResponse) {

  return {response: true, write: "ok"};

}

/**
*
* @function
* @name createError
* @description Création d'une erreur
* create an error with .status. we
* can then use the property in our
* custom error handler (Connect repects this prop as well)
*
*/

function createError(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
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
