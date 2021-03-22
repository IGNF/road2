'use strict';

const log4js = require('log4js');
const path = require('path');
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

    // Liste des descriptions de bases vérifiées et validées par le manager
    this._listOfVerifiedDbConfig = new Array();

    // Le catalogue des bases créées par le manager
    this._baseCatalog = {};

  }

  /**
  *
  * @function
  * @name get listOfVerifiedDbConfig
  * @description Récupérer la liste des configurations
  *
  */
  get listOfVerifiedDbConfig() {
    return this._listOfVerifiedDbConfig;
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
  * @name checkBase
  * @description Vérification de la description de la configuration à une base de données.
  * @param{string} dbConfigPath - Nom du fichier contenant les informations de connexion à la base (chemin absolu)
  *
  */
  async checkBase(dbConfigPath) {

    LOGGER.info("Verification de la configuration de la base de donnees...");

    if (this._listOfVerifiedDbConfig.length !== 0) {

      for (let i = 0; i < this._listOfVerifiedDbConfig.length; i++) {
        if (dbConfigPath === this._listOfVerifiedDbConfig[i]) {
          LOGGER.info("Configuration deja verifiee.")
          return true;
        }
      }

    } else {
      // C'est le premier, donc on continue
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

    const base = new Base(configuration);

    try {
      LOGGER.info("Test de connexion à la base de donnees...");
      await base.connect();
      await base.disconnect();
    } catch (err) {
      LOGGER.error("Connection à la base décrite dans " + dbConfigPath + " échouée.");
      return false;
    }

    // on stocke le chemin du fichier
    this._listOfVerifiedDbConfig.push(dbConfigPath);

    LOGGER.info("Configuration de la base de donnees valide.");
    return true;

  }

  /**
  *
  * @function
  * @name createBase
  * @description Création de la connexion à une base de données
  * @param{string} dbConfigPath - Nom du fichier contenant les informations de connexion à la base (chemin absolu)
  *
  */
  createBase(dbConfigPath) {

    let base;

    // on vérifie d'abord que la base n'a pas déjà été créée
    if (this._baseCatalog[dbConfigPath]) {
      return this._baseCatalog[dbConfigPath];
    } else {
      // la base n'existe pas, on continue
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

    return base;

  }

}
