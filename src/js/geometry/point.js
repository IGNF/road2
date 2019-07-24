'use strict';

const errorManager = require('../utils/errorManager');
const Geometry = require('../geometry/geometry');
const proj4 = require('proj4');

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
  * @param {string} projection - Id de la projection utilisée (ex. "EPSG:4326")
  *
  */
  constructor(x, y, projection) {

    super("point", projection);

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

  /**
  *
  * @function
  * @name transform
  * @description Convertir des coordonnées dans une autre projection
  * @param{string} projection - Projection demandée
  *
  */
  transform (projection) {

    if (this.projection !== projection) {
      return proj4(this.projection, projection, [this._x, this._y]);
    } else {
      return [this._x, this._y];
    }

  }

}
