'use strict';

const errorManager = require('../utils/errorManager');
const polyline = require('@mapbox/polyline');

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
  constructor(type, format, projection) {

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
  * @name get format
  * @description Récupérer le format de la geom
  *
  */
  get format () {
    return this._format;
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

}
