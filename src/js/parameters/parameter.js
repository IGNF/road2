'use strict';

/**
*
* @class
* @name Parameter
* @description Classe modélisant un paramètre, dans une opération, pour un service.
*
*/

module.exports = class Parameter  {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Parameter
  * @param {string} id - Id du paramètre, unique au service
  * @param {string} type - Type du paramètre
  * @param {string} name - Nom du paramètre, unique au service
  * @param {string} description - Description du paramètre, unique au service
  * @param {string} required - Précise si le paramètre est requis
  * @param {string} defaultValue - Précise si le paramètre contient une valeur par défaut
  *
  */
  constructor(id, type, name, description, required, defaultValue) {

    // id
    this._id = id;

    // type
    this._type = type;

    // nom du paramètre
    this._name = name;

    // description du paramètre
    this._description = description;

    // required
    this._required = required;

    // default
    this._defaultValue = defaultValue;

  }

  /**
  *
  * @function
  * @name get id
  * @description Récupérer l'id du paramètre
  *
  */
  get id () {
    return this._id;
  }

  /**
  *
  * @function
  * @name get type
  * @description Récupérer le type du paramètre
  *
  */
  get type () {
    return this._type;
  }

  /**
  *
  * @function
  * @name get name
  * @description Récupérer le nom du paramètre
  *
  */
  get name () {
    return this._name;
  }

  /**
  *
  * @function
  * @name get description
  * @description Récupérer la description du paramètre
  *
  */
  get description () {
    return this._description;
  }

  /**
  *
  * @function
  * @name get required
  * @description Récupérer le required du paramètre
  *
  */
  get required () {
    return this._required;
  }

  /**
  *
  * @function
  * @name get defaultValue
  * @description Récupérer le defaultValue du paramètre
  *
  */
  get defaultValue () {
    return this._defaultValue;
  }


}
