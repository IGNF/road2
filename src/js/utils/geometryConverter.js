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
  * @param {string} src_type - type de la gémétrie source pour l'instant, dans {geojson, polyline}
  * @param {string} out_type - type voulu en sortie pour l'instant, dans {geojson, polyline}
  * @return {Object|string} out_geom - géométrie convertie
  *
  */

  convertGeometry: function(geom, src_type, out_type) {
    if (src_type === out_type) {
      return geom;
    } else if (src_type === "polyline" && out_type === "geojson") {
      return polyline.toGeoJSON(geom);
    } else if (src_type === "polyline" && out_type === "geojson") {
      return polyline.fromGeoJSON(geom);
    } else {
      throw errorManager.createError("Unsupported geometry conversion");
    }

  }

}
