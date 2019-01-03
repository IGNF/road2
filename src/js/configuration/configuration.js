'use strict';

var pm = require('../utils/processManager.js')

// Création du LOGGER
var LOGGER = global.log4js.getLogger("CONFIGURATION");

module.exports = {

  /**
  *
  * @function
  * @name checkGlobalConfiguration
  * @description Vérification de la configuration globale du serveur
  *
  */

  checkGlobalConfiguration: function() {

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

  }

}
