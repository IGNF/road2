'use strict';

const errorManager = require('../utils/errorManager');
const polyline = require('@mapbox/polyline');
const Geometry = require('../geometry/geometry');
const proj4 = require('proj4');
const assert = require('assert');

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

    super("polyline", projection);

    // Géométrie de la polyline
    this._geom = geom;

    // Format de géométrie (geojson, polyline...)
    this._format = format;

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
    if (srcFormat === outFormat) {
      return geom;
    } else if (srcFormat === "polyline" && outFormat === "geojson") {
      return polyline.toGeoJSON(geom);
    } else if (srcFormat === "geojson" && outFormat === "polyline") {
      return polyline.fromGeoJSON(geom);
    } else {
      throw errorManager.createError("Unsupported geometry conversion");
    }
  }

  /**
  *
  * @function
  * @name transform
  * @description Reprojeter une ligne
  * @param{string} projection - Projection demandée
  *
  */
  transform (projection) {

    if (this.projection !== projection) {

      let tmpGeom = this.getLineIn(projection, this._format);

      try {

        assert.deepStrictEqual(tmpGeom, {});
        return false;

      } catch (err) {

        this._geom = tmpGeom;
        this.projection = projection;
        
        return true;

      }
      
    } else {
      // il n'y a rien à faire
      return true;
    }

  }

    /**
  *
  * @function
  * @name getLineIn
  * @description Récupérer une ligne dans une autre projection sans modifier l'objet
  * @param{string} projection - Projection demandée
  * @param{string} format - Format demandé
  *
  */
  getLineIn (projection, format) {

    let geojson = this.getGeoJSON();

    // vérifications sur le geojson à reprojeter
    if (!geojson.coordinates) {
      return {};
    }
    if (!Array.isArray(geojson.coordinates)) {
      return {};
    }
    if (geojson.coordinates.length === 0) {
      return {};
    }

    // reprojection 
    let reprojectedCoordinates = new Array();

    for (let i = 0; i < geojson.coordinates.length; i++) {

      let reprojectedPoint =  proj4(this.projection, projection, [geojson.coordinates[i][0], geojson.coordinates[i][1]]);

      if (!Array.isArray(reprojectedPoint)) {
        return {};
      }
      if (reprojectedPoint.length !== 2) {
        return {};
      }

      reprojectedCoordinates.push([reprojectedPoint[0], reprojectedPoint[1]]);

    }

    let reprojectedGeoJson = {};
    reprojectedGeoJson.coordinates = reprojectedCoordinates;
    reprojectedGeoJson.type = "LineString";

    return this._convertGeometry(reprojectedGeoJson, "geojson", format);

  }

}
