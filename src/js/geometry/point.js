'use strict';

const errorManager = require('../utils/errorManager');
const polyline = require('@mapbox/polyline');
const Geometry = require('../geometry/geometry');

/**
*
* @class
* @name Point
* @description Classe modélisant un Point
*
*/

module.exports = class Point extends Geometry {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Point
  * @param {float} x - X
  * @param {float} y - Y
  * @param {string} format - Format de la geom (geojson, polyline)
  * @param {string} projection - Id de la projection utilisée (EPSG:4326)
  *
  */
  constructor(x, y, format, projection) {

    super("point", format, projection);

    // X
    this._x = x;

    // Y
    this._y = y;

  }

  /**
  *
  * @function
  * @name get x
  * @description Récupérer le x du point
  *
  */
  get x () {
    return this._x;
  }

  /**
  *
  * @function
  * @name get y
  * @description Récupérer le y du point
  *
  */
  get y () {
    return this._y;
  }

}
