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
  * @description Constructeur de la classe Request
  * @param {string} operation - Type d'opération concernée
  * @param {string} resource - Ressource concernée
  *
  */
  constructor(operation, resource, type) {

    // Opération concernée
    this._operation = operation;

    // Ressource concernée
    this._resource = resource;

    // Type de la requête
    this._type = type;

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
  * @param {string} res - Id de la ressource
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
  * @param {string} op - Nom de l'opération
  *
  */
  set operation (op) {
    this._operation = op;
  }

  /**
  *
  * @function
  * @name get type
  * @description Récupérer le type de la requête
  *
  */
  get type () {
    return this._type;
  }

  /**
  *
  * @function
  * @name set type
  * @description Attribuer le type de la requête
  * @param {string} ty - Type de la requête 
  *
  */
  set type (ty) {
    this._type = ty;
  }




}
