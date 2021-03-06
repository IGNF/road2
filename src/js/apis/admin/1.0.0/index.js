'use strict';


const express = require('express');
const log4js = require('log4js');
const packageJSON = require('../../../../../package.json');

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
// TODO: implémenter une véritable vérification de l'état
router.route("/health")

  .get(async function(req, res, next) {

    LOGGER.debug("requete GET sur /admin/1.0.0/health?");
    LOGGER.debug(req.originalUrl);

    res.set('content-type', 'application/json');
    res.status(200).json({
      "state": "green"
    });

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
