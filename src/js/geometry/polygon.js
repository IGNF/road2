'use strict';

const errorManager = require('../utils/errorManager');
const turf = require('@turf/turf');
const polyline = require('@mapbox/polyline');
const Geometry = require('../geometry/geometry');

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
    // Création d'un objet Polygon depuis les coordonées reçues.
    const polygon = turf.polygon(geom);

    if (srcFormat === outFormat) {
      return geom;
    } else if (srcFormat === "polyline" && outFormat === "geojson") {
      return polyline.toGeoJSON(polygone); // À tester..
    } else if (srcFormat === "geojson" && outFormat === "polyline") {
      let result = [];

      // Conversion du polygone en (Multi)LineString.
      const lines = turf.polygonToLine(polygon.geometry.coordinates);

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
    } else {
      throw errorManager.createError("Unsupported geometry conversion");
    }
  }
}
