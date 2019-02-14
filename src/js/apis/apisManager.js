'use strict';

const fs = require('fs');
const path = require('path');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("APISMANAGER");

module.exports = class apisManager {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe resourceManager
  *
  */
  constructor() {

    // Liste des routes chargées par app
    this._listOfRoutes = [];

  }

  /**
  *
  * @function
  * @name loadAPISDirectory
  * @description Fonction utilisée pour charger l'ensemble des APIs disponibles dans un dossier.
  * @param {express} app - Objet créé par ExpressJS représentant l'application
  * @param {string} dir - Dossier contenant les routers à charger dans app
  * @param {string} prefix - Préfixe utilisé pour chaque router ajouté
  *
  */

  loadAPISDirectory (app, dir, prefix) {

    var APIsDirectory = path.resolve(__dirname, dir);

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

                var route;

                if (prefix !== "") {
                  route = "/" + prefix + "/" + apiName + "/" + apiVersion;
                } else {
                  route = "/"+ apiName + "/" + apiVersion;
                }

                // On vérifie que la route n'existe pas déjà
                if (this.verifyRouteExistanceById(route)) {
                  // Si elle existe c'est un vrai problème donc on arrête le chargement
                  LOGGER.error("La route " + route + " existe deja. Elle n'est donc pas chargée.");
                  return false;
                }

                // on peut charger l'API
                var api = require("../apis/" + apiName + "/" + apiVersion + "/index");

                app.use(route, api);
                this._listOfRoutes.push(route);

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
    return true;

  }

  /**
  *
  * @function
  * @name verifyRouteExistanceById
  * @description Fonction utilisée pour vérifier que la route n'est pas déjà chargée
  * @param {string} route - Route à tester
  * @return {boolean} true si la route est déjà présente et false sinon
  *
  */

  verifyRouteExistanceById (route) {

    for (var i = 0; i < this._listOfRoutes.length; i++) {
      if (this._listOfRoutes[i] === route) {
        return true;
      }
    }

    return false;

  }

}
