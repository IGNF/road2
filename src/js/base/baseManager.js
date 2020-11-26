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
  * @param{string} dbConfig - Nom du fichier contenant les informations de connexion à la base
  *
  */
  async checkBase(dbConfig) {

    LOGGER.info("Verification de la configuration de la base de donnees...");

    let fullPath = path.resolve(__dirname, dbConfig);

    if (this._listOfVerifiedDbConfig.length !== 0) {

      for (let i = 0; i < this._listOfVerifiedDbConfig.length; i++) {
        if (fullPath === this._listOfVerifiedDbConfig[i]) {
          LOGGER.info("Configuration deja verifiee.")
          return true;
        }
      }

    } else {
      // C'est le premier, donc on continue
    }

    try {
      fs.accessSync(fullPath, fs.constants.R_OK);
    } catch (err) {
      LOGGER.error("Le fichier " + fullPath + " ne peut etre lu.");
      return false;
    }

    let fullPath = path.resolve(__dirname, dbConfig);
    let configuration = JSON.parse(fs.readFileSync(fullPath));
    base = new Base(configuration);

    try {
      LOGGER.info("Test de connexion à la base de donnees...");
      await base.connect();
      await base.disconnect();
    } catch (err) {
      LOGGER.error("Connection à la base décrite dans " + fullPath + " échouée.");
      return false;
    }

    // on stocke le chemin du fichier
    this._listOfVerifiedDbConfig.push(fullPath);

    LOGGER.info("Configuration de la base de donnees valide.");
    return true;

  }

  /**
  *
  * @function
  * @name createBase
  * @description Création de la connexion à une base de données
  * @param{string} dbConfig - Nom du fichier contenant les informations de connexion à la base
  *
  */
  createBase(dbConfig) {

    let base;
    let fullPath = path.resolve(__dirname, dbConfig);

    // on vérifie d'abord que la base n'a pas déjà été créée
    if (this._baseCatalog[fullPath]) {
      return this._baseCatalog[fullPath];
    } else {
      // la base n'existe pas, on continue
    }

    let configuration = JSON.parse(fs.readFileSync(fullPath));

    base = new Base(configuration);

    this._baseCatalog[fullPath] = base;

    return base;

  }

}
