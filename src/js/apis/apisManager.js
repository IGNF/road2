'use strict';

const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const Api = require('./api');

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

    // Dossier contenant les APIs du projet
    this._apisDirectory = "../apis/";

    // Prefix utilisé pour chaque route des APIS
    this._prefix = "";

    // Liste des routes chargées par l'app Express
    this._listOfRoutes = new Array();

    // Catalogue des apis
    this._apisCatalog = {};

  }

  /**
  *
  * @function
  * @name get apisDirectory
  * @description Récupérer le chemin du dossier qui contient les APIs
  *
  */
  get apisDirectory () {
    return this._apisDirectory;
  }

  /**
  *
  * @function
  * @name get prefix
  * @description Récupérer le prefix utilisé par ce manager
  *
  */
  get prefix () {
    return this._prefix;
  }

  /**
  *
  * @function
  * @name get listOfRoutes
  * @description Récupérer la liste des routes disponibles via ce manager
  *
  */
  get listOfRoutes () {
    return this._listOfRoutes;
  }

  /**
  *
  * @function
  * @name get apisCatalog
  * @description Récupérer la liste des apis disponibles via ce manager
  *
  */
  get apisCatalog () {
    return this._apisCatalog;
  }

  /**
  *
  * @function
  * @name getApi
  * @description Récupérer l'api qui correspond à l'id et la version demandée
  * @param {string} name - Nom de l'api concerné (simple)
  * @param {string} version - Version de l'api concerné (1.0.0) 
  * 
  */
  getApi (name, version) {
    return this._apisCatalog[name+version];
  }

  /**
  *
  * @function
  * @name checkApiConfiguration
  * @description Vérifier la configuration d'une API 
  * @param {object} configuration - Configuration de l'API à vérifier
  * @return {boolean} 
  *
  */
  checkApiConfiguration (configuration) {

    // Nom de l'API 
    if (!configuration.name) {

      LOGGER.error("Mauvaise configuration de l'api: 'name' absent.");
      return false;

    } else {

      if (typeof configuration.name !== "string") {
        LOGGER.error("Mauvaise configuration: 'name' n'est pas une string.");
        return false;
      } else {

        // On vérifie que le dossier correspondant existe
        let tmpPathName = path.resolve(__dirname, this._apisDirectory) + "/" + configuration.name;
        let availableAPI = false;
        try {
          availableAPI= fs.statSync(tmpPathName).isDirectory()
        } catch(error) {
          LOGGER.error("Mauvaise configuration: 'name' ne peut être évalué.");
          return false;
        }
        
        if (!availableAPI) {
          LOGGER.error("Mauvaise configuration de l'api: 'name' n'est pas disponible.");
          return false;
        } else {

          // Version de l'API 
          if (!configuration.version) {
            LOGGER.error("Mauvaise configuration de l'api: 'version' absent.");
            return false;
          } else {

            if (typeof configuration.name !== "string") {
              LOGGER.error("Mauvaise configuration de l'api: 'name' n'est pas une string.");
              return false;
            } else {
      
              // On vérifie que le dossier correspondant existe
              let tmpPathVersion = tmpPathName + "/" + configuration.version;
              let availableVersion = false;

              try {
                availableVersion= fs.statSync(tmpPathVersion).isDirectory()
              } catch(error) {
                LOGGER.error("Mauvaise configuration de l'api: 'version' ne peut être évalué.");
                return false;
              }

              if (!availableVersion) {
                LOGGER.error("Mauvaise configuration de l'api: 'version' n'est pas disponible.");
                return false;
              } else {

                // On vérifie qu'il y a au moins un index.js
                let tmpIndex = tmpPathVersion + "/index.js";
                try {
                  fs.accessSync(tmpIndex, fs.constants.R_OK);
                  return true;
                } catch (err) {
                  LOGGER.error("Le fichier " + tmpIndex + " ne peut etre lu.");
                  return false;
                }

              }

            }

          }

        }

      }

    }

  }

  /**
  *
  * @function
  * @name loadApiDirectory
  * @description Fonction utilisée pour charger l'ensemble des APIs disponibles dans un dossier.
  * @param {express} app - Objet créé par ExpressJS représentant l'application
  *
  */

  loadApiDirectory (app) {

    LOGGER.info("Chargement des APIS...");

    // Soit _apisDirectory est un chemin absolu qui pointe vers un autre repo d'APIs, soit c'est celui du repo officiel de Road2 (usage de __dirname)
    let APIsDirectory = path.resolve(__dirname, this._apisDirectory);

    // on lit le contenu du dossier
    let APIsDirectoryTable = new Array();

    try {
      APIsDirectoryTable = fs.readdirSync(APIsDirectory);
    } catch (error) {
      LOGGER.error("Le dossier n'est pas lisible: " + APIsDirectory);
      LOGGER.error(error);
      return false;
    }

    // S'il est vide ce n'est pas normal
    if (APIsDirectoryTable.length === 0) {
      LOGGER.error("Le dossier des apis est vide.");
      return false;
    }

    // Pour chaque sous-dossier on a potentiellement une api
    for (let i = 0; i < APIsDirectoryTable.length; i++) {

      let apiName = APIsDirectoryTable[i];

      let APIDirectory = APIsDirectory + "/" + apiName;

      if (fs.statSync(APIDirectory).isDirectory()) {
        // c'est un dossier qui contient potentiellement une API

        LOGGER.info("Nouvelle API: " + apiName);

        let APIDirectoryTable = fs.readdirSync(APIDirectory);

        if (APIDirectoryTable.length === 0) {
          LOGGER.error("Le dossier de l'api est vide.");
          return false;
        }

        for (let j = 0; j < APIDirectoryTable.length; j++) {

          let apiVersion = APIDirectoryTable[j];

          let APIDirectoryVersion = APIDirectory + "/" + apiVersion;

          if (fs.statSync(APIDirectoryVersion).isDirectory()) {
              // c'est un dossier qui contient potentiellement une version de l'API

              LOGGER.info("Nouvelle version: " + apiVersion);

              let configuration = {
                name: apiName,
                version: apiVersion 
              };

              if (!this.loadApiConfiguration(app, configuration)) {
                LOGGER.error("Impossible de charger l'API " + apiName + "/" + apiVersion);
              }

          } else {
            // Si ce n'est pas un dossier, on ne fait rien
          }

        }

      } else {
        // Si ce n'est pas un dossier, on ne fait rien
      }

    }

    LOGGER.info("APIS chargees.");
    return true;

  }

  /**
  *
  * @function
  * @name loadApiConfiguration
  * @description Fonction utilisée pour charger l'API d'un seul dossier
  * @param {express} app - Objet créé par ExpressJS représentant l'application
  * @param {object} configuration - Configuration d'une API 
  *
  */

  loadApiConfiguration (app, configuration) {

    let apiName = configuration.name;
    let apiVersion = configuration.version;

    // Soit _apisDirectory est un chemin absolu qui pointe vers un autre repo d'APIs, soit c'est celui du repo officiel de Road2 (usage de __dirname)
    let APIDirectory = path.resolve(__dirname, this._apisDirectory) + "/" + apiName + "/" + apiVersion;

    let APIFile = APIDirectory + "/index.js";
    //on cherche le fichier index.js qui contient la description de l'API
    if (fs.statSync(APIFile).isFile()) {

      // Gestion du router
      // ------------------
      let route;

      if (this._prefix !== "") {
        route = "/" + this._prefix + "/" + apiName + "/" + apiVersion;
      } else {
        route = "/"+ apiName + "/" + apiVersion;
      }

      // On vérifie que la route n'existe pas déjà
      if (this.verifyRouteExistanceById(route)) {
        // Si elle existe c'est un vrai problème donc on arrête le chargement
        LOGGER.error("La route " + route + " existe deja. L'api n'est donc pas chargee.");
        return false;
      }

      // on crée un objet Api qui va permettre de suivre l'évolution de l'api au cours de la vie du service
      let api = new Api(apiName, apiVersion, APIFile);

      // Gestion de l'initialisation de l'api
      // ----------------------
      let initFile = APIDirectory + "/init.js";
      try {

        fs.statSync(initFile);
        api.initFile = initFile;

      } catch(err) {
        // Ce n'est pas obligatoire, on ne fait donc rien
      }

      // ----------------------

      // Gestion de l'update de l'api
      // ----------------------
      let updateFile = APIDirectory + "/update.js";
      try {

        fs.statSync(updateFile);
        api.updateFile = updateFile;

      } catch(err) {
        // Ce n'est pas obligatoire, on ne fait donc rien
      }
      // ----------------------

      if (!api.initialize(route, app)) {
        LOGGER.error("L'initialisation de l'api s'est mal deroulee.");
        return false;
      }

      // on stocke l'objet Api dans l'apisManager
      this._apisCatalog[apiName+apiVersion] = api;
      // on stocke la route
      this._listOfRoutes.push(route);

      return true;

    } else {
      // le fichier index.js n'existe pas donc on ne fait rien
      LOGGER.error("Pas de fichier index.js dans le dossier " + APIDirectory);
      return false;
    }

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

    for (let i = 0; i < this._listOfRoutes.length; i++) {
      if (this._listOfRoutes[i] === route) {
        return true;
      }
    }

    return false;

  }

}
