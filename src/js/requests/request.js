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
  * @param {string} type - Type de la requête
  *
  */
  constructor(operation, type) {

    // Opération concernée
    this._operation = operation;

    // Type de la requête (ne doit pas être modifié)
    this._type = type;

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

}
