'use strict';

module.exports = {

  /**
  *
  * @function
  * @name geoJsonMultiLineStringCoordsToSingleLineStringCoords
  * @description Convertit une mutlilinetring geojson dont les segments se touchent en linestring
  * @param {Object} srcCoords - coordonnées en entrée (de multilinestring) [[[0, 1], [1, 1]], [[1, 1], [1, 2]]]
  * @return {Object} - coordonnées en sortie (de linestring) [[0, 1], [1, 1], [1, 2]]
  *
  */

 geoJsonMultiLineStringCoordsToSingleLineStringCoords: function(srcCoords) {

    // Transformation des coordonnées en mode MultiLineString vers LineString
    const dissolvedCoords = [];
    const firstLine = srcCoords[0];
    const secondLine = srcCoords[1];

    // Pour tester l'égalité entre couple de coordonnées
    function arraysEquals(a, b) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length != b.length) return false;

      // If you don't care about the order of the elements inside
      // the array, you should sort both arrays here.
      // Please note that calling sort on an array will modify that array.
      // you might want to clone your array first.

      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    // Pour tester l'intersection entre 2 suites de paires de coordonnées
    function arrays_intersection(a, b) {
      const result = [];
      for (let arr_a of a) {
        for (let arr_b of b) {
          if (arraysEquals(arr_a, arr_b)) {
            result.push(arr_a);
          }
        }
      }
      return result;
    }

    const common_point = arrays_intersection(firstLine, secondLine)[0];

    if (firstLine.indexOf(common_point) == 0) {
      firstLine.reverse();
    }
    dissolvedCoords.push(...firstLine);

    for (let i = 1; i < srcCoords.length; i++) {
      let curr_line = srcCoords[i];
      if (!arraysEquals(dissolvedCoords[dissolvedCoords.length - 1 ], curr_line[0])) {
        curr_line.reverse();
      }
      curr_line.splice(0, 1);
      dissolvedCoords.push(...curr_line);
    }

    return dissolvedCoords;
  }

}
