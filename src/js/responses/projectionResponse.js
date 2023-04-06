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
  * @params {string} id - Id de la projection 
  * @params {string} parameters - Paramétres de la projection 
  *
  */
  constructor(id, parameters) {

    // Type de la réponse 
    super("projectionResponse");

    // Identifiant
    this._id = id;

    // Paramétres 
    this._parameters = parameters;

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
  * @name get parameters
  * @description Récupérer les paramétres
  *
  */
   get parameters () {
    return this._parameters;
  }



}
