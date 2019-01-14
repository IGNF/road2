'use strict';

var Resource = require('./resource');

/**
*
* @class
* @name osrmResource
* @description Classe modélisant une ressource OSRM.
*
*/

module.exports = class osrmResource extends Resource {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe osrmResource
  *
  */
  constructor(resourceJsonObject) {

    // Constructeur parent
    super(resourceJsonObject.resource.id,resourceJsonObject.resource.type);

    // Stockage de la configuration
    this.configuration = resourceJsonObject.resource;

  }

    /**
    *
    * @function
    * @name getConfiguration
    * @description Récupérer la configuration de la resource
    *
    */
    getConfiguration() {
      return this.configuration;
    }


}
