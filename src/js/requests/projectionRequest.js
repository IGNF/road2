'use strict';

const Request = require('./request');

/**
*
* @class
* @name projectionRequest
* @description Classe modélisant une requête sur une projection d'un service géré par l'administrateur.
*
*/

module.exports = class projectionRequest extends Request {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe projectionRequest
  * @param {string} serviceId - Id du service interrogé
  * @param {string} projectionId - Id de la projection interrogée
  *
  */

  constructor(serviceId, projectionId) {

    super("projection", "projectionRequest");

    // Id du service d'après l'administrateur
    this._service = serviceId;

    // Id de la projection
    this._projection = projectionId;

  }

  /**
  *
  * @function
  * @name get service
  * @description Récupérer service de la requete
  *
  */
  get service() {
    return this._service;
  }

  /**
  *
  * @function
  * @name set service
  * @description Attribuer le service de la requete
  * @param {string} id - Id du service 
  *
  */
  set service(id) {
    this._service = id;
  }

  /**
  *
  * @function
  * @name get projection
  * @description Récupérer la projection demandée
  *
  */
  get projection() {
    return this._projection;
  }

  /**
  *
  * @function
  * @name set projection
  * @description Attribuer la projection de la requete
  * @param {string} id - Id de la projection 
  *
  */
  set projection(id) {
    this._projection = id;
  }

}
