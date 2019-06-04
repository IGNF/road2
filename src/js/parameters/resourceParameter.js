'use strict';

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
  * @param {string} id - Id du paramètre, unique au service
  *
  */
  constructor(id) {

    // id
    this._serviceParameterId = id;

  }

  /**
  *
  * @function
  * @name get serviceParameterId
  * @description Récupérer l'id du paramètre
  *
  */
  get serviceParameterId () {
    return this._serviceParameterId;
  }

  /**
  *
  * @function
  * @name load
  * @description Charger la configuration
  *
  */
  load(serviceParameterConf, parameterConf) {

    return false;

  }

  /**
  *
  * @function
  * @name check
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  *
  */
  check(userValue) {

    return false;

  }


}
