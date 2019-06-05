'use strict';

/**
*
* @class
* @name Operation
* @description Classe modélisant une opération pour un service.
*
*/

module.exports = class Operation  {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Operation
  * @param {string} id - Id de l'opération, unique au service
  * @param {string} name - Nom de l'opération, unique au service
  * @param {string} description - Description de l'opération, unique au service
  * @param {object} parameters - Objet de paramètres de l'opération, unique au service
  *
  */
  constructor(id, name, description, parameters) {

    // id
    this._id = id;

    // nom de l'opération
    this._name = name;

    // description de l'opération
    this._description = description;

    // Paramètres de l'opération
    this._parameters = parameters;

  }

  /**
  *
  * @function
  * @name get id
  * @description Récupérer l'id de l'opération
  *
  */
  get id () {
    return this._id;
  }

  /**
  *
  * @function
  * @name get name
  * @description Récupérer le nom de l'opération
  *
  */
  get name () {
    return this._name;
  }

  /**
  *
  * @function
  * @name get description
  * @description Récupérer la description de l'opération
  *
  */
  get description () {
    return this._description;
  }

  /**
  *
  * @function
  * @name get parameters
  * @description Récupérer les paramètres de l'opération
  *
  */
  get parameters () {
    return this._parameters;
  }

  /**
  *
  * @function
  * @name getParameterById
  * @description Récupérer un paramètre de l'opération via son id
  *
  */
  getParameterById (id) {
    if (this._parameters[id]) {
      return this._parameters[id];
    } else {
      return {};
    }
  }


}
