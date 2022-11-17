const assert = require('assert');
const Topology = require('../../../../src/js/topology/topology');
const logManager = require('../logManager');

describe('Test de la classe Topology', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let configuration = {
      "id": "corse-osm",
      "type": "osm",
      "description": "Corse en version OSM",
      "projection": "EPSG:4326",
      "bbox": "-180,-90,180,90"
    };


  describe('Test du constructeur et des getters', function() {

    let topology = new Topology(configuration.id, configuration.type, configuration.description, configuration.projection, configuration.bbox);

    it('Get Id', function() {
      assert.equal(topology.id, configuration.id);
    });

    it('Get Type', function() {
        assert.equal(topology.type, configuration.type);
    });

    it('Get Description', function() {
        assert.equal(topology.description, configuration.description);
    });

    it('Get Projection', function() {
        assert.equal(topology.projection, configuration.projection);
    });

    it('Get Bbox', function() {
        assert.equal(topology.bbox, configuration.bbox);
    });

  });

});
