'use strict';

const fs = require('fs');
const path = require('path');
const proj4 = require('proj4');
const log4js = require('log4js');

var LOGGER = log4js.getLogger("PROJECTIONMANAGER");

/**
*
* @class
* @name ProjectionManager
* @description Classe modélisant un manager de projections.
*
*
*/

module.exports = class ProjectionManager {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe ProjectionManager
  *
  */
  constructor() {

    // Liste des ids de projections disponibles
    this._listOfProjectionId = new Array();

  }

  /**
  *
  * @function
  * @name get listOfProjectionId
  * @description Récupérer la liste des ids de projections disponibles
  *
  */
  get listOfProjectionId () {
    return this._listOfProjectionId;
  }

  /**
  *
  * @function
  * @name isAvailableById
  * @description Savoir si une projection est disponible
  *
  */
  isAvailableById (id) {

    if (!id) {
      return false;
    }
    if (this._listOfProjectionId.length === 0) {
      return false;
    }

    for (let i = 0; i < this._listOfProjectionId.length; i++) {
      if (id === this._listOfProjectionId[i]) {
        return true;
      }
    }

    return false;

  }

  /**
  *
  * @function
  * @name loadProjectionDirectory
  * @description Charger l'ensemble des projections décrites dans un dossier
  * @param {string} directory - Dossier qui contient des fichiers de description de projections
  *
  */
  loadProjectionDirectory (directory) {

    LOGGER.info("Chargement d'un dossier de projections")

    if (!directory) {
      LOGGER.error("Pas de dossier");
      return false;
    } else {
      LOGGER.info(directory);
    }

    let pathDir = path.resolve(__dirname, directory);

    let contentDir = fs.readdirSync(pathDir);

    if (!Array.isArray(contentDir)) {
      LOGGER.error("Erreur lors de la lecture du dossier " + pathDir);
      return false;
    } 

    if (contentDir.length === 0) {
      LOGGER.error("Le dossier " + pathDir + " ne contient aucun fichier.");
      return false;
    } 

    for (let i = 0; i < contentDir.length; i++) {
      let pathFile = pathDir + "/" + contentDir[i];
      if (!this.loadProjectionFile(pathFile)) {
        LOGGER.error("Erreur lors du chargement d'une projection du fichier.");
        return false;
      }
    }

    LOGGER.info("Fichier charge");
    return true;

  }

  /**
  *
  * @function
  * @name loadProjectionFile
  * @description Charger l'ensemble des projections décrites dans un fichier
  * @param {string} file - Fichier qui contient un ensemble de descriptions des projections
  *
  */
  loadProjectionFile (file) {

    LOGGER.info("Chargement d'un fichier de projections")

    if (!file) {
      LOGGER.error("Pas de fichier");
      return false;
    } else {
      LOGGER.info(file);
    }

    let pathFile = path.resolve(__dirname, file);

    try {
      fs.accessSync(pathFile, fs.constants.R_OK);
    } catch (err) {
      LOGGER.error("Le fichier " + pathFile + " ne peut etre lu.");
      return false;
    }

    let fileContent = JSON.parse(fs.readFileSync(pathFile));

    if (!Array.isArray(fileContent.projectionsList)) {
      LOGGER.error("Le fichier n'est pas un tableau.");
      return false;
    }

    if (fileContent.projectionsList.length === 0) {
      LOGGER.error("Le fichier est un tableau vide.");
      return false;
    }

    for (let i = 0; i < fileContent.projectionsList.length; i++) {
      if (!this.loadProjection(fileContent.projectionsList[i])) {
        LOGGER.error("Erreur lors du chargement d'une projection du fichier.");
        return false;
      }
    }

    LOGGER.info("Fichier charge");
    return true;

  }

  /**
  *
  * @function
  * @name loadProjection
  * @description Charger la projection décrite via sa configuration
  * @param {json} configuration - configuration de la projection
  *
  */
  loadProjection (configuration) {

    LOGGER.info("Chargement d'une projection");

    // id de la projection
    if (!configuration) {
      LOGGER.error("Pas de configuration");
      return false;
    } 

    // id de la projection
    if (!configuration.id) {
      LOGGER.error("Pas d'id");
      return false;
    } else {
      LOGGER.info(configuration.id);
    }

    // Parametres de la projection
    if (!configuration.parameters) {
      LOGGER.error("Pas de parametres");
      return false;
    } else {
      // TODO: vérification des parametres ?
    }

    // On vérifie que l'id n'est pas déjà pris
    if (this._listOfProjectionId.length !== 0) {
      for (let i = 0; i < this._listOfProjectionId.length; i++) {
        if (configuration.id === this._listOfProjectionId[i]) {
          LOGGER.error("Une projection contenant l'id " + configuration.id + " est deja referencee.");
          return false;
        }
      }
    }

    // On charge la projection dans proj4
    proj4.defs(configuration.id, configuration.parameters);

    // On stocke l'id
    this._listOfProjectionId.push(configuration.id);

    return true;

  }

}
