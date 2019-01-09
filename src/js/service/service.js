'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
var apisManager = require('../utils/apisManager');
var pm = require('../utils/processManager.js');
var resourceManager = require('../resources/resourceManager');

// Création du LOGGER
var LOGGER = global.log4js.getLogger("SERVICE");

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
    if (!global.nconf.get("application")) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application' manquant !");
      pm.shutdown(1);
    }
    // Nom de l'application
    if (!global.nconf.get("application:name")) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:name' manquant !");
      pm.shutdown(1);
    }
    // Titre de l'application
    if (!global.nconf.get("application:title")) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:title' manquant !");
      pm.shutdown(1);
    }
    // Description de l'application
    if (!global.nconf.get("application:description")) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:description' manquant !");
      pm.shutdown(1);
    }
    // Information sur le fournisseur du service
    if (global.nconf.get("application:provider")) {
      // Nom
      if (!global.nconf.get("application:provider:name")) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:provider:name' manquant !");
        pm.shutdown(1);
      }
      // Site
      if (!global.nconf.get("application:provider:site")) {
        LOGGER.info("Le champ 'application:provider:site' n'est pas renseigne.");
      }
      // Mail
      if (!global.nconf.get("application:provider:mail")) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:provider:mail' manquant !");
        pm.shutdown(1);
      }
    } else {
      LOGGER.warn("Configuration incomplete: Objet 'application:provider' manquant !");
    }
    // Information sur les ressources
    if (global.nconf.get("application:resources")) {
      // Dossier contenant les fichiers de ressources
      if (!global.nconf.get("application:resources:directory")) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:resources:directory' manquant !");
        pm.shutdown(1);
      } else {
        // On vérifie que le dossier existe et qu'il contient des fichiers de description des ressources
        var directory =  path.resolve(__dirname,global.nconf.get("application:resources:directory"));
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
    if (!global.nconf.get("ROAD2_HOST")) {
      if (global.nconf.get("application:network")) {
        // Host
        if (!global.nconf.get("application:network:host")) {
          LOGGER.info("Le champ 'application:network:host' n'est pas renseigne.");
          global.nconf.set("ROAD2_HOST","0.0.0.0");
        } else {
          global.nconf.set("ROAD2_HOST",global.nconf.get("application:network:host"));
        }
      } else {
        LOGGER.info("L'objet 'application:network:host' n'est pas renseigne.");
        global.nconf.set("ROAD2_HOST","0.0.0.0");
      }
    }
    if (!global.nconf.get("ROAD2_PORT")) {
      if (global.nconf.get("application:network")) {
        // Port
        if (!global.nconf.get("application:network:port")) {
          LOGGER.info("Le champ 'application:network:port' n'est pas renseigne.");
          global.nconf.set("ROAD2_PORT","8080");
        } else {
          global.nconf.set("ROAD2_PORT",global.nconf.get("application:network:port"));
        }
      } else {
        LOGGER.info("L'objet 'application:network:port' n'est pas renseigne.");
        global.nconf.set("ROAD2_PORT","8080");
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

    var resourceDirectory =  path.resolve(__dirname,global.nconf.get("application:resources:directory"));

    // Pour chaque fichier du dossier des ressources, on crée une ressource
    fs.readdirSync(resourceDirectory).forEach(fileName => {
      var resourceFile = resourceDirectory + "/" + fileName;
      LOGGER.info("Chargement de: " + resourceFile);

      // Récupération du contenu en objet pour vérification puis création de la ressource
      var resourceContent = JSON.parse(fs.readFileSync(resourceFile));
      LOGGER.debug(resourceContent);

      // Vérification du contenu
      if (!resourceManager.checkResource(resourceContent)) {
        LOGGER.error("Erreur lors du chargement de: " + resourceFile);
      } else {
        // Création de la ressource
      }

    });

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
    road2.use(global.log4js.connectLogger(global.log4js.getLogger('request'), {
      level: global.nconf.get("httpConf").level,
      format: (req, res, format) => format(global.nconf.get("httpConf").format)
    }));

    // Chargement des APIs
    apisManager.loadAPIS(road2);

    road2.all('/', (req, res) => {
      res.send('Road2 is running !! \n');
    });

    // Prêt à écouter
    road2.listen(global.nconf.get("ROAD2_PORT"), global.nconf.get("ROAD2_HOST"));
    LOGGER.info(`Road2 est fonctionnel (http://${global.nconf.get("ROAD2_HOST")}:${global.nconf.get("ROAD2_PORT")})`);

  }


}
