'use strict';

const Request = require('./request');

/**
*
* @class
* @name configurationRequest
* @description Classe modélisant une requête d'état du serveur Road2.
*
*/

module.exports = class configurationRequest extends Request {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe configurationRequest
  * @param {object} nConfiguration - Configuration cible
  *
  */

  constructor(nConfiguration) {

    super("patch-configuration","configurationRequest");

    // Configuration cible
    this._newConfiguration = nConfiguration;

  }

  /**
  *
  * @function
  * @name get newConfiguration
  * @description Récupérer la configuration cible
  *
  */
  get newConfiguration() {
    return this._newConfiguration;
  }

}
