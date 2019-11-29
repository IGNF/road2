const assert = require('assert');
const TopologyManager = require('../../../../src/js/topology/topologyManager');
const BaseManager = require('../../../../src/js/base/baseManager');
const ProjectionManager = require('../../../../src/js/geography/projectionManager');
const OsmTopology = require('../../../../src/js/topology/osmTopology');
const logManager = require('../logManager');
const fs = require('fs');

describe('Test de la classe TopologyManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let baseManager = new BaseManager();
  let projectionManager = new ProjectionManager();
  projectionManager.loadProjectionDirectory("/home/docker/app/test/integration/mocha/config/projections");

  let topologyManager = new TopologyManager(baseManager, projectionManager);

  describe('Test du checkTopology()', function() {

    it('checkTopology() avec une topologie OSM correcte', function() {
      let correctOSMTopology = JSON.parse(fs.readFileSync("/home/docker/app/test/integration/resources/topology/correctOSMTopology.json"));
      assert.equal(topologyManager.checkTopology(correctOSMTopology), true);
    });

    it('checkTopology() avec une topologie OSM incorrecte', function() {
      let incorrectOSMTopology = JSON.parse(fs.readFileSync("/home/docker/app/test/integration/resources/topology/incorrectOSMTopology.json"));
      assert.equal(topologyManager.checkTopology(incorrectOSMTopology), false);
    });

    it('checkTopology() avec une topologie DB correcte', function() {
      let correctDBTopology = JSON.parse(fs.readFileSync("/home/docker/app/test/integration/resources/topology/correctDBTopology.json"));
      assert.equal(topologyManager.checkTopology(correctDBTopology), true);
    });

    it('checkTopology() avec une topologie DB incorrecte', function() {
      let incorrectDBTopology = JSON.parse(fs.readFileSync("/home/docker/app/test/integration/resources/topology/incorrectDBTopology.json"));
      assert.equal(topologyManager.checkTopology(incorrectDBTopology), false);
    });

  });

  describe('Test du checkDuplicationTopology()', function() {

    let correctOSMTopology = JSON.parse(fs.readFileSync("/home/docker/app/test/integration/resources/topology/correctOSMTopology.json"));

    it('checkDuplicationTopology() avec une topologie deja verifiee et identique', function() {
      assert.equal(topologyManager.checkDuplicationTopology(correctOSMTopology), true);
    });

    it('checkDuplicationTopology() avec une topologie deja verifiee mais non identique', function() {
      correctOSMTopology.description = "test";
      assert.equal(topologyManager.checkDuplicationTopology(correctOSMTopology), false);
    });

  });

  describe('Test du createTopology()', function() {

    let correctOSMTopology = JSON.parse(fs.readFileSync("/home/docker/app/test/integration/resources/topology/correctOSMTopology.json"));
    let referenceTopology = new OsmTopology(correctOSMTopology.id, correctOSMTopology.description,
      correctOSMTopology.projection, correctOSMTopology.bbox, correctOSMTopology.storage.file);
    
    it('createTopology() avec une topologie deja verifiee', function() {
      assert.deepEqual(topologyManager.createTopology(correctOSMTopology), referenceTopology);
    });

  });

  describe('Test du loadAllTopologies()', function() {

    it('loadAllTopologies()', function() {
      assert.deepEqual(topologyManager.loadAllTopologies(), true);
    });

    it('loadAllTopologies() pour un manager vide', function() {
      let emptyTopologyManager = new TopologyManager(baseManager, projectionManager);
      assert.deepEqual(emptyTopologyManager.loadAllTopologies(), false);
    });


  });

})