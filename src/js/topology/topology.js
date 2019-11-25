'use strict';

/**
*
* @class
* @name Topology
* @description Classe modélisant une topologie.
*
*/
module.exports = class Topology {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Topology
  * @param{string} id - Id de la topologie
  * @param{string} type - Type de la topologie
  * @param{string} description - Description de la topologie
  * @param{string} projection - Projection de la topologie
  * @param{string} bbox - Bbox de la topologie
  *
  */
  constructor(id, type, description, projection, bbox) {

    // ID de la topologie
    this._id = id;

    // type
    this._type = type;

    // Description
    this._description = description;

    // Projection
    this._projection = projection;

    // Bbox
    this._bbox = bbox;

  }

  /**
  *
  * @function
  * @name get id
  * @description Récupérer l'id
  *
  */
  get id () {
    return this._id;
  }

  /**
  *
  * @function
  * @name get type
  * @description Récupérer le type
  *
  */
  get type () {
    return this._type;
  }

  /**
  *
  * @function
  * @name get description
  * @description Récupérer la description
  *
  */
  get description () {
    return this._description;
  }

    /**
  *
  * @function
  * @name get projection
  * @description Récupérer la projection
  *
  */
  get projection () {
    return this._projection;
  }

  /**
  *
  * @function
  * @name get bbox
  * @description Récupérer la bbox
  *
  */
  get bbox () {
    return this._bbox;
  }


}
