'use strict';

const errorManager = require('../utils/errorManager');
const polyline = require('@mapbox/polyline');
const Geometry = require('../geometry/geometry');

/**
*
* @class
* @name Line
* @description Classe modélisant une Line
*
*/

module.exports = class Line extends Geometry {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Line
  * @param {object} geom - Géométrie
  * @param {string} format - Format de la geom (geojson, polyline)
  * @param {string} projection - Id de la projection utilisée (EPSG:4326)
  *
  */
  constructor(geom, format, projection) {

    super("polyline", format, projection);

    // Géométrie de la polyline
    this._geom = geom;

  }

  /**
  *
  * @function
  * @name get geom
  * @description Récupérer le geom de la ligne
  *
  */
  get geom () {
    return this._geom;
  }

  /**
  *
  * @function
  * @name getGeoJSON
  * @description Récupérer la représentation geoJSON de la ligne
  *
  */
  getGeoJSON () {
    return this._convertGeometry(this._geom, this._format, 'geojson');
  }

  /**
  *
  * @function
  * @name getEncodedPolyline
  * @description Récupérer la représentation polyline de la ligne
  *
  */
  getEncodedPolyline () {
    return this._convertGeometry(this._geom, this._format, 'polyline');
  }


  /**
  *
  * @function
  * @name getGeometryWithFormat
  * @description Récupérer la géométrie au format spécifié, pour l'instant, dans {geojson, polyline}
  *
  */
  getGeometryWithFormat (format) {
    return this._convertGeometry(this._geom, this._format, format);
  }

  /**
  *
  * @function
  * @name convertGeometry
  * @description Convertit une géométrie depuis un format vers un autre
  * @param {Object|string} geom - Géométrie source
  * @param {string} srcFormat - type de la gémétrie source pour l'instant, dans {geojson, polyline}
  * @param {string} outFormat - type voulu en sortie pour l'instant, dans {geojson, polyline}
  * @return {Object|string} out_geom - géométrie convertie
  *
  */
  _convertGeometry (geom, srcFormat, outFormat) {
    if (srcFormat == outFormat) {
      return geom;
    } else if (srcFormat == "polyline" && outFormat == "geojson") {
      return polyline.toGeoJSON(geom);
    } else if (srcFormat == "geojson" && outFormat == "polyline") {
      return polyline.fromGeoJSON(geom);
    } else {
      throw errorManager.createError("Unsupported geometry conversion");
    }
  }

}
