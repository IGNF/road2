'use strict';

const ResourceParameter = require('../parameters/resourceParameter');
const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const validationManager = require('../utils/validationManager');


var LOGGER = log4js.getLogger("BOOLPARAM");

/**
*
* @class
* @name BoolParameter
* @description Classe modélisant un paramètre de type boolean, dans une opération.
*
*/

module.exports = class BoolParameter extends ResourceParameter {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe BoolParameter
  * @param {object} parameter - Référence au paramètre de service
  *
  */
  constructor(parameter) {

    // id
    super(parameter);

    // defaultValueContent
    this._defaultValueContent;

    // values
    this._values = [true, false];

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
      this._defaultValueContent = this.specificConvertion(parameterConf.defaultValueContent);
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

    if (typeof userValue !== "string") {
      return errorManager.createErrorMessage("value is not a string but it should be");
    } else {
      LOGGER.debug("user value is a string");
    }

    if (userValue !== "true" && userValue !== "false") {
      return errorManager.createErrorMessage("value should be 'true' or 'false'");
    } else {
      LOGGER.debug("user value is ok");
      return validationManager.createValidationMessage("");
    }

    

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

    if (userValue === "true") {
      return true;
    } else if (userValue === "false") {
      return false;
    } else {
      return null;
    }
    
  }


}
