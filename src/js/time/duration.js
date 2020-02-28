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
  * @param {float|string} value - Valeur de la durée
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

    if (unit !== "hour" && unit !== "minute" && unit !== "second" && unit !== "standard") {
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

    if (unit === "hour" && this._unit === "standard") {
      let array = this._value.split(":");
      let h = parseFloat(array[0]);
      let m = parseFloat(array[1]);
      let s = parseFloat(array[2]);
      this._value = h + m/60 + s/3600;
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

    if (unit === "minute" && this._unit === "standard") {
      let array = this._value.split(":");
      let h = parseFloat(array[0]);
      let m = parseFloat(array[1]);
      let s = parseFloat(array[2]);
      this._value = h*60 + m + s/60;
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

    if (unit === "second" && this._unit === "standard") {
      let array = this._value.split(":");
      let h = parseFloat(array[0]);
      let m = parseFloat(array[1]);
      let s = parseFloat(array[2]);
      this._value = h*3600 + m*60 + s;
      this._unit = "second";
      return true;
    }

    if (unit === "standard" && this._unit === "second") {
      this._value = this.convertSecondToStandard(this._value);
      this._unit = "standard";
      return true;
    }

    if (unit === "standard" && this._unit === "minute") {
      this._value = this.convertSecondToStandard(this._value * 60);
      this._unit = "standard";
      return true;
    }

    if (unit === "standard" && this._unit === "hour") {
      this._value = this.convertSecondToStandard(this._value * 3600);
      this._unit = "standard";
      return true;
    }

    return false;

  }

  /**
  *
  * @function
  * @name convertSecondToStandard
  * @description Convertir des secondes au format standard 
  * @param{float} second - Nombre de secondes
  *
  */
  convertSecondToStandard (sec) {

    let s = sec % 60;
    let mi = Math.floor(sec / 60);
    let m = mi % 60;
    let h = Math.floor(mi / 60);
    if (s < 10) {s = "0" + s;}
    if (m < 10) {m = "0" + m;}
    if (h < 10) {h = "0" + h;}
    return h + ":" + m + ":" + s;
    
  }


}
