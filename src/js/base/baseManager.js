'use strict';

const log4js = require('log4js');
const fs = require('fs');
const Base = require('./base');

// Création du LOGGER
const LOGGER = log4js.getLogger("BASEMANAGER");

/**
*
* @class
* @name baseManager
* @description Classe modélisant le manager des bases de données.
*
*/
module.exports = class baseManager {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe baseManager
  *
  */
  constructor() {

    // Liste des descriptions de bases déjà chargées par le manager
    this._loadedBaseConfiguration = new Array();

    // Liste des descriptions de bases déjà vérifiées par le manager et qui doivent être cohérentes avec les prochaines qui seront vérifiés
    // Cet objet doit être vidé quand l'ensemble des configurations a été vérifié
    this._checkedBaseConfiguration = new Array();

    // Le catalogue des bases créées par le manager
    this._baseCatalog = {};

  }

  /**
  *
  * @function
  * @name get loadedBaseConfiguration
  * @description Récupérer la liste des configurations déjà chargées par ce manager
  *
  */
  get loadedBaseConfiguration() {
    return this._loadedBaseConfiguration;
  }

  /**
  *
  * @function
  * @name get baseCatalog
  * @description Récupérer le catalogue des bases
  *
  */
  get baseCatalog() {
    return this._baseCatalog;
  }

  /**
  *
  * @function
  * @name getBase
  * @description Récupérer une base par sa configuration
  * @param {string} configPath - Chemin de la configuration
  *
  */
   getBase(configPath) {
    return this._baseCatalog[configPath];
  }

  /**
  *
  * @function
  * @name checkBaseConfiguration
  * @description Vérification de la description de la configuration à une base de données.
  * @param{string} dbConfigPath - Nom du fichier contenant les informations de connexion à la base (chemin absolu)
  *
  */
  async checkBaseConfiguration(dbConfigPath) {

    LOGGER.info("Verification de la configuration de la base de donnees...");

    if (this._loadedBaseConfiguration.length !== 0) {

      for (let i = 0; i < this._loadedBaseConfiguration.length; i++) {
        if (dbConfigPath === this._loadedBaseConfiguration[i]) {
          LOGGER.info("Configuration deja chargée.")
          return true;
        }
      }

    } else {
      // C'est le premier, donc on continue
    }

    if (this._checkedBaseConfiguration.length !== 0) {

      for (let i = 0; i < this._checkedBaseConfiguration.length; i++) {
        if (dbConfigPath === this._checkedBaseConfiguration[i]) {
          LOGGER.info("Configuration deja vérifiée.")
          return true;
        }
      }

    } else {
      // C'est le premier, donc on continue
    }

    // On vérifie que le module pg est disponible 
    try {
      let { poolTest } = require('pg');
    } catch(error) {
      LOGGER.error("Le module pg n'est pas disponible mais une base de données est proposée dans la configuration.");
      return false;
    }

    try {
      fs.accessSync(dbConfigPath, fs.constants.R_OK);
    } catch (err) {
      LOGGER.error("Le fichier " + dbConfigPath + " ne peut etre lu.");
      return false;
    }

    let configuration = {}; 
    try {
      configuration = JSON.parse(fs.readFileSync(dbConfigPath));
    } catch (error) {
      LOGGER.error("Impossible de lire la configuration de bdd: " + dbConfigPath);
      LOGGER.error(error);
      return false;
    }

    let base = new Base(configuration);

    try {
      LOGGER.info("Test de connexion à la base de donnees...");
      await base.connect();
      await base.disconnect();
    } catch (err) {
      LOGGER.error("Connection à la base décrite dans " + dbConfigPath + " échouée.");
      return false;
    }

    LOGGER.info("Configuration de la base de donnees valide.");
    return true;

  }

  /**
  *
  * @function
  * @name flushCheckedBaseConfiguration
  * @description Vider la liste des configurations de bases déjà vérifiées 
  *
  */
  flushCheckedBaseConfiguration() {

    this._checkedBaseConfiguration = new Array();
  
  }

  /**
  *
  * @function
  * @name saveCheckedBaseConfiguration
  * @description Sauvegarde de la description de la configuration à une base de données.
  * @param {string} dbConfigPath - Nom du fichier contenant les informations de connexion à la base (chemin absolu)
  *
  */
  saveCheckedBaseConfiguration(dbConfigPath) {

    this._checkedBaseConfiguration.push(dbConfigPath);

  }

  /**
  *
  * @function
  * @name loadBaseConfiguration
  * @description Création de la base de données
  * @param{string} dbConfigPath - Nom du fichier contenant les informations de connexion à la base (chemin absolu)
  *
  */
  loadBaseConfiguration(dbConfigPath) {

    let base;

    // on vérifie d'abord que la base n'a pas déjà été créée
    if (this._baseCatalog[dbConfigPath]) {
      return true;
    } else {
      // TODO la base n'existe pas, on vérifie que le contenu de la conf n'est pas le même qu'une base déjà chargée.
      // Cela permet d'éviter de créer des connexions inutiles.
      // Si elle existe déjà, il faut bien veiller à renvoyer le this._baseCatalog[dbConfigPath] correspondant. 
    }

    let configuration = {}; 
    try {
      configuration = JSON.parse(fs.readFileSync(dbConfigPath));
    } catch (error) {
      LOGGER.error("Impossible de lire la configuration de bdd: " + dbConfigPath);
      LOGGER.error(error);
      return false;
    }

    base = new Base(configuration);

    this._baseCatalog[dbConfigPath] = base;
    this._loadedBaseConfiguration = dbConfigPath;

    return true;

  }

}
