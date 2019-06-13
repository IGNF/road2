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

    // example
    this._example = "";

    // min
    if (this._required) {
      this._min = 1;
    } else {
      this._min = 0;
    }

    // max
    this._max = 1;

    // explode
    // dans le cas où il y a plusieurs valeurs, cela indique si c'est dans un tableau (true) ou dans une string (false)
    this._explode = "false";

    // style
    // si explode = false alors il faut préciser le séparateur utilisé pour différencier les valeurs
    this._style = "pipeDelimited";

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

  /**
  *
  * @function
  * @name get example
  * @description Récupérer l'exemple du paramètre
  *
  */
  get example () {
    return this._example;
  }

  /**
  *
  * @function
  * @name get min
  * @description Récupérer le nombre minimal d'occurence du paramètre
  *
  */
  get min () {
    return this._min;
  }

  /**
  *
  * @function
  * @name get max
  * @description Récupérer le nombre maximal d'occurence du paramètre
  *
  */
  get max () {
    return this._max;
  }

  /**
  *
  * @function
  * @name get explode
  * @description Récupérer l'explode du paramètre
  *
  */
  get explode () {
    return this._explode;
  }

  /**
  *
  * @function
  * @name get style
  * @description Récupérer le style du paramètre
  *
  */
  get style () {
    return this._style;
  }

  /**
  *
  * @function
  * @name get example
  * @description Attribuer l'exemple du paramètre
  * @param {string} value - Exemple
  *
  */
  set example (value) {
    this._example = value;
  }

  /**
  *
  * @function
  * @name get min
  * @description Attribuer le nombre minimal d'occurence du paramètre
  * @param {string} value - Minimum
  *
  */
  set min (value) {
    this._min = value;
  }

  /**
  *
  * @function
  * @name get max
  * @description Attribuer le nombre maximal d'occurence du paramètre
  * @param {string} value - Maximum
  *
  */
  set max (value) {
    this._max = value;
  }

  /**
  *
  * @function
  * @name get explode
  * @description Attribuer l'explode du paramètre
  * @param {string} value - Explode
  *
  */
  set explode (value) {
    this._explode = value;
  }

  /**
  *
  * @function
  * @name get style
  * @description Attribuer le style du paramètre
  * @param {string} value - Style
  *
  */
  set style (value) {
    this._style = value;
  }


}
