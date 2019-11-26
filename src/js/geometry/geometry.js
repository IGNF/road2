'use strict';

/**
*
* @class
* @name Geometry
* @description Classe modélisant une géométrie
*
*/

module.exports = class Geometry {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Geometry
  * @param {string} type - type de la geom (Point, LineString...)
  * @param {string} projection - Id de la projection utilisée (EPSG:4326)
  *
  */
  constructor(type, projection) {

    // Type de géométrie (Point, LineString, Polygon...)
    this._type = type;

    // Id de la projection utilisée (EPSG:4326)
    this._projection = projection;
  }

  /**
  *
  * @function
  * @name get type
  * @description Récupérer le type de la geom
  *
  */
  get type () {
    return this._type;
  }

  /**
  *
  * @function
  * @name get projection
  * @description Récupérer la projection de la geom
  *
  */
  get projection () {
    return this._projection;
  }

    /**
  *
  * @function
  * @name set projection
  * @description Attribuer la projection de la geom
  * @param{string} projection - Projection
  *
  */
   set projection (pr) {
    this._projection = pr;
  }

}
