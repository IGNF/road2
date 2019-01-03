'use strict';


var express = require('express');
var router = express.Router();
var LOGGER = global.log4js.getLogger("SIMPLE");

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
  .get(function(req, res) {

    LOGGER.debug("Gestion de la requête GET sur /route");

    // Vérification des paramètres de la requête
    checkRouteParameters(req,res);

    // Transformation de la requête en objet pour le proxy

    // Envoie au proxy et récupération de l'objet réponse du proxy

    // Formattage de la réponse

    // Envoie de la réponse
    res.send("/route en GET");

})
  .post(function(req, res) {
  res.send("/route en POST");
});

/**
*
* @function
* @name checkRouteParameters
* @description Vérification des paramètres d'une requête sur /route
*
*/

function checkRouteParameters(req,res) {

  LOGGER.debug("Verification des parametres de la requete...");

  // Resource
  if (!req.query.resource) {
      LOGGER.debug("Parametre 'resource' absent.");
      res.status(400).json({ error: { errorType: "Bad Request", message: " Parameter 'resource' not found "}});
  } else {
    // Vérification de la disponibilité de la ressource
  }

  // Start
  if (!req.query.start) {
      LOGGER.debug("Parametre 'start' absent.");
      res.status(400).json({ error: { errorType: "Bad Request", message: " Parameter 'start' not found "}});
  } else {
    // Vérification de la validité des coordonnées fournies
  }

  // End
  if (!req.query.end) {
      LOGGER.debug("Parametre 'end' absent.");
      res.status(400).json({ error: { errorType: "Bad Request", message: " Parameter 'end' not found "}});
  } else {
    // Vérification de la validité des coordonnées fournies
  }

}

module.exports = router;
