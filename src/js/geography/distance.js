'use strict';

/**
*
* @class
* @name Distance
* @description Classe modélisant une distance dans un itinéraire.
*
*
*/

module.exports = class Distance {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Distance
  * @param {float} value - Valeur de la distance
  * @param {string} unit - Unité de la distance
  *
  */
  constructor(value, unit) {

    // Valeur de la distance
    this._value = value;

    // Unité de la distance
    this._unit = unit;

  }

  /**
  *
  * @function
  * @name get value
  * @description Récupérer la valeur de la distance
  *
  */
  get value () {
    return this._value;
  }

  /**
  *
  * @function
  * @name get unit
  * @description Récupérer l'unité de la distance
  *
  */
  get unit () {
    return this._unit;
  }

  /**
  *
  * @function
  * @name convert
  * @description Convertir la distance dans l'unité demandée
  * @param{string} unit - Unité demandée 
  *
  */
  convert (unit) {
    
    if (!unit) {
      return false;
    }

    if (unit !== "meter" && unit !== "kilometer") {
      return false;
    }

    if (unit === this._unit) {
      return true; 
    }

    if (unit === "meter" && this._unit === "kilometer") {
      this._value = this._value * 1000;
      this._unit = "meter";
      return true;
    }

    if (unit === "kilometer" && this._unit === "meter") {
      this._value = this._value / 1000;
      this._unit = "kilometer";
      return true;
    }

    return false;

  }



}
