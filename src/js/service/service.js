'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
var apisManager = require('../apis/apisManager');
var pm = require('../utils/processManager.js');
var ResourceManager = require('../resources/resourceManager');
var SourceManager = require('../sources/sourceManager');
const log4js = require('log4js');
const nconf = require('nconf');

// Création du LOGGER
var LOGGER = log4js.getLogger("SERVICE");

/**
*
* @class
* @name Service
* @description Il n'y a qu'un service par instance. Un service regroupe l'ensemble des informations utiles pour répondre aux requêtes.
*
*/

module.exports = class Service {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Service
  *
  */
  constructor() {

    // Manager des ressources du service.
    this._resourceManager = new ResourceManager();

    // catalogue des ressources du service.
    this._resourceCatalog = {};

    // Manager des sources du service.
    this._sourceManager = new SourceManager();

    // catalogue des sources du service.
    this._sourceCatalog = {};

  }

  /**
  *
  * @function
  * @name get resourceCatalog
  * @description Récupérer l'ensemble des ressources
  *
  */
  get resourceCatalog() {
    return this._resourceCatalog;
  }

  /**
  *
  * @function
  * @name getResourceById
  * @description Récupérer une ressource par son id
  *
  */
  getResourceById(id) {
    return this._resourceCatalog[id];
  }

  /**
  *
  * @function
  * @name verifyResourceExistenceById
  * @description Savoir si une ressource existe à partir de son id
  *
  */
  verifyResourceExistenceById(id) {
    if (this._resourceCatalog[id]) {
      return true;
    } else {
      return false;
    }
  }

  /**
  *
  * @function
  * @name get sourceCatalog
  * @description Récupérer l'ensemble des sources
  *
  */
  get sourceCatalog() {
    return this._sourceCatalog;
  }

  /**
  *
  * @function
  * @name getSourceById
  * @description Récupérer une source par son id
  *
  */
  getSourceById(id) {
    return this._sourceCatalog[id];
  }

  /**
  *
  * @function
  * @name verifySourceExistenceById
  * @description Savoir si une ressource existe à partir de son id
  *
  */
  verifySourceExistenceById(id) {
    if (this._sourceCatalog[id]) {
      return true;
    } else {
      return false;
    }
  }

  /**
  *
  * @function
  * @name checkGlobalConfiguration
  * @description Vérification de la configuration globale du serveur
  *
  */

  checkGlobalConfiguration() {

    LOGGER.info("Verification de la configuration globale de l'application...");

    // Configuration de l'application
    if (!nconf.get("application")) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application' manquant !");
      pm.shutdown(1);
    }
    // Nom de l'application
    if (!nconf.get("application:name")) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:name' manquant !");
      pm.shutdown(1);
    }
    // Titre de l'application
    if (!nconf.get("application:title")) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:title' manquant !");
      pm.shutdown(1);
    }
    // Description de l'application
    if (!nconf.get("application:description")) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:description' manquant !");
      pm.shutdown(1);
    }
    // Information sur le fournisseur du service
    if (nconf.get("application:provider")) {
      // Nom
      if (!nconf.get("application:provider:name")) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:provider:name' manquant !");
        pm.shutdown(1);
      }
      // Site
      if (!nconf.get("application:provider:site")) {
        LOGGER.info("Le champ 'application:provider:site' n'est pas renseigne.");
      }
      // Mail
      if (!nconf.get("application:provider:mail")) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:provider:mail' manquant !");
        pm.shutdown(1);
      }
    } else {
      LOGGER.warn("Configuration incomplete: Objet 'application:provider' manquant !");
    }
    // Information sur les ressources
    if (nconf.get("application:resources")) {
      // Dossier contenant les fichiers de ressources
      if (!nconf.get("application:resources:directory")) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:resources:directory' manquant !");
        pm.shutdown(1);
      } else {
        // On vérifie que le dossier existe et qu'il contient des fichiers de description des ressources
        var directory =  path.resolve(__dirname,nconf.get("application:resources:directory"));
        if (fs.existsSync(directory)) {
          // On vérifie que l'application peut lire les fichiers du dossier
          fs.readdirSync(directory).forEach(resource => {
            try {
              var file = directory + "/" + resource;
              fs.accessSync(file, fs.constants.R_OK);
            } catch (err) {
              LOGGER.error("Le fichier " + file + " ne peut etre lu.");
            }
          });
        } else {
          LOGGER.fatal("Mauvaise configuration: Le dossier " + directory + " n'existe pas.");
          pm.shutdown(1);
        }
      }
    } else {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:resources' manquant !");
      pm.shutdown(1);
    }
    // Information sur le reseau
    if (!nconf.get("ROAD2_HOST")) {
      if (nconf.get("application:network")) {
        // Host
        if (!nconf.get("application:network:host")) {
          LOGGER.info("Le champ 'application:network:host' n'est pas renseigne.");
          nconf.set("ROAD2_HOST","0.0.0.0");
        } else {
          nconf.set("ROAD2_HOST",nconf.get("application:network:host"));
        }
      } else {
        LOGGER.info("L'objet 'application:network:host' n'est pas renseigne.");
        nconf.set("ROAD2_HOST","0.0.0.0");
      }
    }
    if (!nconf.get("ROAD2_PORT")) {
      if (nconf.get("application:network")) {
        // Port
        if (!nconf.get("application:network:port")) {
          LOGGER.info("Le champ 'application:network:port' n'est pas renseigne.");
          nconf.set("ROAD2_PORT","8080");
        } else {
          nconf.set("ROAD2_PORT",nconf.get("application:network:port"));
        }
      } else {
        LOGGER.info("L'objet 'application:network:port' n'est pas renseigne.");
        nconf.set("ROAD2_PORT","8080");
      }
    }

    LOGGER.info("Verification terminee.");

  }

  /**
  *
  * @function
  * @name loadResources
  * @description Chargement des ressources
  *
  */

  loadResources() {

    LOGGER.info("Chargement des ressources...");

    var resourceDirectory =  path.resolve(__dirname,nconf.get("application:resources:directory"));

    // Pour chaque fichier du dossier des ressources, on crée une ressource
    fs.readdirSync(resourceDirectory).forEach(fileName => {
      var resourceFile = resourceDirectory + "/" + fileName;
      LOGGER.info("Chargement de: " + resourceFile);

      // Récupération du contenu en objet pour vérification puis création de la ressource
      var resourceContent = JSON.parse(fs.readFileSync(resourceFile));
      LOGGER.debug(resourceContent);

      // Vérification du contenu
      if (!this._resourceManager.checkResource(resourceContent,this._sourceManager)) {
        LOGGER.error("Erreur lors du chargement de: " + resourceFile);
      } else {
        // Création de la ressource
        this._resourceCatalog[resourceContent.resource.id] = this._resourceManager.createResource(resourceContent);
      }

    });

  }

  /**
  *
  * @function
  * @name loadSources
  * @description Chargement des sources
  *
  */

  loadSources() {

    LOGGER.info("Chargement des sources...");

    // On récupère les informations du resourceManager pour les intégrer au sourceManager du service
    var listOfSourceIds = this._sourceManager.listOfSourceIds;
    var sourceDescriptions = this._sourceManager.sourceDescriptions;

    // On va créer chaque source
    if (listOfSourceIds.length != 0) {
      // On va charger chaque source identifiée
      for (var i = 0; i < listOfSourceIds.length; i++) {

        var sourceId = listOfSourceIds[i];
        LOGGER.info("Chargement de la source: " + sourceId);
        LOGGER.debug(sourceDescriptions[sourceId]);

        // On crée la source
        var currentSource = this._sourceManager.createSource(sourceDescriptions[sourceId]);

        // On vérifie que le source peut bien être chargée ou connectée
        if (this._sourceManager.connectSource(currentSource)) {
          // On la stocke
          this._sourceCatalog[sourceId] = currentSource;

        } else {
          // on n'a pas pu se connecter à la source
          LOGGER.fatal("Impossible de se connecter a la source: " + sourceId);
          pm.shutdown(1);
        }

      }

    } else {
      LOGGER.fatal("Il n'y a aucune source a charger.");
      pm.shutdown(1);
    }

  }

  /**
  *
  * @function
  * @name createServer
  * @description Création du serveur
  *
  */

  createServer() {

    LOGGER.info("Creation de l'application web...");

    // Application Express
    var road2 = express();

    // Pour le log des requêtes reçues sur le service avec la syntaxe
    LOGGER.info("Instanciation du logger pour les requêtes...");
    road2.use(log4js.connectLogger(log4js.getLogger('request'), {
      level: nconf.get("httpConf").level,
      format: (req, res, format) => format(nconf.get("httpConf").format)
    }));

    // Chargement des APIs
    apisManager.loadAPISDirectory(road2,"../apis/","");

    road2.all('/', (req, res) => {
      res.send('Road2 is running !! \n');
    });

    // Prêt à écouter
    road2.listen(nconf.get("ROAD2_PORT"), nconf.get("ROAD2_HOST"));
    LOGGER.info(`Road2 est fonctionnel (http://${nconf.get("ROAD2_HOST")}:${nconf.get("ROAD2_PORT")})`);

  }


}
