'use strict';

const fs = require('fs');
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

    // Liste des ids de projections disponibles car déjà chargées dans proj4
    this._loadedProjectionId = new Array();

    // Liste des ids des projections déjà vérifiées et qui doivent être cohérentes avec les prochaines qui seront vérifiés
    // Cet objet doit être vidé quand l'ensemble des configurations a été vérifié
    this._checkedProjectionId = new Array();

  }

  /**
  *
  * @function
  * @name get loadedProjectionId
  * @description Récupérer la liste des ids de projections disponibles
  *
  */
  get loadedProjectionId () {
    return this._loadedProjectionId;
  }

  /**
  *
  * @function
  * @name isProjectionLoaded
  * @description Savoir si une projection est disponible dans l'instance de proj4
  * @param {string} id - ID de la projection 
  *
  */
  isProjectionLoaded (id) {

    if (!id) {
      return false;
    }
    if (this._loadedProjectionId.length === 0) {
      return false;
    }

    for (let i = 0; i < this._loadedProjectionId.length; i++) {
      if (id === this._loadedProjectionId[i]) {
        return true;
      }
    }

    return false;

  }

  /**
  *
  * @function
  * @name isProjectionChecked
  * @description Savoir si une projection a été validé durant l'étape de vérification
  * @param {string} id - ID de la projection 
  *
  */
   isProjectionChecked (id) {

    if (!id) {
      return false;
    }
    if (this._checkedProjectionId.length === 0) {
      return false;
    }

    for (let i = 0; i < this._checkedProjectionId.length; i++) {
      if (id === this._checkedProjectionId[i]) {
        return true;
      }
    }

    return false;

  }

  /**
  *
  * @function
  * @name checkBboxConfiguration
  * @description Savoir si une bbox est valide dans une projection donnée
  * @param {string} bbox - Bbox à vérifier
  *
  */
  checkBboxConfiguration (bbox) {

    LOGGER.info("Vérification d'une bbox... ");
    LOGGER.debug("bbox:'" + bbox+"'");

    if (!bbox) {
      LOGGER.error("Aucune bbox fournie");
      return false;
    }

    if (typeof(bbox) !== "string") {
      LOGGER.error("La bbox fournie n'est pas une chaine de caracteres");
      return false;
    }

    let bboxArray = new Array();
    try {
      bboxArray = bbox.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
    } catch(error) {
      LOGGER.error("Impossible d'analyser la bbox");
      LOGGER.error(error);
      return false;
    }

    if (bboxArray === null) {
      LOGGER.error("La bbox n'est pas correctement formattée : aucune correspondance n'a été trouvée");
      return false;
    }

    if (bboxArray.length !== 5) {
      LOGGER.error("La bbox n'est pas correctement formattée : l'ensemble des correspondances n'a pas été correctement identifié");
      return false;
    }

    if (bboxArray[1] >= bboxArray[3]) {
      LOGGER.error("Mauvaise configuration : Xmin est supérieur ou égal à Xmax");
      return false;
    }

    if (bboxArray[2] >= bboxArray[4]) {
      LOGGER.error("Mauvaise configuration : Ymin est supérieur ou égal à Ymax");
      return false;
    }

    LOGGER.info("Vérification de la bbox terminée");
    return true;

  }

  /**
  *
  * @function
  * @name checkProjectionDirectory
  * @description Vérifier les projections d'un dossier
  * @param {string} projectionDirectory - Chemin absolu d'un dossier de projections 
  *
  */
  checkProjectionDirectory(projectionDirectory) {

    LOGGER.info("Vérification du dossier de projections...");

    if (fs.existsSync(projectionDirectory)) {

      try {

        // On vérifie que l'application peut lire les fichiers du dossier
        if (!fs.readdirSync(projectionDirectory).every(projectionName => {

          let projectionFile = projectionDirectory + "/" + projectionName;

          if (!this.checkProjectionFile(projectionFile)) {
            LOGGER.error("Le fichier " + projectionFile + " est mal configuré");
            return false;
          } else {
            LOGGER.info("Le fichier " + projectionFile + " est bien configuré");
            return true;
          }

          })
        ) {
          LOGGER.error("Un des fichiers de projection est mal configuré");
          return false;
        }

      } catch(error) {
        LOGGER.error("Impossible de lire le dossier");
        return false;
      }

      return true;

    } else {
      LOGGER.fatal("Mauvaise configuration: Dossier de projections inexistant : " + projectionDirectory);
      return false; 
    }

  }


  /**
  *
  * @function
  * @name checkProjectionFile
  * @description Vérifier les projections d'un fichier
  * @param {string} projectionFile - Chemin absolu d'un fichier de projections 
  *
  */
  checkProjectionFile(projectionFile) {

    LOGGER.info("Vérification du fichier de projections : " + projectionFile);

    try {
      fs.accessSync(projectionFile, fs.constants.R_OK);
    } catch (err) {
      LOGGER.error("Le fichier de projection ne peut etre lu: " + projectionFile);
      return false;
    }

    let fileContent = {};
    try {
      fileContent = JSON.parse(fs.readFileSync(projectionFile));
    } catch (error) {
      LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de projection: " + projectionFile);
      LOGGER.error(error);
      return false;
    }

    if (!fileContent.projectionsList) {
      LOGGER.error("La fichier des projections ne contient pas de liste");
      return false;
    }

    if (!Array.isArray(fileContent.projectionsList)) {
      LOGGER.error("L'attribut projectionsList de la configuration n'est pas un tableau.");
      return false;
    }

    if (fileContent.projectionsList.length === 0) {
      LOGGER.error("L'attribut projectionsList de la configuration est un tableau vide.");
      return false;
    }

    for (let i = 0; i < fileContent.projectionsList.length; i++) {
      if (!this.checkProjectionConfiguration(fileContent.projectionsList[i])) {
        LOGGER.error("Mauvaise configuration d'une projection dans le fichier.");
        return false;
      } else {
        this._checkedProjectionId.push(fileContent.projectionsList[i].id);
      }
    }

    return true;

  }

  /**
  *
  * @function
  * @name checkProjectionConfiguration
  * @description Vérifier les projections d'un fichier
  * @param {object} configuration - Configuration d'une projection
  *
  */
  checkProjectionConfiguration(configuration) {

    LOGGER.info("Vérification d'une projection");

    // id de la projection
    if (!configuration) {
      LOGGER.error("La configuration de la projection est vide");
      return false;
    } 

    // id de la projection
    if (!configuration.id) {
      LOGGER.error("La configuration de la projection n'a pas d'id");
      return false;
    } else {
      LOGGER.debug("Projection id : " + configuration.id);
    }

    // Parametres de la projection
    if (!configuration.parameters) {
      LOGGER.error("La configuration de la projection n'a pas de parametres");
      return false;
    } else {
      
      if (typeof configuration.parameters !== "string") {
        LOGGER.error("Les parametres de la projection ne sont pas une string");
        return false;
      } else {
        LOGGER.debug("Projection parameters : " + configuration.parameters);
      }

    }

    // On vérifie que l'id n'est pas déjà chargé
    if (this._loadedProjectionId.length !== 0) {
      for (let i = 0; i < this._loadedProjectionId.length; i++) {
        if (configuration.id === this._loadedProjectionId[i]) {
          LOGGER.error("Une projection contenant l'id " + configuration.id + " est deja chargee.");
          return false;
        }
      }
    }

    // On vérifie que l'id n'est pas déjà pris par le check courant
    if (this._checkedProjectionId.length !== 0) {
      for (let i = 0; i < this._checkedProjectionId.length; i++) {
        if (configuration.id === this._checkedProjectionId[i]) {
          LOGGER.error("Une projection contenant l'id " + configuration.id + " est deja verifiee.");
          return false;
        }
      }
    }

    return true;

  }

  /**
  *
  * @function
  * @name flushCheckedProjection
  * @description Vider la liste des projections déjà vérifiées 
  *
  */
  flushCheckedProjection() {

    this._checkedProjectionId = new Array();

  }

  /**
  *
  * @function
  * @name loadProjectionDirectory
  * @description Charger l'ensemble des projections décrites dans un dossier
  * @param {string} directory - Dossier qui contient des fichiers de description de projections (chemin absolu)
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

    let contentDir = new Array();
    try {
      contentDir = fs.readdirSync(directory);
    } catch(error) {
      LOGGER.error("Impossible de lire le dossier des projections: " + directory);
      LOGGER.error(error);
      return false;
    }

    if (!Array.isArray(contentDir)) {
      LOGGER.error("Erreur lors de la lecture du dossier " + directory);
      return false;
    } 

    if (contentDir.length === 0) {
      LOGGER.error("Le dossier " + directory + " ne contient aucun fichier.");
      return false;
    } 

    for (let i = 0; i < contentDir.length; i++) {
      let pathFile = directory + "/" + contentDir[i];
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
  * @param {string} file - Fichier qui contient un ensemble de descriptions des projections (chemin absolu)
  *
  */
  loadProjectionFile (file) {

    LOGGER.info("Chargement d'un fichier de projections")

    if (!file) {
      LOGGER.error("Pas de fichier");
      return false;
    } else {
      LOGGER.debug(file);
    }

    let pathFile = file;

    try {
      fs.accessSync(pathFile, fs.constants.R_OK);
    } catch (err) {
      LOGGER.error("Le fichier " + pathFile + " ne peut etre lu.");
      return false;
    }

    let fileContent = {};
    try {
      fileContent = JSON.parse(fs.readFileSync(pathFile));
    } catch (error) {
      LOGGER.error("Impossible de lire la configuration des projections: " + pathFile);
      LOGGER.error(error);
      return false;
    }

    if (!fileContent.projectionsList) {
      LOGGER.error("La configuration des projections ne contient pas de liste");
      return false;
    }

    if (!Array.isArray(fileContent.projectionsList)) {
      LOGGER.error("L'attribut projectionsList de la configuration n'est pas un tableau.");
      return false;
    }

    if (fileContent.projectionsList.length === 0) {
      LOGGER.error("L'attribut projectionsList de la configuration est un tableau vide.");
      return false;
    }

    for (let i = 0; i < fileContent.projectionsList.length; i++) {
      if (!this.loadProjectionConfiguration(fileContent.projectionsList[i])) {
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
  * @name loadProjectionConfiguration
  * @description Charger la projection décrite via sa configuration
  * @param {json} configuration - configuration de la projection
  *
  */
  loadProjectionConfiguration (configuration) {

    LOGGER.info("Chargement d'une projection");

    // id de la projection
    if (!configuration) {
      LOGGER.error("La configuration de la projection est vide");
      return false;
    } 

    // id de la projection
    if (!configuration.id) {
      LOGGER.error("La configuration de la projection n'a pas d'id");
      return false;
    } else {
      LOGGER.debug(configuration.id);
    }

    // Parametres de la projection
    if (!configuration.parameters) {
      LOGGER.error("La configuration de la projection n'a pas de parametres");
      return false;
    } else {
      // On ne vérifie pas les paramètres car c'est fait dans le check
      LOGGER.debug(configuration.parameters);
    }

    // On vérifie que l'id n'est pas déjà pris
    if (this._loadedProjectionId.length !== 0) {
      for (let i = 0; i < this._loadedProjectionId.length; i++) {
        if (configuration.id === this._loadedProjectionId[i]) {
          LOGGER.error("Une projection contenant l'id " + configuration.id + " est deja referencee.");
          return false;
        }
      }
    }

    // On charge la projection dans proj4
    try {

      proj4.defs(configuration.id, configuration.parameters);
      // On stocke l'id
      this._loadedProjectionId.push(configuration.id);

    } catch(error) {
      LOGGER.error("Impossible de charger la projection dans proj4: ");
      LOGGER.error(error);
      return false;
    }


    return true;

  }

}
