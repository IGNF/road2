'use strict';


const path = require('path');
const express = require('express');
const log4js = require('log4js');
const controller = require('./controller/controller');
const errorManager = require('../../../utils/errorManager');
const swaggerUi = require('swagger-ui-express');

var LOGGER = log4js.getLogger("OSRM");
var router = express.Router();

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
  LOGGER.debug("requete sur /osrm/1.0.0/");
  res.send("Road2 via l'API OSRM 1.0.0");
});


// swagger-ui
var apiJsonPath = path.join(__dirname, '..', '..', '..','..','..', 'documentation','apis','osrm', '1.0.0', 'api.json');
LOGGER.info("Utilisation fichier .json '"+ apiJsonPath + "' pour initialisation swagger-ui de l'API OSRM en version 1.0.0");
var swaggerDocument = require(apiJsonPath);
router.use('/openapi', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GetCapabilities
router.all("/resources", function(req, res) {

  LOGGER.debug("requete sur /osrm/1.0.0/resources?");

  // récupération du service
  let service = req.app.get("service");

  // récupération du uid
  let uid = service.apisManager.getApi("osrm","1.0.0").uid;
  LOGGER.debug(uid);

  // récupération du getCapabilities précalculé dans init.js
  let getCapabilities = req.app.get(uid + "-getcap");
  LOGGER.debug(getCapabilities);

  // Modification si Host ou X-Forwarded-Host précisè dans l'en-tête de la requête 
  // il est récupéré par express dans req.host
  if (req.hostname) {

    // TODO : corriger avec quelque chose du genre ^http(s)?:\/\/(.+) puis split au premier /
    let regexpHost = /^http[s]?:\/\/[\w\d:-_\.]*\//;

    try {
      getCapabilities.info.url = getCapabilities.info.url.replace(regexpHost, req.protocol + "://" + req.hostname + "/");
    } catch(error) {
      // on renvoit le getcap par défaut
    }

  } else {
    // il y a déjà une valeur par défaut
  }

  res.set('content-type', 'application/json');
  res.status(200).json(getCapabilities);

});

// Route
// Pour effectuer un calcul d'itinéraire
router.route("/:resource/:profile/:optimization/route/v1/_/:coordinates")

  .get(async function(req, res, next) {

    LOGGER.debug("requete GET sur /osrm/1.0.0/:resource");
    LOGGER.debug(req.originalUrl);

    // On récupère l'instance de Service pour faire les calculs
    let service = req.app.get("service");

    // on vérifie que l'on peut faire cette opération sur l'instance du service
    if (!service.verifyAvailabilityOperation("route")) {
      return next(errorManager.createError(" Operation not permitted on this service ", 400));
    }

    // on récupère l'ensemble des paramètres de la requête
    let path_parameters = req.params
    let query_parameters = req.query;
    let parameters = {}
    for (const key in query_parameters) {
      parameters[key] = query_parameters[key]
    }
    for (const key in path_parameters) {
      parameters[key] = path_parameters[key]
    }
    LOGGER.debug(parameters);

    try {

      // Vérification des paramètres de la requête
      const routeRequest = controller.checkRouteParameters(parameters, service, "GET");
      LOGGER.debug(routeRequest);

    } catch (error) {
      return next(error);
    }   


    return next(errorManager.createError(" Operation not implemented yet on this service ", 501));

  })

  .post(async function(req, res, next) {

    LOGGER.debug("requete POST sur /osrm/1.0.0/:resource/");
    LOGGER.debug(req.originalUrl);
    return next(errorManager.createError(" Operation not implemented yet on this service ", 501));
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
      errorType: err.code,
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
