'use strict';

const express = require('express');
global.log4js = require('log4js');
global.nconf = require('nconf');
const path = require('path');
const fs = require('fs');
var configuration = require('./configuration/configuration');
var apisManager = require('./utils/apisManager');

var LOGGER;


/**
*
* @function
* @name start
* @description Fonction principale
*
*/

function start() {

  console.log("===========================");
  console.log("ROAD2 - Calcul d'itineraire");
  console.log("===========================");

  // Chargement de la configuration
  loadGlobalConfiguration();

  // Chargement du logger
  initLogger();

  // Vérification de la configuration
  configuration.checkGlobalConfiguration();

  createApp();

}

/**
*
* @function
* @name loadGlobalConfiguration
* @description Charger la configuration globale du serveur
*
*/

function loadGlobalConfiguration() {

  console.log("Lecture de la configuration...");

  var file;

  // on lit en priorité les arguments de la ligne de commande puis les variables d'environnement
  global.nconf.argv().env(['ROAD2_CONF_FILE','ROAD2_HOST','ROAD2_PORT']);

  if (global.nconf.get('ROAD2_CONF_FILE')) {

    // chemin absolu du fichier
    file = path.resolve(__dirname,global.nconf.get('ROAD2_CONF_FILE'));

    // vérification de l'exitence du fichier
    if (fs.existsSync(file)) {
      // chargement
      global.nconf.file({ file: file });
    } else {
      console.log("Mauvaise configuration: fichier de configuration global inexistant:");
      console.log(file);
      console.log("Utilisez le paramètre ROAD2_CONF_FILE en ligne de commande ou en variable d'environnement pour le préciser.");
      process.exit(1);
    }

  } else {
    //si aucun fichier n'a été précisé on prend, par défaut, le fichier du projet
    file = path.resolve(__dirname,'../config/road2.json');
    global.nconf.file({ file: file});
    global.nconf.set('ROAD2_CONF_FILE',file);
  }

  console.log("Configuration chargee.")

}

/**
*
* @function
* @name initLogger
* @description Initialiser le logger
*
*/

function initLogger() {

  console.log("Instanciation du logger...");

  var logsConf;
  var logsConfFile = global.nconf.get("application:logs:configuration");

  if (logsConfFile) {
    // chemin absolu du fichier
    var file = path.resolve(__dirname,logsConfFile);

    // vérification de l'exitence du fichier
    if (fs.existsSync(file)) {
      //Lecture du fichier de configuration des logs
      logsConf = JSON.parse(fs.readFileSync(file));
    } else {
      console.log("Mauvaise configuration: fichier de configuration des logs inexistant:");
      console.log(file);
      process.exit(1);
    }

  } else {
    console.log("Mauvaise configuration: fichier de configuration des logs non precise dans la configuration globale:");
    // FIXME: global.nconf.get retourne un undefined...
    console.log(global.nconf.get('ROAD2_CONF_FILE'));
    process.exit(1);
  }
  // Configuration du logger
  global.log4js.configure(logsConf.mainConf);

  //Récupération des informations pour les logs des requêtes
  global.nconf.set("httpConf",logsConf.httpConf);

  //Instanciation du logger
  LOGGER = global.log4js.getLogger('SERVER');

  LOGGER.info("Logger charge.")

}

/**
*
* @function
* @name createApp
* @description Création du serveur
*
*/

function createApp() {

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
  LOGGER.info(`Road2 est fonctionnel sur http://${global.nconf.get("ROAD2_HOST")}:${global.nconf.get("ROAD2_PORT")}`);

}

// Lancement de l'application
start();
