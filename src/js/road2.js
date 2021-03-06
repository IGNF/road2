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
  let [configuration, configurationPath] = loadGlobalConfiguration();

  // Instanciation du logger et sauvegarde de sa configuration
  let logConfiguration = getLoggerConfiguration(configuration, configurationPath);
  checkAndInitLogger(logConfiguration);

  // Création du service
  let service = new Service();

  // Vérification de la configuration globale du service et sauvegarde
  if (!service.checkAndSaveGlobalConfiguration(configuration, configurationPath)) {
    pm.shutdown(1);
  }

  // Sauvegarde de la configuration des logs
  service.logConfiguration = logConfiguration;

  // Chargement des opérations rendues disponibles sur le service
  if (!service.loadOperations()) {
    pm.shutdown(1);
  }

  // Chargement des projections
  if (!service.loadProjections()) {
    pm.shutdown(1);
  }

  // Chargement des ressources
  if (!(await service.loadResources())) {
    pm.shutdown(1);
  }

  // En mode check de configuration, fermeteure du serveur sans code d'erreur
  if (nconf.argv().get('configCheck')) {

    LOGGER.info("La vérification de la configuration est terminée");
    pm.shutdown(0);

  } else {

    // Chargement des topologies
    if (!service.loadTopologies()) {
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

  

}

/**
*
* @function
* @name loadGlobalConfiguration
* @description Charger la configuration globale du serveur
* @return {array} Configuration global du serveur et chemin absolu du fichier de configuration
*
*/

function loadGlobalConfiguration() {

  console.log("Lecture de la configuration...");

  let configurationPath;
  let globalConfiguration;

  // on lit en priorité les arguments de la ligne de commande puis les variables d'environnement
  nconf.argv().env(['ROAD2_CONF_FILE']);
  // Cette ligne est utile si on n'utilise pas nconf.file
  // sans l'usage de nconf.use ou nconf.file, nconf.set ne marche pas.
  nconf.use('memory');

  if (nconf.get('ROAD2_CONF_FILE')) {

    // chemin absolu du fichier
    try {
      configurationPath = path.resolve(process.cwd(), nconf.get('ROAD2_CONF_FILE'));
    } catch (error) {
      console.log("Impossible de recuperer le chemin absolu du fichier de configuration:");
      console.log(error);
      process.exit(1);
    }

    // vérification de l'exitence du fichier
    if (fs.existsSync(configurationPath)) {
      
      // chargement dans une variable pour la classe Service
      try {
        globalConfiguration = JSON.parse(fs.readFileSync(configurationPath));
      } catch (error) {
        console.log("Mauvaise configuration: impossible de lire ou de parser le fichier de configuration de Road2:");
        console.log(error);
        process.exit(1);
      }

    } else {
      console.log("Mauvaise configuration: fichier de configuration global inexistant: " + configurationPath);
      console.log("Utilisez le paramètre ROAD2_CONF_FILE en ligne de commande ou en variable d'environnement pour le préciser.");
      process.exit(1);
    }

  } else {
    //si aucun fichier n'a été précisé on renvoie une erreur
    console.log("Aucun fichier de configuration. Utiliser la variable d'environnement $ROAD2_CONF_FILE ou l'option --ROAD2_CONF_FILE lors de l'initialisation du serveur.");
    process.exit(1);
  }

  console.log("Configuration chargee.")

  return [globalConfiguration,configurationPath];

}

/**
*
* @function
* @name initLogger
* @description Initialiser le logger
* @param {json} userLogConfigurationFile - Configuration des logs de l'application
*
*/

function checkAndInitLogger(userLogConfiguration) {

  console.log("Instanciation du logger...");

  if (userLogConfiguration) {

    if (userLogConfiguration.mainConf) {

      // Configuration du logger
      try {
        log4js.configure(userLogConfiguration.mainConf);
      } catch (error) {
        console.log("Mauvaise configuration des logs dans mainConf");
        console.log(error);
        process.exit(1);
      }

      //Instanciation du logger
      LOGGER = log4js.getLogger('SERVER');

      LOGGER.info("Logger charge.");

    } else {
      console.log("Mausvaise configuration pour les logs: 'mainConf' absent.");
      process.exit(1);
    }

    if (userLogConfiguration.httpConf) {

      if (!userLogConfiguration.httpConf.level) {
        console.log("Mausvaise configuration pour les logs: 'httpConf.level' absent.");
        process.exit(1);
      } else {
        if (typeof userLogConfiguration.httpConf.level !== "string") {
          console.log("Mausvaise configuration pour les logs: 'httpConf.level' n'est pas une chaine de caracteres");
          process.exit(1);
        }
      }

      if (!userLogConfiguration.httpConf.format) {
        console.log("Mausvaise configuration pour les logs: 'httpConf.format' absent.");
        process.exit(1);
      } else {
        if (typeof userLogConfiguration.httpConf.format !== "string") {
          console.log("Mausvaise configuration pour les logs: 'httpConf.format' n'est pas une chaine de caracteres");
          process.exit(1);
        }
      }

    } else {
      console.log("Mausvaise configuration pour les logs: 'httpConf' absent.");
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
* @param {string} userConfigurationPath - CHemin absolu du fichier de configuration
* @return {json} Configuration des logs du serveur
*
*/

function getLoggerConfiguration(userConfiguration, userConfigurationPath) {

  console.log("Recuperation de la configuration du logger...");

  let logsConf;
  let userLogConfigurationFile;

  if (userConfiguration) {

    if (userConfiguration.application) {

      if (userConfiguration.application.logs) {

        if (userConfiguration.application.logs.configuration) {

          userLogConfigurationFile = userConfiguration.application.logs.configuration;

          // chemin absolu du fichier
          let file = "";
          
          try {

            file = path.resolve(path.dirname(userConfigurationPath), userLogConfigurationFile);
  
          } catch (error) {

            console.log("Impossible de recuperer le chemin absolu du fichier de log:");
            console.log(error);
            process.exit(1);

          }
                    
          // vérification de l'exitence du fichier
          if (fs.existsSync(file)) {
            //Lecture du fichier de configuration des logs
            try {
              logsConf = JSON.parse(fs.readFileSync(file));
            } catch (error) {
              console.log("Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs:");
              console.log(error);
              process.exit(1);
            }
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
    // cela ne doit arriver que si cette fonction est appelée sans paramètre
    console.log("Absence de configuration pour l'application.");
    process.exit(1);
  }

  return logsConf;

}

// Lancement de l'application
start();
