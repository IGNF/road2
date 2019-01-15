'use strict';

var Source = require('./source');

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
    this.configuration = sourceJsonObject;

  }

    /**
    *
    * @function
    * @name getConfiguration
    * @description Récupérer la configuration de la source
    *
    */
    getConfiguration() {
      return this.configuration;
    }


}
