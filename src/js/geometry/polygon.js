'use strict';

const errorManager = require('../utils/errorManager');
const turf = require('@turf/turf');
const polyline = require('@mapbox/polyline');
const wkt = require('./formats/wkt');
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
    super("polygon", projection);

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
  * @name _convertGeometry
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
      return this._polyline2GeoJson(geom);
    } else if (srcFormat === "geojson" && outFormat === "polyline") {
      return this._geoJson2Polyline(geom);
    } else if (srcFormat === "wkt" && outFormat === "geojson") {
      return wkt.toGeoJSON(geom);
    } else if (srcFormat === "geojson" && outFormat === "wkt") {
      return wkt.fromGeoJSON(geom);
    } else if (srcFormat === "polyline" && outFormat === "wkt") {
      return wkt.fromGeoJSON(this.__polyline2GeoJson(geom));
    } else if (srcFormat === "wkt" && outFormat === "polyline") {
      return this._geoJson2Polyline(wkt.toGeoJSON(geom));
    } else {
      //TODO: voir si on peut remplacer ce throw par un return {}
      throw errorManager.createError("Unsupported geometry conversion");
    }

  }

  /**
  *
  * @function
  * @name _polyline2GeoJson
  * @description Convertit une géométrie GeoJSON vers Polyline
  * @param {Object|string} geom - Géométrie source
  * @return {Object|string} out_geom - géométrie convertie
  *
  */
  _polyline2GeoJson (geom) {

    let tmpGeoJSON = polyline.toGeoJSON(geom);
    tmpGeoJSON.type = "Polygon";
    return tmpGeoJSON;

  }


  /**
  *
  * @function
  * @name _geoJson2Polyline
  * @description Convertit une géométrie GeoJSON vers Polyline
  * @param {Object|string} geom - Géométrie source
  * @return {Object|string} out_geom - géométrie convertie
  *
  */
  _geoJson2Polyline (geom) {

    let result = [];

      if (geom.type === "Point") {
        // Cas où l'isochrone est un simple point
        result = polyline.encode([geom.coordinates]);
        return result
      } else if (geom.type === "LineString") {
        // Cas où l'isochrone est une line
        result = polyline.encode(geom.coordinates);
        return result
      } else {

        // Conversion du polygone en (Multi)LineString.
        let polygon = turf.polygon(geom.coordinates);
        const lines = turf.polygonToLine(polygon);

        if (lines.geometry.type === "LineString") {
          // Une seule ligne, nous convertissons donc directement.
          result = polyline.fromGeoJSON(lines);
        } else if (lines.geometry.type === "MultiLineString") {
          // Plusieurs lignes, convertion ligne par ligne.
          lines.geometry.coordinates.forEach( function(element) {
            result.push(polyline.fromGeoJSON({
              "type": "LineString",
              "coordinates": element
            }));
          });
        }

        return result;

      }

  }


  /**
  *
  * @function
  * @name transform
  * @description Reprojeter un polygon
  * @param{string} projection - Projection demandée
  *
  */
  transform (projection) {

    if (projection === this._projection) {
      return true;
    }

    let geojson = this._convertGeometry(this._geom, this._format, 'geojson');

    // vérifications sur le geojson à reprojeter
    if (!geojson.coordinates) {
      return false;
    }
    if (!Array.isArray(geojson.coordinates)) {
      return false;
    }
    if (geojson.coordinates.length === 0) {
      return false;
    }

    for (let g = 0; g < geojson.coordinates.length; g++) {

      if (!geojson.coordinates[g]) {
        return false;
      }
      if (!Array.isArray(geojson.coordinates[g])) {
        return false;
      }
      if (geojson.coordinates[g].length === 0) {
        return false;
      }

      for (let c = 0; c < geojson.coordinates[g].length; c++) {

        if (!geojson.coordinates[g][c]) {
          return false;
        }
        if (!Array.isArray(geojson.coordinates[g][c])) {
          return false;
        }
        if (geojson.coordinates[g][c].length < 2) {
          return false;
        }

      }

    }

    // Reprojection
    for (let g = 0; g < geojson.coordinates.length; g++) {

      for (let c = 0; c < geojson.coordinates[g].length; c++) {

        let reprojectedPoint = proj4(super.projection, projection, [geojson.coordinates[g][c][0], geojson.coordinates[g][c][1]]);
        
        if (!Array.isArray(reprojectedPoint)) {
          return false;
        }
        if (reprojectedPoint.length !== 2) {
          return false;
        }

        geojson.coordinates[g][c][0] = reprojectedPoint[0];
        geojson.coordinates[g][c][1] = reprojectedPoint[1];

      }

    }

    this._geom = this._convertGeometry(geojson, 'geojson', this._format);
    super.projection = projection;

    return true;

  }

}
