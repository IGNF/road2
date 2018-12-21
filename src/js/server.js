'use strict';

const express = require('express');
// const OSRM = require("osrm");
const log4js = require('log4js');
const nconf = require('nconf');
const path = require('path');
const fs = require('fs');

var LOGGER;

/**
*
* @function
* @name start
* @description Fonction principale
*
*/

function start() {

  // const osrm = new OSRM("/home/docker/data/corse-latest.osrm");

  // Chargement de la configuration
  loadGlobalConfiguration();

  // Chargement du logger
  initLogger();

  // Vérification de la configuration
  checkGlobalConfiguration();

  // App
  const app = express();

  // Pour le log des requêtes reçues sur le service avec la syntaxe
  // app.use(log4js.connectLogger(log4js.getLogger('request'), {
  //   level: logsConf.httpConf.level,
  //   format: (req, res, format) => format(logsConf.httpConf.format)
  // }));

  app.get('/', (req, res) => {
    res.send('Hello world !! \n');
    // osrm.route({coordinates: [[ 9.479455,42.546907], [9.435853,42.619204]]}, function(err, result) {
    //   if(err) {
    //     throw err;
    //   }
    //   console.log(result.waypoints); // array of Waypoint objects representing all waypoints in order
    //   console.log(result.routes); // array of Route objects ordered by descending recommendation rank
    // });
  });

  app.listen(nconf.get("ROAD2_PORT"), nconf.get("ROAD2_HOST"));
  LOGGER.info(`Road2 is running on http://${nconf.get("ROAD2_HOST")}:${nconf.get("ROAD2_PORT")}`);

}

/**
*
* @function
* @name loadGlobalConfiguration
* @description Charger la configuration globale du serveur
*
*/

function loadGlobalConfiguration() {

  // on lit en priorité les arguments de la ligne de commande puis les variables d'environnement
  nconf.argv().env('ROAD2_CONF_FILE','ROAD2_HOST','ROAD2_PORT');

  if (nconf.get('ROAD2_CONF_FILE')) {
    nconf.file({ file: path.resolve(__dirname,nconf.get('ROAD2_CONF_FILE')) });
  } else {
    //si aucun fichier n'a été précisé on prend, par défaut, le fichier du projet
    nconf.file({ file: path.resolve(__dirname,'../config/road2.json') });
  }

}

/**
*
* @function
* @name initLogger
* @description Initialiser le logger
*
*/

function initLogger() {

  var logsConf;
  var logsConfFile = nconf.get("application:logs:configuration");

  if (logsConfFile) {
    //Lecture du fichier de configuration des logs
    logsConf = JSON.parse(fs.readFileSync(path.resolve(__dirname,logsConfFile)));
  } else {
    console.log("Mauvaise configuration: fichier de configuration des logs manquant !");
    process.exit(1);
  }
  // Configuration du logger
  log4js.configure(logsConf.mainConf);

  //Instanciation du logger
  LOGGER = log4js.getLogger('SERVER');

}

/**
*
* @function
* @name checkGlobalConfiguration
* @description Vérification de la configuration globale du serveur
*
*/

function checkGlobalConfiguration() {

  // Configuration de l'application
  if (!nconf.get("application")) {
    LOGGER.fatal("Mauvaise configuration: Objet 'application' manquant !");
    process.exit(1);
  }
  // Nom de l'application
  if (!nconf.get("application:name")) {
    LOGGER.fatal("Mauvaise configuration: Champ 'application:name' manquant !");
    process.exit(1);
  }
  // Titre de l'application
  if (!nconf.get("application:title")) {
    LOGGER.fatal("Mauvaise configuration: Champ 'application:title' manquant !");
    process.exit(1);
  }
  // Description de l'application
  if (!nconf.get("application:description")) {
    LOGGER.fatal("Mauvaise configuration: Champ 'application:description' manquant !");
    process.exit(1);
  }
  // Information sur le fournisseur du service
  if (nconf.get("application:provider")) {
    // Nom
    if (!nconf.get("application:provider:name")) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:provider:name' manquant !");
      process.exit(1);
    }
    // Site
    if (!nconf.get("application:provider:site")) {
      LOGGER.info("Le champ 'application:provider:site' n'est pas renseigne.");
    }
    // Mail
    if (!nconf.get("application:provider:mail")) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:provider:mail' manquant !");
      process.exit(1);
    }
  } else {
    LOGGER.warn("Configuration incomplete: Objet 'application:provider' manquant !");
  }
  // Information sur les ressources
  if (nconf.get("application:resources")) {
    // Dossier contenant les fichiers de ressources
    if (!nconf.get("application:resources:directory")) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:resources:directory' manquant !");
      process.exit(1);
    }
  } else {
    LOGGER.fatal("Mauvaise configuration: Objet 'application:resources' manquant !");
    process.exit(1);
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

}

// Lancement de l'application
start();
