'use strict';

var Source = require('./source');
const OSRM = require("osrm");

// Création du LOGGER
var LOGGER = global.log4js.getLogger("OSRMSOURCE");


/**
*
* @class
* @name osrmSource
* @description Classe modélisant une source OSRM.
*
*/

module.exports = class osrmSource extends Source {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe osrmSource
  *
  */
  constructor(sourceJsonObject) {

    // Constructeur parent
    super(sourceJsonObject.id,sourceJsonObject.type);

    // Stockage de la configuration
    this._configuration = sourceJsonObject;

    // Objet OSRM qui permet de faire les calculs
    this._osrm = {};

  }

  /**
  *
  * @function
  * @name get configuration
  * @description Récupérer la configuration de la source
  *
  */
  get configuration () {
    return this._configuration;
  }

  /**
  *
  * @function
  * @name set configuration
  * @description Attribuer la configuration de la source
  *
  */
  set configuration (conf) {
    this._configuration = conf;
  }

  /**
  *
  * @function
  * @name get osrm
  * @description Récupérer l'objet osrm de la source
  *
  */
  get osrm () {
    return this._osrm;
  }

  /**
  *
  * @function
  * @name set osrm
  * @description Attribuer l'objet osrm de la source
  *
  */
  set osrm (o) {
    this._osrm = o;
  }

  /**
  *
  * @function
  * @name connect
  * @description Chargement de la source OSRM, donc du fichier osrm
  *
  */
  connect() {

    // Récupération de l'emplacement du fichier OSRM
    var osrmFile = this._configuration.storage.file;
    LOGGER.info("Chargement du fichier OSRM: " + osrmFile);

    // Chargement du fichier OSRM
    this._osrm = new OSRM(osrmFile);
    super.connected = true;
    return true;

  }

  /**
  *
  * @function
  * @name disconnect
  * @description Déchargement de la source OSRM, donc du fichier osrm
  *
  */
  disconnect() {
    super.connected = false;
    return true;
  }


}
