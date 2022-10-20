'use strict';

/**
*
* @class
* @name ServiceAdministered
* @description Classe modélisant une service administré par l'administrateur.
* @param {string} id - Identifiant du service administré
* @param {string} type - Type de service administré
*
*/

module.exports = class ServiceAdministered {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe ServiceAdministered
  * 
  */
  constructor(id, type) {

    // Id d'une ressource. Il doit être unique.
    this._id = id;

    // Type de la ressource
    this._type = type;

  }

  /**
  *
  * @function
  * @name get id
  * @description Récupérer l'id du service administré
  *
  */
  get id () {
    return this._id;
  }

  /**
  *
  * @function
  * @name get type
  * @description Récupérer le type du service administré
  *
  */
  get type () {
    return this._type;
  }

}
