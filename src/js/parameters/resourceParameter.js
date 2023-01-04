'use strict';

const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const validationManager = require('../utils/validationManager');


var LOGGER = log4js.getLogger("RESOURCEPARAM");

/**
*
* @class
* @name ResourceParameter
* @description Classe modélisant un paramètre, dans une opération.
*
*/

module.exports = class ResourceParameter {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe ResourceParameter
  * @param {Parameter} parameter - Référence au paramètre de service, instance de la classe Parameter
  *
  */
  constructor(parameter) {

    // paramètre du service
    this._serviceParameter = parameter;

  }

  /**
  *
  * @function
  * @name get serviceParameter
  * @description Récupérer l'id du paramètre
  *
  */
  get serviceParameter () {
    return this._serviceParameter;
  }

  /**
  *
  * @function
  * @name load
  * @description Charger la configuration
  * @param {object} parameterConf - Configuration d'un paramètre
  * @return {boolean}
  *
  */
  load(parameterConf) {
    LOGGER.debug("configuration du parametre : " + parameterConf.toString());
    return false;
  }

  /**
  *
  * @function
  * @name check
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @param {object|string} options - Options
  * @return {object} result.code - "ok" si tout s'est bien passé et "error" sinon
  *                  result.message - "" si tout s'est bien passé et la raison de l'erreur sinon
  *
  */
  check(userValue, options) {

    LOGGER.debug("check()");

    let userTable = new Array();

    // La vérification dépend de plusieurs attributs du paramètre de service associé

    if (this.serviceParameter.explode === "true") {

      LOGGER.debug("the serviceParameter is exploded");

      // on lit un tableau de valeurs
      // on vérifie donc que c'est un tableau qui contient des valeurs
      if (!Array.isArray(userValue)) {
        return errorManager.createErrorMessage("value is not an array but it should be");
      } else {
        // on continue 
        LOGGER.debug("user parameter is an array");
      }

      if (userValue.length === 0) {
        return errorManager.createErrorMessage("value is an empty array but it should not be");
      } else {
        LOGGER.debug("user parameter is NOT an empty array");
        userTable = userValue;
      }

      

    } else {

      LOGGER.debug("the serviceParameter is NOT exploded");

      // on lit une string qui contient plusieurs valeurs
      if (typeof userValue === "string") {

        LOGGER.debug("user parameter is a string");

        // on sépare les valeurs
        if (this.serviceParameter.style === "pipeDelimited") {

          LOGGER.debug("user parameter is pipeDelimited");
          userTable = userValue.split("|");

        } else {
          //TODO: ce n'est pas censé arriver, que fait-on ? 
          return errorManager.createErrorMessage("");
        }

      } else {

        // on peut avoir simplement un float 
        // TODO: vérification du float ? 
        LOGGER.debug("user parameter is NOT a string");
        userTable = userValue;

      }

    }

    // on vérifie le nombre valeur
    if (userTable.length < this.serviceParameter.min || userTable.length > this.serviceParameter.max) {
      return errorManager.createErrorMessage("Min (or max) is not respected. " + userTable.length + " values is given but min is " + this.serviceParameter.min + " and max is " + this.serviceParameter.max);
    } else {
      LOGGER.debug("parameter has a good number of occurence");
    }

    for (let i = 0; i < userTable.length; i++) {
      let result = this.specificCheck(userTable[i], options);
      if (result.code !== "ok") {
        LOGGER.debug("user paramter " + i + " is NOT valide");
        return result;
      } else {
        LOGGER.debug("user parameter " + i + " is valide");
      }
    }

    // tout s'est bien passé
    return validationManager.createValidationMessage("");

  }

  /**
  *
  * @function
  * @name specificCheck
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @param {object} options - Options
  * @return {object} result.code - "ok" si tout s'est bien passé et "error" sinon
  *                  result.message - "" si tout s'est bien passé et la raison de l'erreur sinon
  *
  */
  specificCheck(userValue, options) {

    LOGGER.debug("specificCheck()");
    LOGGER.debug("user value : " + userValue);
    if (options) {
      LOGGER.debug("options: " + options.toString());
    }
    return errorManager.createErrorMessage("");

  }

  /**
  *
  * @function
  * @name convertIntoTable
  * @description Convertir l'entrée utilisateur en tableau de points pour une request
  * @param {string} userValue - Valeur à vérifier
  * @param {table} finalTable - Tableau à remplir
  * @param {object} options - Options
  * @return {boolean}
  *
  */
  convertIntoTable(userValue, finalTable, options) {

    LOGGER.debug("convertIntoTable()");

    let userTable = new Array();

    if (this.serviceParameter.explode === "true") {
      userTable = userValue;
    } else {

      if (this.serviceParameter.style === "pipeDelimited") {
        userTable = userValue.split("|");
      } else {
        return false;
      }

    }

    for (let i = 0; i < userTable.length; i++) {

      finalTable[i] = this.specificConvertion(userTable[i], options);
      if (finalTable[i] === null) {
        return false;
      } else {
        LOGGER.debug("user value " + i + " is converted");
      }

    }

    return true;

  }

  /**
  *
  * @function
  * @name specificConvertion
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @param {object} options - Options
  * @return {object}
  *
  */
  specificConvertion(userValue, options) {

    LOGGER.debug("specificConversion()");
    LOGGER.debug("user value : " + userValue);
    if (options) {
      LOGGER.debug("options: " + options.toString());
    }
    return null;

  }


}
