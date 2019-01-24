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
  *
  */
  constructor(resource) {

    // Ressource concernée
    this._resource = resource;

  }

  /**
  *
  * @function
  * @name get resource
  * @description Récupérer la ressource de la requête
  *
  */
  get resource () {
    return this._resource;
  }

  /**
  *
  * @function
  * @name set resource
  * @description Attribuer la ressource de la requête
  *
  */
  set resource (res) {
    this._resource = res;
  }


}
