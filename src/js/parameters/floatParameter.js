'use strict';

const ResourceParameter = require('./resourceParameter');
const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const validationManager = require('../utils/validationManager');


var LOGGER = log4js.getLogger("FLOATPARAM");

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
  * @return {object} result.code - "ok" si tout s'est bien passé et "error" sinon
  *                  result.message - "" si tout s'est bien passé et la raison de l'erreur sinon
  *
  *
  */
  specificCheck(userValue) {

    LOGGER.debug("specificCheck()");

    let userFloat;

    // Vérifier que la valeur introduite est de type float
    if(typeof userValue === "string") {

      LOGGER.debug("user value is a string");
      userFloat = this.filterFloat(userValue);

    } else if (typeof userValue === "number") {

      LOGGER.debug("user value is a number");
      userFloat = userValue;

    } else {
      return errorManager.createErrorMessage("user value is nor a string, nor a number");
    }

    if (isNaN(userFloat)) {
      return errorManager.createErrorMessage("user value is NaN");
    } else {
      LOGGER.debug("user value is NOT NaN");
    }

    // TODO: trouver une meilleure solution sachant que la fonction isFinite() ne fonctionne pas...
    if (userFloat === Infinity || userFloat === -Infinity) {
      return errorManager.createErrorMessage("user value is Infinity");
    } else {
      LOGGER.debug("user value is NOT infinity");
    }
    
    if (this._min && (userFloat < this._min)) {
      return errorManager.createErrorMessage("user value is inferior to the min " + this._min);
    } else {
      LOGGER.debug("user value is NOT inferior to the min");
    }

    if (this._max && (userFloat > this._max)) {
      return errorManager.createErrorMessage("user value is superior to the max " + this._max);
    } else {
      LOGGER.debug("user value is NOT superior to the max");
    }

    return validationManager.createValidationMessage("");

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
