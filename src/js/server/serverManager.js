'use strict';

const Server = require('./server');
const log4js = require('log4js');
const fs = require('fs');
const assert = require('assert');

// Création du LOGGER
const LOGGER = log4js.getLogger("SERVERMANAGER");

/**
*
* @class
* @name serverManager
* @description Gestionnaire des serveurs disponible sur un service
*
*/

module.exports = class serverManager {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe serverManager
  *
  */
  constructor() {

    // Liste des serveurs chargés
    this._loadedServerId = new Array();

    // Liste des serveurs vérifiés
    this._checkedServerId = new Array();

    // Catalogue de serveurs
    this._serverCatalog = {};

    // Description des serveurs
    this._loadedServerDescription = {};

    // Description des serveurs
    this._checkedServerDescription = {};

  }

  /**
  *
  * @function
  * @name checkServerConfiguration
  * @description Vérifier la configuration d'un serveur
  * @param {object} config - Configuration à vérifier
  *
  */
   checkServerConfiguration(config) {

    if (!config) {
      LOGGER.error("Aucune configuration n'a ete fournie");
      return false;
    } else {
      // on continue
    }

    if (!config.id) {
      LOGGER.error("La configuration du serveur n'indique aucun id");
      return false;
    } else {
      
      // On vérifie que l'id n'est pas déjà chargé
      if (this._loadedServerId.length !== 0) {
        for (let i = 0; i < this._loadedServerId.length; i++) {
          if (config.id === this._loadedServerId[i]) {
            LOGGER.error("Un serveur contenant l'id " + config.id + " est deja chargé.");
            return false;
          }
        }
      }

      // On vérifie que l'id n'est pas déjà pris par le check courant
      if (this._checkedServerId.length !== 0) {
        for (let i = 0; i < this._checkedServerId.length; i++) {
          if (config.id === this._checkedServerId[i]) {
            LOGGER.error("Un serveur contenant l'id " + config.id + " est déjà verifié.");
            return false;
          }
        }
      }

    }

    if (!config.https) {
      LOGGER.error("La configuration du serveur n'indique pas la securisation du serveur");
      return false;
    } else {
      // Vérification
      if (config.https !== "true" && config.https !== "false") {
        LOGGER.error("Le parametre https est mal renseigné. Valeurs disponibles: 'true' ou 'false'. ");
        return false;
      } else {
        // il n'y a rien à faire
      }
    }

    if (!config.host) {
      LOGGER.error("La configuration du serveur n'indique aucun host");
      return false;
    } else {

      // Vérification
      let tmpHost = config.host.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g);
      if (!tmpHost) {
        LOGGER.error("L'host du serveur est mal renseigne.");
        return false;
      } else {
        // rien à faire
      }

    }

    if (!config.port) {
      LOGGER.error("La configuration du serveur n'indique aucun port");
      return false;
    } else {

      // Vérification
      let tmpPort = config.port.match(/^\d{1,5}$/g);
      if (!tmpPort) {
        LOGGER.fatal("Le port est mal renseigne.");
        return false;
      } else {

        if (!Array.isArray(tmpPort)) {
          LOGGER.fatal("Le port est mal renseigne.");
          return false;
        }

        if (tmpPort.length === 0) {
          LOGGER.fatal("Le port est mal renseigne.");
          return false;
        }

        let userPort = parseInt(tmpPort[0]);

        if (userPort > 65536) {
          LOGGER.fatal("Le port est mal renseigne: Numero de port invalide");
          return false;
        } else {
          // rien à faire
        }

      }
    }

    // Options
    if (!config.options) {

      if (config.https === "true") {
        // on doit avoir un cert et un key dans l'objet options
        LOGGER.error("Serveur https sans options.");
        return false;
      } else {
        // rien à faire
      }

    } else {

      if (config.https === "true") {
        // on doit avoir un cert et un key dans l'objet options
        if (!config.options.key) {
          LOGGER.error("L'objet options doit contenir un key pour le HTTPS.");
          return false;
        } else {
          // on vérifie que le fichier est exploitable
          let file = "";
          try {
            // TODO : gérer les chemins relatifs
            file = config.options.key;
            fs.accessSync(file, fs.constants.R_OK);
          } catch (err) {
            LOGGER.error("Le fichier ne peut etre lu: " + file);
            return false;
          }
        }

        if (!config.options.cert) {
          LOGGER.error("L'objet options doit contenir un cert pour le HTTPS.");
          return false;
        } else {
          // on vérifie que le fichier est exploitable
          let file = "";
          try {
            // TODO : gérer les chemins relatifs
            file = config.options.cert;
            fs.accessSync(file, fs.constants.R_OK);
          } catch (err) {
            LOGGER.error("Le fichier ne peut etre lu: " + file);
            return false;
          }
        }

      } else {
        // rien à faire
      }

    }

    return true;

  }

  saveServerConfiguration(config) {

    this._checkedServerId.push(config.id);
    this._checkedServerDescription[config.id] = config;

  }

  /**
  *
  * @function
  * @name loadServerConfiguration
  * @description Créer un serveur
  * @param {object} app - Instance d'ExpressJS
  * @param {object} config - Configuration du serveur
  *
  */
   loadServerConfiguration(app, config) {

    LOGGER.info("Chargement du serveur : " + config.id);

    // On vérifie que l'id n'est pas déjà chargé
    if (this._loadedServerId.length !== 0) {
      for (let i = 0; i < this._loadedServerId.length; i++) {
        if (config.id === this._loadedServerId[i]) {
          LOGGER.info("Un serveur contenant l'id " + config.id + " est deja chargé.");
          return true;
        }
      }
    }

    if (config.https === "true") {
      this._serverCatalog[config.id] = new Server(config.id, app, config.host, config.port, "true", config.options);
    } else {
      this._serverCatalog[config.id] = new Server(config.id, app, config.host, config.port, "false", config.options);
    }

    this._loadedServerId.push(config.id);
    this._loadedServerDescription[config.id] = config;

    return true;

  }

  /**
  *
  * @function
  * @name flushCheckedServer
  * @description Vider la liste des serveurs déjà vérifiées 
  *
  */
   flushCheckedServer() {

    this._checkedServerId = new Array();
    this._checkedServerDescription = {};

  }

  /**
  *
  * @function
  * @name startAllServers
  * @description Démarrer l'ensemble des serveurs disponibles dans le manager
  *
  */
  startAllServers() {

    LOGGER.info("Demarrage de l'ensemble des serveurs.");

    if (this._loadedServerId.length === 0) {
      LOGGER.error("Aucun serveur n'est disponible.");
      return false;
    }

    try {
      assert.deepStrictEqual(this._serverCatalog, {});
      LOGGER.error("Aucun serveur n'a ete cree.");
      return false;
    } catch (err) {
      // tout va bien
    }

    for (let serverId in this._serverCatalog) {
      LOGGER.info("Serveur: " + serverId);
      if (!this._serverCatalog[serverId].start()) {
        LOGGER.error("Erreur lors du demarrage du serveur.");
        return false;
      }
    }

    LOGGER.info("Les demarrages se sont bien deroules.");

    return true;

  }

  /**
  *
  * @function
  * @name stopAllServer
  * @description Arrêter l'ensemble des serveurs disponibles dans le manager
  *
  */
  stopAllServer() {

    LOGGER.info("Arret de l'ensemble des serveurs.");

    if (this._loadedServerId.length === 0) {
      LOGGER.warn("Aucun serveur n'est disponible.");
      return true;
    }

    try {
      assert.deepStrictEqual(this._serverCatalog, {});
    } catch (err) {
      LOGGER.warn("Aucun serveur n'est disponible.");
      return true;
    }

    for (let serverId in this._serverCatalog) {
      LOGGER.info("Serveur: " + serverId);
      if (!this._serverCatalog[serverId].stop()) {
        LOGGER.error("Erreur lors de l'arret du serveur.");
        return false;
      }
    }

    LOGGER.info("Les arrets se sont bien deroules.");

    return true;

  }


}
