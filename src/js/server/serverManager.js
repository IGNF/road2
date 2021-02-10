'use strict';

const Server = require('./server');
const log4js = require('log4js');
const fs = require('fs');
const path = require('path');
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

    // Catalogue de serveurs
    this._serverCatalog = {};

    // Description des serveurs
    this._serverDescriptions = new Array();

  }

  /**
  *
  * @function
  * @name checkConfiguration
  * @description Vérifier la configuration d'un serveur
  *
  */
  checkConfiguration(config) {

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
      // TODO: Vérification
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

        if (config.https === "true") {
          if (userPort !== 443) {
            LOGGER.fatal("Le port est different de 443 pour un serveur HTTPS");
            return false;
          }
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

    // Stockage de la description
    this._serverDescriptions.push(config);

    return true;

  }

  /**
  *
  * @function
  * @name createServer
  * @description Créer un serveur
  *
  */
  createServer(app, config) {

    if (config.https === "true") {
      return new Server(config.id, app, config.host, config.port, "true", config.options);
    } else {
      return new Server(config.id, app, config.host, config.port, "false", config.options);
    }

  }

  /**
  *
  * @function
  * @name createAllServer
  * @description Créer l'ensemble des serveurs disponibles dans le manager
  *
  */
  createAllServer(app) {

    if (this._serverDescriptions.length === 0) {
      LOGGER.error("Aucun serveur n'est disponible.");
      return false;
    }

    for(let i = 0; i < this._serverDescriptions.length; i++) {
      let configuration = this._serverDescriptions[i];
      try {
        this._serverCatalog[configuration.id] = this.createServer(app, configuration);
      } catch (err) {
        return false;
      }
    }

    return true;

  }

  /**
  *
  * @function
  * @name startAllServer
  * @description Démarer l'ensemble des serveurs disponibles dans le manager
  *
  */
  startAllServer() {

    LOGGER.info("Demarrage de l'ensemble des serveurs.");

    if (this._serverDescriptions.length === 0) {
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

    if (this._serverDescriptions.length === 0) {
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
