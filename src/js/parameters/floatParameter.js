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
    this._defaultValueContent = 0;

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

    if (parameterConf.values) {
      this._values = parameterConf.values;
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

    if (this._values.length > 0) {
      for (let j = 0; j < this._values.length; j++) {
        if (userValue === this._values[j]) {
          return true;
        }
      }

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

    return userValue;

  }


}
