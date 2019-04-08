'use strict';

const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("API");

/**
*
* @class
* @name Api
* @description Chaque api sera automatiquement chargée et gérée via une instance de cette classe
*
*/

module.exports = class Api {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Api
  *
  */
  constructor(id, version, routerFile) {

    // Id de l'Api
    this._id = id;

    // Version de l'Api
    this._version = version;

    // UID de l'Api
    this._uid = "api-"+id+"-"+version;

    // Fichier qui décrit le router ExpressJS
    this._routerFile = routerFile;

    // Fichier qui décrit le module d'initialisation de l'Api
    this._initFile = "";

    //Fichier qui décrit le module d'update de l'Api
    this._updateFile = "";

    // Pointeur vers le router
    this._router = require(routerFile);

    // Pointeur vers le module d'initialisation
    this._init = {};

    // Pointeur vers le module d'update
    this._update = {};

  }

  /**
  *
  * @function
  * @name get id
  * @description Récupérer l'id de l'Api
  *
  */
  get id () {
    return this._id;
  }

  /**
  *
  * @function
  * @name get version
  * @description Récupérer la version de l'Api
  *
  */
  get version () {
    return this._version;
  }

  /**
  *
  * @function
  * @name get uid
  * @description Récupérer l'uid de l'Api
  *
  */
  get uid () {
    return this._uid;
  }

  /**
  *
  * @function
  * @name get routerFile
  * @description Récupérer le routerFile de l'Api
  *
  */
  get routerFile () {
    return this._routerFile;
  }

  /**
  *
  * @function
  * @name get initFile
  * @description Récupérer le initFile de l'Api
  *
  */
  get initFile () {
    return this._initFile;
  }

  /**
  *
  * @function
  * @name set initFile
  * @description Attribuer le initFile de l'Api
  *
  */
  set initFile (file) {
    this._initFile = file;
    this._init = require(file);
  }

  /**
  *
  * @function
  * @name get updateFile
  * @description Récupérer le updateFile de l'Api
  *
  */
  get updateFile () {
    return this._updateFile;
  }

  /**
  *
  * @function
  * @name set updateFile
  * @description Attribuer le updateFile de l'Api
  *
  */
  set updateFile (file) {
    this._updateFile = file;
    this._update = require(file);
  }

  /**
  *
  * @function
  * @name initialize
  * @description Initialiser l'Api
  *
  */
  initialize (route, app) {

    // on execute la fonction d'initialisation de l'api
    if (this._initFile != "") {

      if (!this._init.run(app, this._uid)) {
        LOGGER.error("Erreur lors de l'initialisation de l'api.");
        return false;
      } else {
        // tout s'est bien déroulé
      }

    } else {
      // il n'y a rien à faire
    }


    // on charge le router dans l'app ExpressJS
    app.use(route, this._router);

    return true;

  }

  /**
  *
  * @function
  * @name update
  * @description Mettre à jour l'Api
  *
  */
  update (app) {

    if (this._updateFile != "") {

      if (!this._update.run(app, this._uid)) {
        LOGGER.error("Erreur lors de la MAJ de l'api.");
        return false;
      } else {
        // tout s'est bien déroulé
      }

    } else {
      // il n'y a rien à faire
    }

    return true;

  }

}
