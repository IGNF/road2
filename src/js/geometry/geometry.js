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
  * @param {Object|string} srcGeom - Objet source de la géometrie
  * @param {string} type - type de la geom (Point, LineString...)
  * @param {string} format - Format de la geom (geojson, polyline)
  *
  */
  constructor(srcGeom, type, format) {
    // source de la géométrie (représentation geojson, polyline)
    this._srcGeom = srcGeom;
    // Type de géométrie (Point, LineString, Polygon...)
    this._type = type;
    // Format de géométrie (geojson, polyline...)
    this._format = format;
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
  * @name get srcGeom
  * @description Récupérer la représentation initiale de la geom
  *
  */
  get srcGeom () {
    return this._srcGeom;
  }


  /**
  *
  * @function
  * @name getGeoJSON
  * @description Récupérer la représentation geoJSON de la geom
  *
  */
  getGeoJSON () {
    return this._convertGeometry(this._srcGeom, this._format, 'geojson');
  }

  /**
  *
  * @function
  * @name getEncodedPolyline
  * @description Récupérer la représentation polyline de la geom
  *
  */
  getEncodedPolyline () {
    return this._convertGeometry(this._srcGeom, this._format, 'polyline');
  }


  /**
  *
  * @function
  * @name getGeometryWithFormat
  * @description Récupérer la géométrie au format spécifié, pour l'instant, dans {geojson, polyline}
  *
  */
  getGeometryWithFormat (format) {
    return this._convertGeometry(this._srcGeom, this._format, format);
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
