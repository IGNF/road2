'use strict';

/**
*
* @class
* @name Duration
* @description Classe modélisant une durée dans un itinéraire.
*
*
*/

module.exports = class Duration {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Duration
  * @param {float} value - Valeur de la durée
  * @param {string} unit - Unité de la durée
  *
  */
  constructor(value, unit) {

    // Valeur de la durée
    this._value = value;

    // Unité de la durée
    this._unit = unit;

  }

  /**
  *
  * @function
  * @name get value
  * @description Récupérer la valeur de la durée
  *
  */
  get value () {
    return this._value;
  }

  /**
  *
  * @function
  * @name get unit
  * @description Récupérer l'unité de la durée
  *
  */
  get unit () {
    return this._unit;
  }



}
