'use strict';

const Request = require('./request');

/**
*
* @class
* @name healthRequest
* @description Classe modélisant une requête d'état du serveur Road2.
*
*/

module.exports = class healthRequest extends Request {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe healthRequest
  *
  */

  constructor() {

    super("health","healthRequest");

    this._verbose = false;

  }

  /**
  *
  * @function
  * @name get verbose
  * @description Récupérer le caractère verbeux de la requête
  *
  */
  get verbose() {
    return this._verbose;
  }

  /**
  *
  * @function
  * @name set verbose
  * @description Attribuer le caractère verbeux de la requête.
  * @param {Boolean} 
  *
  */
  set verbose(v) {
    this._verbose = v;
  }

}
