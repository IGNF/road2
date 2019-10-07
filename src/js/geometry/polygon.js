'use strict';

const errorManager = require('../utils/errorManager');
const polygon = require('@turf/helpers');
const Geometry = require('../geometry/geometry');
const proj4 = require('proj4');

/**
*
* @class
* @name Polygon
* @description Classe modélisant un polygone.
*
*/
module.exports = class Polygon extends Geometry {
  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Polygon.
  * @param {object} geom - Géométrie du polygone.
  * @param {string} format - Format de la géométrie.
  * @param {string} projection - Identifiant de la projection utilisée (e.g. "EPSG:4326").
  *
  */
  constructor (geom, format, projection) {
    super("Polygone", projection);

    this._geom = geom;

    this._format = format;
  }

  /**
  *
  * @function
  * @name get geom
  * @description Récupérer la géométrie du polygone.
  *
  */
  get geom () {
    return this._geom;
  }

  /**
  *
  * @function
  * @name getGeomInFormat
  * @description Retourner la géométrie du polygone dans un certain format.
  * @param dstFormat - Format souhaité.
  *
  */
  getGeomInFormat (dstFormat) {
    const geom = this._geom;
    const srcFormat = this._format;

    if (srcFormat === dstFormat) {
      return geom;
    } else if (outFormat == "geojson") {
      return polygon(this._geom);
    } else {
      throw errorManager.createError("Conversion failed (unsupported format).");
    }
  }
}
