'use strict';

const ResourceParameter = require('../parameters/resourceParameter');
const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const validationManager = require('../utils/validationManager');


var LOGGER = log4js.getLogger("ENUMPARAM");

/**
*
* @class
* @name EnumParameter
* @description Classe modélisant un paramètre de type enumeration, dans une opération.
*
*/

module.exports = class EnumParameter extends ResourceParameter {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe EnumParameter
  * @param {object} parameter - Référence au paramètre de service
  *
  */
  constructor(parameter) {

    // Paramètre de service
    super(parameter);

    // defaultValueContent
    this._defaultValueContent = "";

    // values
    this._values = new Array();

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
  * @name get values
  * @description Récupérer l'ensemble des valeurs par défaut
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

    this._values = parameterConf.values;

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

    if (typeof userValue !== "string") {
      return errorManager.createErrorMessage("value is not a string but it should be");
    } else {
      LOGGER.debug("user value is a string");
    }

    for (let j = 0; j < this._values.length; j++) {
      if (userValue === this._values[j]) {
        LOGGER.debug("user value is ok");
        return validationManager.createValidationMessage("");
      } 
    }

    return errorManager.createErrorMessage("value should be one of " + this._values);

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

    return userValue;

  }


}
