'use strict';

/**
*
* @class
* @name Response
* @description Classe modélisant une réponse du service.
*
*/

module.exports = class Response {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Response
  * @param {string} type - Type de la réponse
  *
  */
  constructor(type) {

    // Nom de la ressource concernée par la réponse 
    this._type = type;

  }

  /**
  *
  * @function
  * @name get type
  * @description Récupérer la ressource de la requête
  *
  */
  get type () {
    return this._type;
  }


}
