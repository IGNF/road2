'use strict';

const ResourceParameter = require('./resourceParameter');
const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const validationManager = require('../utils/validationManager');

const LOGGER = log4js.getLogger("STRINGPARAM");

/**
*
* @class
* @name StringParameter
* @description Classe modelisant un parametre de type string dans une operation.
*
*/
module.exports = class StringParameter extends ResourceParameter {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe StringParameter
  * @param {object} parameter - Reference au parametre de service
  *
  */
  constructor(parameter) {

    // Parametre de service
    super(parameter);

    // defaultValueContent
    this._defaultValueContent = "";

    // values
    this._values = {};
    this._values.pattern = null;

  }

  /**
  *
  * @function
  * @name get defaultValueContent
  * @description Recuperer la valeur par defaut
  *
  */
  get defaultValueContent() {
    return this._defaultValueContent;
  }

  /**
  *
  * @function
  * @name get values
  * @description Recuperer les valeurs possibles (quand elles sont precisees)
  *
  */
  get values() {
    return this._values;
  }

  /**
  *
  * @function
  * @name load
  * @description Charger la configuration
  * @param {string} parameterConf - Configuration d'un parametre
  * @return {boolean}
  *
  */
  load(parameterConf) {

    if (super.serviceParameter.defaultValue === "true") {
      this._defaultValueContent = parameterConf.defaultValueContent;
    }

    if (parameterConf.values && parameterConf.values.pattern) {
      this._values.pattern = parameterConf.values.pattern;
    }

    return true;

  }

  /**
  *
  * @function
  * @name specificCheck
  * @description Verifier la validite d'une valeur par rapport au parametre
  * @param {string} userValue - Valeur a verifier
  * @return {object} result.code - "ok" si tout s'est bien passe et "error" sinon
  *                  result.message - "" si tout s'est bien passe et la raison de l'erreur sinon
  *
  */
  specificCheck(userValue) {

    LOGGER.debug("specificCheck()");

    if (typeof userValue !== "string") {
      return errorManager.createErrorMessage("value is not a string but it should be");
    }

    if (this._values.pattern) {
      const regex = new RegExp(this._values.pattern);
      if (!regex.test(userValue)) {
        return errorManager.createErrorMessage("value does not match required pattern");
      }
    }

    return validationManager.createValidationMessage("");

  }

  /**
  *
  * @function
  * @name specificConvertion
  * @description Convertir une valeur dans un format adapte aux requetes
  * @param {string} userValue - Valeur a verifier
  * @return {object}
  *
  */
  specificConvertion(userValue) {

    return userValue;

  }

}