'use strict';

const Request = require('./request');

/**
*
* @class
* @name serviceRequest
* @description Classe modélisant une requête sur un service géré par l'administrateur.
*
*/

module.exports = class serviceRequest extends Request {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe serviceRequest
  * @param {string} serviceId - Id du service interrogé
  *
  */

  constructor(serviceId) {

    super("service", "serviceRequest");

    // Id du service d'après l'administrateur
    this._service = serviceId;

  }

  /**
  *
  * @function
  * @name get service
  * @description Récupérer le caractère verbeux de la requête
  *
  */
  get service() {
    return this._service;
  }

  /**
  *
  * @function
  * @name set service
  * @description Attribuer le caractère verbeux de la requête.
  * @param {string} id - Id du service 
  *
  */
  set service(id) {
    this._service = id;
  }

}
