'use strict';

const ResourceParameter = require('../parameters/resourceParameter');

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
  * @param {string} id - Id du paramètre de service
  *
  */
  constructor(id) {

    // id
    super(id);

    // defaultValueContent
    this._defaultValueContent = "";

    // values
    this._values = ["true", "false"];

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
  *
  */
  load(serviceParameterConf, parameterConf) {

    if (serviceParameterConf.defaultValue === "true") {
      this._defaultValueContent = parameterConf.defaultValueContent;
    }

    return true;

  }

  /**
  *
  * @function
  * @name check
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  *
  */
  check(userValue) {

    if (userValue !== "true" && userValue !== "false") {
      return false;
    } else {
      return true;
    }

  }


}
