const assert = require('assert');
const Line = require('../../../../src/js/geometry/line');
const proj4 = require('proj4');
const logManager = require('../../../unit/mocha/logManager');

describe('Test de la classe Line', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let refPolyline = "kba_G{ont@QIQIGQA]DUH[Lk@";

  let refGeojson = { type: 'LineString',
      coordinates:
       [ [ 8.76302, 41.95382 ],
         [ 8.76307, 41.95391 ],
         [ 8.76312, 41.954 ],
         [ 8.76321, 41.95404 ],
         [ 8.76336, 41.95405 ],
         [ 8.76347, 41.95402 ],
         [ 8.76361, 41.95397 ],
         [ 8.76383, 41.9539 ] ] };

  let line = new Line(refPolyline, "polyline", "EPSG:4326");

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(line.type, "polyline");
    });

    it('Get projection', function() {
      assert.equal(line.projection, "EPSG:4326");
    });

    it('Get geom', function() {
      assert.equal(line.geom, "kba_G{ont@QIQIGQA]DUH[Lk@");
    });

  });

  describe('Changement de format', function() {

    it('getGeoJSON()', function() {
      assert.deepEqual(line.getGeoJSON(), refGeojson);
    });

    it('getEncodedPolyline()', function() {
      assert.deepEqual(line.getEncodedPolyline(), refPolyline);
    });

    it('getGeometryWithFormat()', function() {
      assert.deepEqual(line.getGeometryWithFormat("geojson"), refGeojson);
    });

  });

  describe('Reprojection des geometries', function() {

    it('transform()', function() {
      proj4.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
      assert.deepEqual(line.transform("EPSG:2154"), true);
    });

  });

});
