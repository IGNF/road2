'use strict';

const ResourceParameter = require('../parameters/resourceParameter');

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

    // id
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
  * @name check
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  *
  */
  specificCheck(userValue) {

    for (let j = 0; j < this._values.length; j++) {
      if (userValue === this._values[j]) {
        return true;
      }
    }

    return false;

  }


}
