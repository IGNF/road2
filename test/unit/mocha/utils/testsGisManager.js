const assert = require('assert');
const gisManager = require('../../../../src/js/utils/gisManager');
const logManager = require('../logManager');

describe('Test du gisManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction arraysEquals()', function() {

    let array1 = ["1","2"];
    let array2 = ["1","3"];

    it('arraysEquals() with the same array', function() {
        assert.deepEqual(gisManager.arraysEquals(array1, array1), true);
    });

    it('arraysEquals() with two differents arrays', function() {
        assert.deepEqual(gisManager.arraysEquals(array1, array2), false);
    });

    it('arraysEquals() with one null', function() {
        assert.deepEqual(gisManager.arraysEquals(array1, null), false);
    });

    it('arraysEquals() with one empty', function() {
        assert.deepEqual(gisManager.arraysEquals(array1, []), false);
    });

  });

  describe('Test de la fonction arraysIntersection()', function() {

    let array1 = [["1","2"],["3","4"]];
    let array2 = [["3","4"],["5","6"]];

    it('arraysIntersection() with two arrays', function() {
        let result = gisManager.arraysIntersection(array1, array2);
        assert.deepEqual(result, [["3","4"]]);
    });

  });

  describe('Test de la fonction geoJsonMultiLineStringCoordsToSingleLineStringCoords()', function() {

    let multiLineString = [[[0, 1], [1, 1]], [[1, 1], [1, 2]]];
    let lineString = [[0, 1], [1, 1], [1, 2]];

    it('geoJsonMultiLineStringCoordsToSingleLineStringCoords() with a simple GeoJson', function() {
        let result = gisManager.geoJsonMultiLineStringCoordsToSingleLineStringCoords(multiLineString);
        assert.deepEqual(result, lineString);
    });

  });

});
