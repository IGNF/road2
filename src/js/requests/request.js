'use strict';

/**
*
* @class
* @name Request
* @description Classe modélisant une requête.
* Chaque requête reçue par le service doit être transformée en requête de cette forme
* pour le proxy
*/

module.exports = class Request {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe routeRequest
  * @param {string} operation - Type d'opération concernée
  * @param {string} resource - Ressource concernée 
  *
  */
  constructor(operation, resource) {

    // Ressource concernée
    this._operation = operation;

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

  /**
  *
  * @function
  * @name get operation
  * @description Récupérer l'opération de la requête
  *
  */
  get operation () {
    return this._operation;
  }

  /**
  *
  * @function
  * @name set operation
  * @description Attribuer l'opération de la requête
  *
  */
  set operation (op) {
    this._operation = op;
  }




}
