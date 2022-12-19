'use strict';

const errorManager = require('../utils/errorManager');
const polyline = require('@mapbox/polyline');
const wkt = require('./formats/wkt');
const Geometry = require('./geometry');
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
  * @param {integer} polylinePrecision - Précision de l'encodage en polyline en entrée (défaut : 5)
  *
  */
  constructor(geom, format, projection, polylinePrecision = 5) {

    super("line", projection);

    // Géométrie de la polyline
    this._geom = geom;

    // Format de géométrie (geojson, polyline...)
    this._format = format;

    if (polylinePrecision != 5 && this._format === "polyline") {
      this._geom = polyline.encode(polyline.decode(geom, polylinePrecision));
    }

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
  * @param {string} srcFormat - type de la gémétrie source pour l'instant, dans {geojson, polyline,wkt}
  * @param {string} outFormat - type voulu en sortie pour l'instant, dans {geojson, polyline,wkt}
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
    } else if (srcFormat === "wkt" && outFormat === "geojson") {
      return wkt.toGeoJSON(geom);
    } else if (srcFormat === "geojson" && outFormat === "wkt") {
      return wkt.fromGeoJSON(geom);
    } else if (srcFormat === "polyline" && outFormat === "wkt") {
      return wkt.fromGeoJSON(polyline.toGeoJSON(geom));
    } else if (srcFormat === "wkt" && outFormat === "polyline") {
      return polyline.fromGeoJSON(wkt.toGeoJSON(geom));
    } else {
      //TODO: voir si on peut remplacer ce throw par un return {}
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

    if (super.projection !== projection) {

      let tmpGeom = this.getLineIn(projection, this._format);

      try {

        assert.deepStrictEqual(tmpGeom, {});
        return false;

      } catch (err) {

        this._geom = tmpGeom;
        super.projection = projection;

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

    let geojson = this._convertGeometry(this._geom, this._format, 'geojson');

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

      let reprojectedPoint =  proj4(super.projection, projection, [geojson.coordinates[i][0], geojson.coordinates[i][1]]);

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
