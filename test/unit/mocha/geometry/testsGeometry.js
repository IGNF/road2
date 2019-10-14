const assert = require('assert');
const Geometry = require('../../../../src/js/geometry/geometry');
const logManager = require('../logManager');

describe('Test de la classe Geometry', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let geometry = new Geometry("point", "EPSG:4326");

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(geometry.type, "point");
    });

    it('Get projection', function() {
      assert.equal(geometry.projection, "EPSG:4326");
    });

    it('Set projection', function() {
      geometry.projection = "EPSG:2154";
      assert.equal(geometry.projection, "EPSG:2154");
    });

  });

});
