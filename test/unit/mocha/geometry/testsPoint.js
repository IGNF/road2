const assert = require('assert');
const Point = require('../../../../src/js/geometry/point');
const proj4 = require('proj4');
const logManager = require('../logManager');

describe('Test de la classe Point', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let point = new Point(2, 48, "EPSG:4326");

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(point.type, "point");
    });

    it('Get projection', function() {
      assert.equal(point.projection, "EPSG:4326");
    });

    it('Get X', function() {
      assert.equal(point.x, 2);
    });

    it('Get Y', function() {
      assert.equal(point.y, 48);
    });

  });

  describe('Ecriture', function() {

    it('toString()', function() {
      assert.equal(point.toString(), "2,48");
    });

  });

  describe('Transformation', function() {

    proj4.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    let refCoord = [ 625422.4046271729, 6767095.930771305 ];

    it('getCoordinatesIn()', function() {
      assert.deepEqual(point.getCoordinatesIn("EPSG:2154"), refCoord);
    });

    it('transform()', function() {
      assert.equal(point.transform("EPSG:2154"), true);
    });

  });

});
