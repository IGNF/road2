'use strict';

const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const Topology = require('./topology');

// Création du LOGGER
const LOGGER = log4js.getLogger("OSMTOPOLOGY");

/**
*
* @class
* @name dbTopology
* @description Classe modélisant une topologie se basant sur un fichier osm.
*
*/
module.exports = class osmTopology extends Topology {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe dbTopology
  * @param{string} id - Id de la topologie
  * @param{string} description - Description de la topologie
  * @param{string} projection - Projection de la topologie
  * @param{string} bbox - Bbox de la topologie
  * @param{string} file - Nom du fichier osm
  *
  */
  constructor(id, description, projection, bbox, file) {

    // ID de la topologie
    super(id, "osm", description, projection, bbox);

    // Nom du fichier osm
    this._file = file;

  }

  /**
  *
  * @function
  * @name get file
  * @description Récupérer le nom du fichier osm
  *
  */
  get file () {
    return this._file;
  }

}
