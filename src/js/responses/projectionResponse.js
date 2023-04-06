'use strict';

const Response = require('./response');

/**
*
* @class
* @name projectionResponse
* @description Classe modélisant une réponse de description d'une projection
*
*/

module.exports = class projectionResponse extends Response {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe projectionResponse
  *
  */
  constructor() {

    // Type de la réponse 
    super("projectionResponse");

    // Identifiant
    this._id = "";

  }

  /**
  *
  * @function
  * @name get id
  * @description Récupérer l'identifiant
  *
  */
   get id () {
    return this._id;
  }

  /**
  *
  * @function
  * @name set id
  * @description Attribuer l'identifiant
  * @param {string} id - identifiant
  *
  */
  set id (id) {
    this._id = id;
  }

}
