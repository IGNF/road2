'use strict';

const ResourceParameter = require('./resourceParameter');

/**
*
* @class
* @name FloatParameter
* @description Classe modélisant un paramètre de type float dans une opération.
*
*/

module.exports = class FloatParameter extends ResourceParameter {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe FloatParameter
  * @param {object} parameter - Référence au paramètre de service
  *
  */
  constructor(parameter) {

    // id
    super(parameter);

    // defaultValueContent
    /* TODO: À revoir. Pour le moment, c'est une initialisation toute bête.  */
    this._defaultValueContent = 0;

    /* Valeur min. */
    this._min = null;

    /* Valeur max. */
    this._max = null;

  }

  /**
  *
  * @function
  * @name get defaultValueContent
  * @description Récupérer la valeur par défaut
  *
  */
  get defaultValueContent () {
    return this._defaultValueContent;
  }

  /**
  *
  * @function
  * @name load
  * @description Charger la configuration
  * @param {string} parameterConf - Configuration d'un paramètre
  * @return {boolean}
  *
  */
  load(parameterConf) {

    if (super.serviceParameter.defaultValue === "true") {
      this._defaultValueContent = parameterConf.defaultValueContent;
    }

    if (parameterConf.min) {
      this._min = parameterConf.min;
    }

    if (parameterConf.max) {
      this._max = parameterConf.max;
    }

    return true;

  }

  /**
  *
  * @function
  * @name check
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @return {boolean}
  *
  */
  specificCheck(userValue) {

    let userFloat;
    /* Vérifier que la valeur introduite est de type float. */
    if(typeof userValue === "string") {
      userFloat = this.filterFloat(userValue);
      if (isNaN(userFloat)) {
        return false;
      }
      // TODO: la fonction isFinite() ne fonctionne pas...
      if (userFloat === Infinity || userFloat === -Infinity) {
        return false;
      }
    } else if (typeof userValue === "number") {
      userFloat = userValue;
    } else {
      return false;
    }
    
    if (this._min && (userFloat < this._min)) {
      return false;
    }

    if (this._max && (userFloat > this._max)) {
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name specificConvertion
  * @description Convertir une valeur dans un format adapté aux requêtes
  * @param {string} userValue - Valeur à vérifier
  * @return {object}
  *
  */
  specificConvertion(userValue) {

    return parseFloat(userValue);

  }

  /**
  *
  * @function
  * @name filterFloat
  * @description Convertir une valeur en float
  * @param {string} value - Valeur à convertir
  * @return {float}
  *
  */

  filterFloat(value) {

    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
      return Number(value);
    } else {
      return NaN;
    }
    
  }


}
