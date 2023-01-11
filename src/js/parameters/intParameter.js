'use strict';

const ResourceParameter = require('./resourceParameter');
const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const validationManager = require('../utils/validationManager');


var LOGGER = log4js.getLogger("INTPARAM");

/**
*
* @class
* @name IntParameter
* @description Classe modélisant un paramètre de type int dans une opération.
*
*/

module.exports = class IntParameter extends ResourceParameter {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe IntParameter
  * @param {object} parameter - Référence au paramètre de service
  *
  */
  constructor(parameter) {

    // Paramètre de service
    super(parameter);

    // defaultValueContent
    /* TODO: À revoir. Pour le moment, c'est une initialisation toute bête.  */
    this._defaultValueContent = 0;


    // values 
    this._values = {};
    // Valeur min
    this._values.min = null;
    // Valeur max
    this._values.max = null;

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

  /*
  * @function
  * @name get values
  * @description Récupérer les valeurs possibles (quand elles sont précisées)
  *
  */
  get values () {
    return this._values;
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

    if (parameterConf.values){
      if (parameterConf.values.min) {
        this._values.min = parameterConf.values.min;
      }
  
      if (parameterConf.values.max) {
        this._values.max = parameterConf.values.max;
      }
    }
    

    return true;

  }

  /**
  *
  * @function
  * @name specificCheck
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @return {object} result.code - "ok" si tout s'est bien passé et "error" sinon
  *                  result.message - "" si tout s'est bien passé et la raison de l'erreur sinon
  *
  *
  */
  specificCheck(userValue) {

    LOGGER.debug("specificCheck()");

    let userInt;

    // Vérifier que la valeur introduite est de type int
    if(typeof userValue === "string") {

      LOGGER.debug("user value is a string");
      userInt = parseInt(userValue), 10;

    } else if (typeof userValue === "number") {

      LOGGER.debug("user value is a number");
      userInt = Math.trunc(userValue);

    } else {
      return errorManager.createErrorMessage("user value is nor a string, nor a number");
    }

    if (isNaN(userInt)) {
      return errorManager.createErrorMessage("user value is not a number");
    } else {
      LOGGER.debug("user value is NOT NaN");
    }

    // TODO: trouver une meilleure solution sachant que la fonction isFinite() ne fonctionne pas...
    if (userInt === Infinity || userInt === -Infinity) {
      return errorManager.createErrorMessage("user value is Infinity");
    } else {
      LOGGER.debug("user value is NOT infinity");
    }
    
    if (this._values.min && (userInt < this._values.min)) {
      return errorManager.createErrorMessage("user value is inferior to the min " + this._values.min);
    } else {
      LOGGER.debug("user value is NOT inferior to the min");
    }

    if (this._values.max && (userInt > this._values.max)) {
      return errorManager.createErrorMessage("user value is superior to the max " + this._values.max);
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
  * @param {string} userValue - Valeur à convertir
  * @return {object}
  *
  */
  specificConvertion(userValue) {

    return parseInt(userValue, 10);

  }


}
