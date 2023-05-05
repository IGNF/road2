'use strict';

const log4js = require('log4js');
const nconf = require('nconf');
const Administrator = require('./administrator/administrator');
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
  console.log("ROAD2 - Administrator");
  console.log("===========================");

  // Chargement de la configuration
  // Notamment pour pouvoir charger le logger
  let [configuration, configurationPath] = loadGlobalConfiguration();

  // Instanciation du logger et sauvegarde de sa configuration
  let logConfiguration = getLoggerConfiguration(configuration, configurationPath);
  checkAndInitLogger(logConfiguration);

  LOGGER.info("Logger de l'administrateur initialisé");

  // Création de l'administrateur car il sera utilisé dans tous les cas
  let administrator = new Administrator();

  if (!nconf.argv().get('configCheck')) {

    // Cas général de l'utilisation de Road2 
    LOGGER.info("Lancement classique de Road2");

    // Récupération de la configuration de l'administrateur
    if (!administrator.checkAdminConfiguration(configuration, configurationPath)) {
      LOGGER.fatal("La configuration de l'administrateur n'est pas validée");
      pm.shutdown(11);
    } else {

      LOGGER.info("La configuration de l'administrateur est validée. On la sauvegarde.");

      // On aura besoin de cette configuration plus tard
      administrator.saveAdminConfiguration(configuration, configurationPath, logConfiguration);

      // Création du serveur d'administration
      if (!administrator.createServer()) {
        LOGGER.fatal("Le serveur de l'administrateur ne peut être créé");
        pm.shutdown(12);
      } else {
        
        LOGGER.debug("Serveur administrateur créé");

        // Création des services au démarrage si demandé
        LOGGER.info("Création des services...");

        if (!(await administrator.createServices())) {
          LOGGER.error("Problèmes lors du démarrage des services. Reconfigurez les et relancez leur démarrage.");
          // On n'éteint pas le serveur d'administration car les services pourront être reconfiguré et démarrés par l'API
        } else {
          LOGGER.info("S'il y en a, les services ont été démarré");
        }

      }

    }

  } else {

    // Cas particulier 
    LOGGER.info("Lancement de Road2 pour vérification des configurations");

    // On commence par vérifier la configuration du service 
    if (!administrator.checkAdminConfiguration(configuration, configurationPath)) {

      // La configuration de l'administrateur n'est pas validée
      LOGGER.fatal("La configuration de l'administrateur n'est pas validée");
      pm.shutdown(11);

    } else {

      LOGGER.info("La configuration de l'administrateur a été vérifiée et validée");
      
      // On la sauvegarde pour la suite
      administrator.saveAdminConfiguration(configuration, configurationPath, logConfiguration);
      
      // On vérifie la configuration du service 
      if (!(await administrator.checkServicesConfiguration())) {

        // La configuration du service n'est pas validée
        LOGGER.fatal("La configuration des services n'est pas validée");
        pm.shutdown(1);

      } else {
        LOGGER.info("S'il y en a, la configuration des services est validée");
      }

    }
    
    LOGGER.info("La vérification des différentes configurations est terminée");
    pm.shutdown(0);

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
      process.exit(11);
    }

    // vérification de l'exitence du fichier
    if (fs.existsSync(configurationPath)) {
      
      // chargement dans une variable pour la classe Administrateur
      try {
        globalConfiguration = JSON.parse(fs.readFileSync(configurationPath));
      } catch (error) {
        console.log("Mauvaise configuration: impossible de lire ou de parser le fichier de configuration de Road2:");
        console.log(error);
        process.exit(11);
      }

    } else {
      console.log("Mauvaise configuration: fichier de configuration global inexistant: " + configurationPath);
      console.log("Utilisez le paramètre ROAD2_CONF_FILE en ligne de commande ou en variable d'environnement pour le préciser.");
      process.exit(11);
    }

  } else {
    //si aucun fichier n'a été précisé on renvoie une erreur
    console.log("Aucun fichier de configuration. Utiliser la variable d'environnement $ROAD2_CONF_FILE ou l'option --ROAD2_CONF_FILE lors de l'initialisation du serveur.");
    process.exit(11);
  }

  console.log("Configuration chargee.")

  return [globalConfiguration,configurationPath];

}

/**
*
* @function
* @name checkAndInitLogger
* @description Initialiser le logger
* @param {json} userLogConfiguration - Configuration des logs de l'administrateur
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
        process.exit(11);
      }

      //Instanciation du logger
      LOGGER = log4js.getLogger('ROAD2');

      LOGGER.info("Logger charge.");

    } else {
      console.log("Mausvaise configuration pour les logs: 'mainConf' absent.");
      process.exit(11);
    }

    if (userLogConfiguration.httpConf) {

      if (!userLogConfiguration.httpConf.level) {
        console.log("Mausvaise configuration pour les logs: 'httpConf.level' absent.");
        process.exit(11);
      } else {
        if (typeof userLogConfiguration.httpConf.level !== "string") {
          console.log("Mausvaise configuration pour les logs: 'httpConf.level' n'est pas une chaine de caracteres");
          process.exit(11);
        }
      }

      if (!userLogConfiguration.httpConf.format) {
        console.log("Mausvaise configuration pour les logs: 'httpConf.format' absent.");
        process.exit(11);
      } else {
        if (typeof userLogConfiguration.httpConf.format !== "string") {
          console.log("Mausvaise configuration pour les logs: 'httpConf.format' n'est pas une chaine de caracteres");
          process.exit(11);
        }
      }

    } else {
      console.log("Mausvaise configuration pour les logs: 'httpConf' absent.");
      process.exit(11);
    }

  } else {
    console.log("Aucune configuration pour les logs.");
    process.exit(11);
  }

}

/**
*
* @function
* @name getLoggerConfiguration
* @description Récupérer la configuration des logs du serveur d'administration
* @param {json} userConfiguration - Configuration de l'administrateur
* @param {string} userConfigurationPath - Chemin absolu du fichier de configuration
* @return {json} Configuration des logs du serveur
*
*/

function getLoggerConfiguration(userConfiguration, userConfigurationPath) {

  console.log("Recuperation de la configuration du logger...");

  let logsConf;
  let userLogConfigurationFile;

  if (userConfiguration) {

    if (userConfiguration.administration) {

      if (userConfiguration.administration.logs) {

        if (userConfiguration.administration.logs.configuration) {

          userLogConfigurationFile = userConfiguration.administration.logs.configuration;

          // chemin absolu du fichier
          let file = "";
          
          try {

            file = path.resolve(path.dirname(userConfigurationPath), userLogConfigurationFile);
  
          } catch (error) {

            console.log("Impossible de recuperer le chemin absolu du fichier de log:");
            console.log(error);
            process.exit(11);

          }
                    
          // vérification de l'exitence du fichier
          if (fs.existsSync(file)) {
            //Lecture du fichier de configuration des logs
            try {
              logsConf = JSON.parse(fs.readFileSync(file));
            } catch (error) {
              console.log("Mauvaise configuration: impossible de lire ou de parser le fichier de configuration des logs:");
              console.log(error);
              process.exit(11);
            }
          } else {
            console.log("Mauvaise configuration: fichier de configuration des logs inexistant:");
            console.log(file);
            process.exit(11);
          }

        } else {
          console.log("Mauvaise configuration: 'administration.logs.configuration' absent.");
          process.exit(11);
        }

      } else {
        console.log("Mauvaise configuration: 'administration.logs' absent.");
        process.exit(11);
      }

    } else {
      console.log("Mauvaise configuration: 'administration' absent.");
      process.exit(11);
    }

  } else {
    // cela ne doit arriver que si cette fonction est appelée sans paramètre
    console.log("Absence de configuration pour l'administration.");
    process.exit(11);
  }

  return logsConf;

}

// Lancement de l'application
start();
