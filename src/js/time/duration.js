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

  /**
  *
  * @function
  * @name convert
  * @description Convertir la durée dans l'unité demandée
  * @param{string} unit - Unité demandée 
  *
  */
  convert (unit) {
      
    if (!unit) {
      return false;
    }

    if (unit !== "hour" && unit !== "minute" && unit !== "second") {
      return false;
    }

    if (unit === this._unit) {
      return true; 
    }

    if (unit === "hour" && this._unit === "second") {
      this._value = this._value / 3600;
      this._unit = "hour";
      return true;
    }

    if (unit === "hour" && this._unit === "minute") {
      this._value = this._value / 60;
      this._unit = "hour";
      return true;
    }

    if (unit === "minute" && this._unit === "hour") {
      this._value = this._value * 60;
      this._unit = "minute";
      return true;
    }

    if (unit === "minute" && this._unit === "second") {
      this._value = this._value / 60;
      this._unit = "minute";
      return true;
    }

    if (unit === "second" && this._unit === "hour") {
      this._value = this._value * 3600;
      this._unit = "second";
      return true;
    }

    if (unit === "second" && this._unit === "minute") {
      this._value = this._value * 60;
      this._unit = "second";
      return true;
    }

    return false;

  }



}
