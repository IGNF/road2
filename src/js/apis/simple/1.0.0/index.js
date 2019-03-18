'use strict';


const express = require('express');
const RouteRequest = require('../../../requests/routeRequest');
const errorManager = require('../../../utils/errorManager');
const log4js = require('log4js');
const cors = require('cors');

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
  //création du getCapabilities
  let getCapabilities = {
    info: {
      name: "Calcul d'itinéraire"
    }
  };
  res.send(getCapabilities);
});

// Route
// Pour effectuer un calcul d'itinéraire
router.route("/route")
  .get(async function(req, res, next) {

    // On récupère l'instance de Service pour faire les calculs
    let service = req.app.get("service");

    try {

      // Vérification des paramètres de la requête
      const routeRequest = checkRouteParameters(req);
      // Envoie au service et récupération de l'objet réponse
      const routeResponse = await service.computeRequest(routeRequest);
      // Formattage de la réponse
      const userResponse = writeRouteResponse(routeResponse);

      res.status(200).json(userResponse);

    } catch (error) {
      return next(error);
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

function checkRouteParameters(req) {

  let resource;
  let start = {};
  let end = {};
  let profile;
  let optimization;
  let intermediatesPoints = new Array();
  let tmpStringCoordinates;

  // On récupère l'instance de Service pour des vérifications
  let service = req.app.get("service");

  // Resource
  if (!req.query.resource) {
      throw errorManager.createError(" Parameter 'resource' not found ", 400);
  } else {
    // Vérification de la disponibilité de la ressource et de la compatibilité de son type avec la requête
    if (!service.verifyResourceExistenceById(req.query.resource)) {
      throw errorManager.createError(" Parameter 'resource' is invalid ", 400);
    } else {
      resource = service.getResourceById(req.query.resource);
      // TODO: vérification de la compatibilité de son type avec la requête
    }
  }

  // Start
  if (!req.query.start) {
      throw errorManager.createError(" Parameter 'start' not found ", 400);
  } else {
    // Vérification de la validité des coordonnées fournies
    tmpStringCoordinates = req.query.start.match(/^(\d+\.?\d*),(\d+\.?\d*)/g);
    if (!tmpStringCoordinates) {
      throw errorManager.createError(" Parameter 'start' is invalid ", 400);
    } else {
      tmpStringCoordinates = tmpStringCoordinates[0].split(",");
      start.lon = Number(tmpStringCoordinates[0]);
      start.lat = Number(tmpStringCoordinates[1]);
      // TODO: vérification de l'inclusion des coordonnées dans la bbox de la ressource
    }
  }

  // End
  if (!req.query.end) {
      throw errorManager.createError(" Parameter 'end' not found ", 400);
  } else {
    // Vérification de la validité des coordonnées fournies
    tmpStringCoordinates = req.query.end.match(/^(\d+\.?\d*),(\d+\.?\d*)/g);
    if (!tmpStringCoordinates) {
      throw errorManager.createError(" Parameter 'end' is invalid ", 400);
    } else {
      tmpStringCoordinates = tmpStringCoordinates[0].split(",");
      end.lon = Number(tmpStringCoordinates[0]);
      end.lat = Number(tmpStringCoordinates[1]);
      // TODO: vérification de l'inclusion des coordonnées dans la bbox de la ressource
    }
  }

  // Profile and Optimization
  // ---

  if (!req.query.profile) {
    // Récupération du paramètre par défaut
    profile = resource.defaultProfile;
  } else {
    // TODO: vérification de la validité du paramètre
    profile = req.query.profile;
  }
  if (!req.query.optimization) {
    // Récupération du paramètre par défaut
    optimization = resource.defaultOptimization;
  } else {
    // TODO: vérification de la validité du paramètre
    optimization = req.query.optimization;
  }
  // Vérification de la validité du profile et de sa compatibilité avec l'optimisation
  if (!resource.linkedSource[profile+optimization]) {
    throw errorManager.createError(" Parameters 'profile' and 'optimization' are not compatible ", 400);
  }
  // ---

  // On définit la routeRequest avec les paramètres obligatoires
  let routeRequest = new RouteRequest(req.query.resource, start, end, profile, optimization);

  // On va vérifier la présence des paramètres non obligatoires pour l'API et l'objet RouteRequest

  // Points intermédiaires
  // ---
  if (req.query.intermediates) {

    // Vérification de la validité des coordonnées fournies
    let intermediatesTable = req.query.intermediates.split("|");

    // TODO: vérifier le nombre de point intermédiaires par rapport à la configuration

    for (let i = 0; i < intermediatesTable.length; i++) {

      tmpStringCoordinates = intermediatesTable[i].match(/^(\d+\.?\d*),(\d+\.?\d*)/g);

      if (!tmpStringCoordinates) {
        throw errorManager.createError(" Parameter 'intermediates' is invalid ", 400);
      } else {
        tmpStringCoordinates = tmpStringCoordinates[0].split(",");
        intermediatesPoints[i] = {};
        intermediatesPoints[i].lon = Number(tmpStringCoordinates[0]);
        intermediatesPoints[i].lat = Number(tmpStringCoordinates[1]);
        // TODO: vérification de l'inclusion des coordonnées dans la bbox de la ressource
      }

    }

    routeRequest.intermediates = intermediatesPoints;

  } else {
    // il n'y a rien à faire
  }
  // ---

  // getGeometry
  // ---
  if (req.query.getGeometry) {
    if (req.query.getGeometry === "true") {
      routeRequest.computeGeometry = true;
    } else {
      if (req.query.getGeometry === "false") {
        routeRequest.computeGeometry = false;
      } else {
        throw errorManager.createError(" Parameter 'getGeometry' is invalid ", 400);
      }
    }

  } else {
    // TODO: on met la valeur par défaut issue de la configuration
  }
  // ---

  return routeRequest;

}



/**
*
* @function
* @name writeRouteResponse
* @description Ré-écriture de la réponse d'un moteur pour une requête sur /route
*
*/

function writeRouteResponse(routeResponse) {

  let userResponse = {};
  let route = routeResponse.routes[0];

  // resource
  userResponse.resource = routeResponse.resource;

  // start
  userResponse.start = routeResponse.start;

  // end
  userResponse.end = routeResponse.end;

  // profile
  userResponse.profile = routeResponse.profile;

  // optimiszation
  userResponse.optimization = routeResponse.optimization;

  // geometry
  userResponse.geometry = route.geometry;

  // On ne considère que le premier itinéraire renvoyé par routeResponse
  // Portions
  userResponse.portions = new Array();

  for (let i = 0; i < route.portions.length; i++) {

    let currentPortion = {};

    // start
    currentPortion.start = route.portions[i].start;
    // end
    currentPortion.end = route.portions[i].end;

    // step
    currentPortion.steps = new Array();

    if (route.portions[i].steps.length !== 0) {
      for (let j = 0; j < route.portions[i].steps.length; j++) {

        let currentStep = {};

        currentStep.geometry = route.portions[i].steps[j].geometry;

        currentPortion.steps.push(currentStep);

      }
    } else {
      // il n'y a rien à ajouter
    }

    userResponse.portions.push(currentPortion);

  }

  return userResponse;

}

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
