'use strict';

const fs = require('fs');
const path = require('path');

// Création du LOGGER
var LOGGER = global.log4js.getLogger("APISMANAGER");

module.exports = {

  /**
  *
  * @function
  * @name loadAPIS
  * @description Fonction utilisée pour charger l'ensemble des APIs disponibles dans le projet.
  * @param {express} app - Objet créé par ExpressJS représentant l'application 
  *
  */

  loadAPIS: function(app) {

    var APIsDirectory = path.resolve(__dirname,"../apis/");

    LOGGER.info("Chargement des APIS...");

    fs.readdirSync(APIsDirectory).forEach(apiName => {
      var APIDirectory = APIsDirectory + "/" + apiName;
      if (fs.statSync(APIDirectory).isDirectory()) {
        // c'est un dossier qui contient potentiellement une API

        LOGGER.info("Nouvelle API: " + apiName);

        fs.readdirSync(APIDirectory).forEach(apiVersion => {
          var APIDirectoryVersion = APIDirectory + "/" + apiVersion;
          if (fs.statSync(APIDirectoryVersion).isDirectory()) {
              // c'est un dossier qui contient potentiellement une version de l'API

              LOGGER.info("Nouvelle version: " + apiVersion);
              var APIFile = APIDirectoryVersion + "/index.js";
              //on cherche le fichier index.js qui contient la description de l'API
              if (fs.statSync(APIFile).isFile()) {
                // on peut charger l'API
                var api = require("../apis/" + apiName + "/" + apiVersion + "/index");

                app.use("/"+ apiName + "/" + apiVersion, api);

              } else {
                // le fichier index.js n'existe pas donc on ne fait rien
                LOGGER.error("Pas de fichier index.js dans le dossier " + APIDirectoryVersion);
              }

          } else {
            // Si ce n'est pas un dossier, on ne fait rien
          }
        });

      } else {
        // Si ce n'est pas un dossier, on ne fait rien
      }

    });

    LOGGER.info("APIS chargees.")

  }

}
