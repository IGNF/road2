'use strict';

/**
*
* @function
* @name arraysEquals
* @description Détermine si 2 array sont égaux
* @param {Array} arr1 - array
* @param {Array} arr2 - array
* @return {boolean} - true si les array sont égaux, false sinon
*
*/
function arraysEquals(arr1, arr2) {
  if (arr1 === arr2) return true;
  if (arr1 == null || arr2 == null) return false;
  if (arr1.length != arr2.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

/**
*
* @function
* @name arrays_intersection
* @description Retourne l'intersection entre 2 arrays d'arrays
* @param {Array} arr1 - array
* @param {Array} arr2 - array
* @return {Array} - intersection entre les arrays
*
*/
function arrays_intersection(arr1, arr2) {
  const result = [];
  for (let arr_a of arr1) {
    for (let arr_b of arr2) {
      if (arraysEquals(arr_a, arr_b)) {
        result.push(arr_a);
      }
    }
  }
  return result;
}





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

    if (srcCoords.length === 0) {
      return [];
    }

    // Transformation des coordonnées en mode MultiLineString vers LineString
    const dissolvedCoords = [];
    const firstLine = srcCoords[0];
    const secondLine = srcCoords[1];

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
