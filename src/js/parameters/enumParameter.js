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
  * @param {string} id - Id du paramètre de service
  *
  */
  constructor(id) {

    // id
    super(id);

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
  load(serviceParameterConf, parameterConf) {

    if (serviceParameterConf.defaultValue === "true") {
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
  check(userValue) {

    for (let i = 0; i < this._values.length; i++) {
      if (userValue === this._values[i]) {
        return true;
      }
    }

    return false;


  }


}
