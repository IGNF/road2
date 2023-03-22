'use strict';

const pm = require('../utils/processManager.js');
const Service = require('./service');
const log4js = require('log4js');
const fs = require('fs');
const path = require('path');

var LOGGER;

/**
*
* @function
* @name startService
* @description Fonction principale pour démarrer un service
* @param {string} configurationLocation - Localisation de la configuration du service (localisation absolue du service.json)
*
*/

async function startService() {

    console.log("===========================");
    console.log("ROAD2 - Service ");
    console.log("===========================");

    // Récupération des arguments
    let configurationLocation = "";
    if (process.argv[2] !== "") {
      configurationLocation = process.argv[2];
    } else {
      console.log("Configuration du service absente, extinction du processus...");
      process.exit(1);
    }

    // Récupération de la configuration
    let configuration = "";
    try {
      configuration = JSON.parse(fs.readFileSync(configurationLocation));
    } catch(error) {
      console.log("Impossible de lire la configuration : " + configurationLocation);
      console.log(error);
      process.exit(1);
    }

    // Instanciation du logger
    let logConfiguration = getLoggerConfiguration(configuration, configurationLocation);
    checkAndInitLogger(logConfiguration);

    LOGGER.info("Instanciation du logger pour le service terminee. Creation de la classe Service...");

    // Création du service
    let service = new Service();

    // Vérification de la configuration globale du service 
    // TODO : Selon les erreurs, on lance ou pas le service

    if (!(await service.checkServiceConfiguration(configuration, configurationLocation))) {
        pm.shutdown(1);
    } else {

      LOGGER.debug("Configuration du service vérifiée et suffisamment validée pour lancer un service");

      // On aura besoin de cette configuration juste après et peut-être plus tard 
      service.saveServiceConfiguration(configuration, configurationLocation, logConfiguration);

      // On lance le chargement du service qui est normalement correctement configuré
      if (!service.loadServiceConfiguration()) {
        pm.shutdown(2);
      } else {

        LOGGER.debug("Service chargé");

        // On connecte les sources
        if (!(await service.connectSources())) {

          LOGGER.fatal("Aucune source n'a pu être connectée");
          pm.shutdown(4);
        
        } else {

          LOGGER.info("Les sources connectables ont été connectées");

          // Instanciation de la fonction permettant de recevoir des messages via IPC
          if (process.argv[3] === "child") {
            LOGGER.info("Ce service est un child d'un administrateur. Instanciation de la fonction permettant de recevoir les messages");
            service.initIPC();
          } else {
            LOGGER.debug("Processus parent, aucune connexion IPC à gérer");
          }

          // On démarre les serveurs associé à ce service
          if (!(await service.startServers())) {
            LOGGER.fatal("Erreur lors du démarrage des serveurs");
            pm.shutdown(5);
          } else {
            LOGGER.info("Les serveurs ont bien été démarrés");
          }

        }

      }

    }

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
          process.exit(1);
        }
  
        //Instanciation du logger
        LOGGER = log4js.getLogger('MAIN-SERVICE');
  
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
            console.log("Mauvaise configuration: 'application.logs.configuration' absent.");
            process.exit(1);
          }
  
        } else {
          console.log("Mauvaise configuration: 'application.logs' absent.");
          process.exit(1);
        }
  
      } else {
        console.log("Mauvaise configuration: 'application' absent.");
        process.exit(1);
      }
  
    } else {
      // cela ne doit arriver que si cette fonction est appelée sans paramètre
      console.log("Absence de configuration pour l'application.");
      process.exit(1);
    }
  
    return logsConf;
  
  }

startService();