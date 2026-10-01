const assert = require('assert');
const ValhallaResource = require('../../../../src/js/resources/valhallaResource');
const logManager = require('../logManager');

const sinon = require('sinon');

describe('Test de la classe ValhallaResource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let sourceConfiguration = {
    "id": "corse-auto-valhalla",
    "type": "valhalla",
    "description": "Source valhalla de la Corse",
    "projection": "EPSG:4326",
    "bbox": "-180,-90,180,90",
    "storage": {
      "tar": "/home/docker/data/corse-latest-valhalla-tiles.tar",
      "dir": "/home/docker/data/corse-latest-valhalla-tiles/",
      "config": "/home/docker/data/valhalla.json"
    },
    "costs": [
      {
        "profile": "car",
        "optimization": "fastest",
        "costType": "time",
        "costing": "auto"
      }
    ]
  };

  // la ressource délègue la récupération des sources au sourceManager
  let sourceManager = {
    isLoadedSourceAvailable: sinon.stub().returns(true),
    getSourceById: sinon.stub().returns({ type: "valhalla", configuration: sourceConfiguration })
  };

  let resourceConfiguration = {
    "resource": {
      "id": "test-valhalla",
      "resourceVersion": "1.0.0",
      "type": "valhalla",
      "description": "Exemple d'une ressource Valhalla",
      "sources": [
        "corse-auto-valhalla"
      ],
      "availableOperations": []
    }
  };

  let resource = new ValhallaResource(resourceConfiguration, {});

  describe('Test du constructeur et des getters', function() {

    it('Get Id', function() {
      assert.equal(resource.id, "test-valhalla");
    });

    it('Get Type', function() {
      assert.equal(resource.type, "valhalla");
    });

    it('Get Configuration', function() {
      assert.deepEqual(resource.configuration, resourceConfiguration.resource);
    });

    it('Get waysAttributes', function() {
      assert.deepEqual(resource.waysAttributes, ["name"]);
    });

  });

  describe('Test de initResource()', function() {

    it('initResource()', function() {
      assert.equal(resource.initResource(sourceManager), true);
      let reference = {};
      reference["carfastest"] = "corse-auto-valhalla";
      reference["cartime"] = "corse-auto-valhalla";
      assert.deepEqual(resource._linkedSource, reference);
    });

  });

  describe('Test de getSourceIdFromRequest', function() {

    it('getSourceIdFromRequest() avec une requete route', function() {
      let request = { operation: "route", profile: "car", optimization: "fastest" };
      assert.equal(resource.getSourceIdFromRequest(request), "corse-auto-valhalla");
    });

    it('getSourceIdFromRequest() avec une requete isochrone', function() {
      let request = { operation: "isochrone", profile: "car", costType: "time" };
      assert.equal(resource.getSourceIdFromRequest(request), "corse-auto-valhalla");
    });

    it('getSourceIdFromRequest() avec une operation inconnue', function() {
      let request = { operation: "inconnue", profile: "car", optimization: "fastest" };
      assert.equal(resource.getSourceIdFromRequest(request), null);
    });

  });

});
