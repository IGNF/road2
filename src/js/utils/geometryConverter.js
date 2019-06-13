'use strict';

const errorManager = require('./errorManager');
const polyline = require('@mapbox/polyline');

module.exports = {

  /**
  *
  * @function
  * @name convertGeometry
  * @description Convertit une géométrie depuis un format vers un autre
  * @param {Object|string} geom - Géométrie source
  * @param {string} srcType - type de la gémétrie source pour l'instant, dans {geojson, polyline}
  * @param {string} outType - type voulu en sortie pour l'instant, dans {geojson, polyline}
  * @return {Object|string} out_geom - géométrie convertie
  *
  */

  convertGeometry: function(geom, srcType, outType) {
    if (srcType == outType) {
      return geom;
    } else if (srcType == "polyline" && outType == "geojson") {
      return polyline.toGeoJSON(geom);
    } else if (srcType == "geojson" && outType == "polyline") {
      return polyline.fromGeoJSON(geom);
    } else {
      throw errorManager.createError("Unsupported geometry conversion");
    }

  }

}
