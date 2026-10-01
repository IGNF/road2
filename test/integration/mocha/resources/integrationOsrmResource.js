const assert = require('assert');
const OsrmResource = require('../../../../src/js/resources/osrmResource');
const logManager = require('../logManager');

const sinon = require('sinon');

describe('Test de la classe OsrmResource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let sourceConfiguration = {
    "id": "corse-car-fastest",
    "type": "osrm",
    "description": "Source osrm de la Corse",
    "projection": "EPSG:4326",
    "bbox": "-180,-90,180,90",
    "storage": {
      "file": "/home/docker/data/corse-latest.osrm"
    },
    "cost": {
      "profile": "car",
      "optimization": "fastest"
    }
  };

  // la ressource délègue la récupération des sources au sourceManager
  let sourceManager = {
    isLoadedSourceAvailable: sinon.stub().returns(true),
    getSourceById: sinon.stub().returns({ type: "osrm", configuration: sourceConfiguration })
  };

  let resourceConfiguration = {
    "resource": {
      "id": "corse-osm",
      "resourceVersion": "1.0.0",
      "type": "osrm",
      "description": "Exemple d'une ressource sur la Corse avec les données OSM.",
      "sources": [
        "corse-car-fastest"
      ],
      "availableOperations": []
    }
  };

  let resource = new OsrmResource(resourceConfiguration, {});

  describe('Test du constructeur et des getters', function() {

    it('Get Id', function() {
      assert.equal(resource.id, "corse-osm");
    });

    it('Get Type', function() {
      assert.equal(resource.type, "osrm");
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
      reference["carfastest"] = "corse-car-fastest";
      assert.deepEqual(resource._linkedSource, reference);
    });

  });

  describe('Test de getSourceIdFromRequest', function() {

    it('getSourceIdFromRequest() avec une requete route', function() {
      let request = { operation: "route", profile: "car", optimization: "fastest" };
      assert.equal(resource.getSourceIdFromRequest(request), "corse-car-fastest");
    });

    it('getSourceIdFromRequest() avec une requete nearest', function() {
      let request = { operation: "nearest" };
      assert.equal(resource.getSourceIdFromRequest(request), "corse-car-fastest");
    });

    it('getSourceIdFromRequest() avec un couple profile/optimization inconnu', function() {
      let request = { operation: "route", profile: "pedestrian", optimization: "shortest" };
      assert.equal(resource.getSourceIdFromRequest(request), null);
    });

  });

});
