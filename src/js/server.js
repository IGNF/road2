'use strict';

const log4js = require('log4js');
const nconf = require('nconf');
const Service = require('./service/service');
const path = require('path');
const fs = require('fs');
const pm = require('./utils/processManager.js');

var LOGGER;


/**
*
* @function
* @name start
* @description Fonction principale
*
*/

async function start() {

  console.log("===========================");
  console.log("ROAD2 - Calcul d'itineraire");
  console.log("===========================");

  // Chargement de la configuration
  // Notamment pour pouvoir charger le logger
  let configuration = loadGlobalConfiguration();

  // Instanciation du logger et sauvegarde de sa configuration
  let logConfiguration = getLoggerConfiguration(configuration);
  initLogger(logConfiguration);

  // Création du service
  let service = new Service();

  // Vérification de la configuration globale du service et sauvegarde
  if (!service.checkAndSaveGlobalConfiguration(configuration)) {
    pm.shutdown(1);
  }

  // Sauvegarde de la configuration des logs
  service.logConfiguration = logConfiguration;

  // Chargement des ressources
  if (!service.loadResources()) {
    pm.shutdown(1);
  }

  // Chargement des sources uniques
  try {
    await service.loadSources();
  } catch (err) {
    LOGGER.fatal("Impossible de charger les sources", err);
    pm.shutdown(1);
  }

  // Création du serveur web
  if (!service.createServer("../apis/", "")) {
    pm.shutdown(1);
  }

}

/**
*
* @function
* @name loadGlobalConfiguration
* @description Charger la configuration globale du serveur
* @return {json} Configuration global du serveur
*
*/

function loadGlobalConfiguration() {

  console.log("Lecture de la configuration...");

  let file;
  let globalConfiguration;

  // on lit en priorité les arguments de la ligne de commande puis les variables d'environnement
  nconf.argv().env(['ROAD2_CONF_FILE','ROAD2_HOST','ROAD2_PORT']);
  // Cette ligne est utile si on n'utilise pas nconf.file
  // sans l'usage de nconf.use ou nconf.file, nconf.set ne marche pas.
  nconf.use('memory');

  if (nconf.get('ROAD2_CONF_FILE')) {

    // chemin absolu du fichier
    file = path.resolve(__dirname,nconf.get('ROAD2_CONF_FILE'));

    // vérification de l'exitence du fichier
    if (fs.existsSync(file)) {
      // chargement dans une variable pour la classe Service
      globalConfiguration = JSON.parse(fs.readFileSync(file));
    } else {
      console.log("Mauvaise configuration: fichier de configuration global inexistant: " + file);
      console.log("Utilisez le paramètre ROAD2_CONF_FILE en ligne de commande ou en variable d'environnement pour le préciser.");
      process.exit(1);
    }

  } else {
    //si aucun fichier n'a été précisé on renvoie une erreur
    console.log("Aucun fichier de configuration. Utiliser la variable d'environnement $ROAD2_CONF_FILE ou l'option --ROAD2_CONF_FILE lors de l'initialisation du serveur.");
    process.exit(1);
  }

  console.log("Configuration chargee.")

  return globalConfiguration;

}

/**
*
* @function
* @name initLogger
* @description Initialiser le logger
* @param {json} userLogConfigurationFile - Configuration des logs de l'application
*
*/

function initLogger(userLogConfiguration) {

  console.log("Instanciation du logger...");

  if (userLogConfiguration) {

    if (userLogConfiguration.mainConf) {

      // Configuration du logger
      log4js.configure(userLogConfiguration.mainConf);

      //Instanciation du logger
      LOGGER = log4js.getLogger('SERVER');

      LOGGER.info("Logger charge.");

    } else {
      console.log("Mausvaise configuration pour les logs: 'mainConf' absent.");
      process.exit(1);
    }

  } else {
    console.log("Aucune configuration pour les logs.");
    process.exit(1);
  }

}

/**
*
* @function
* @name getLoggerConfiguration
* @description Récupérer la configuration des logs du serveur
* @param {json} userConfiguration - Configuration de l'application
* @return {json} Configuration des logs du serveur
*
*/

function getLoggerConfiguration(userConfiguration) {

  console.log("Recuperation de la configuration du logger...");

  let logsConf;
  let userLogConfigurationFile;

  if (userConfiguration) {

    if (userConfiguration.application) {

      if (userConfiguration.application.logs) {

        if (userConfiguration.application.logs.configuration) {

          userLogConfigurationFile = userConfiguration.application.logs.configuration;

          // chemin absolu du fichier
          let file = path.resolve(__dirname,userLogConfigurationFile);

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
          console.log("Mauvais configuration: 'application.logs.configuration' absent.");
          process.exit(1);
        }

      } else {
        console.log("Mauvais configuration: 'application.logs' absent.");
        process.exit(1);
      }

    } else {
      console.log("Mauvais configuration: 'application' absent.");
      process.exit(1);
    }

  } else {
    console.log("Absence de configuration pour l'application.");
    process.exit(1);
  }

  return logsConf;

}

// Lancement de l'application
start();
