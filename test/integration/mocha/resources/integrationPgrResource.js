const assert = require('assert');
const PgrResource = require('../../../../src/js/resources/pgrResource');
const logManager = require('../logManager');

const sinon = require('sinon');

describe('Test de la classe PgrResource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let sourceConfiguration = {
    "id": "test-car-fastest",
    "type": "pgr",
    "description": "Source pgr de test",
    "projection": "EPSG:4326",
    "bbox": "-180,-90,180,90",
    "storage": {
      "base": {
        "dbConfig": "./dbs/db_config_test.json"
      },
      "costColumn": "cost_s_car",
      "rcostColumn": "reverse_cost_s_car"
    },
    "costs": [
      {
        "profile": "car",
        "optimization": "fastest",
        "costType": "time"
      }
    ]
  };

  // la ressource délègue la récupération des sources au sourceManager
  let sourceManager = {
    isLoadedSourceAvailable: sinon.stub().returns(true),
    getSourceById: sinon.stub().returns({ type: "pgr", configuration: sourceConfiguration })
  };

  let resourceConfiguration = {
    "resource": {
      "id": "test-pgr",
      "resourceVersion": "1.0.0",
      "type": "pgr",
      "description": "Exemple d'une ressource PGR.",
      "sources": [
        "test-car-fastest"
      ],
      "availableOperations": []
    }
  };

  let operations = {};

  let resource = new PgrResource(resourceConfiguration, operations);

  describe('Test du constructeur et des getters', function() {

    it('Get Id', function() {
      assert.equal(resource.id, "test-pgr");
    });

    it('Get Type', function() {
      assert.equal(resource.type, "pgr");
    });

    it('Get Configuration', function() {
      assert.deepEqual(resource.configuration, resourceConfiguration.resource);
    });

  });

  describe('Test de initResource()', function() {

    it('initResource()', function() {
      assert.equal(resource.initResource(sourceManager), true);
      let reference = {};
      reference["carfastest"] = "test-car-fastest";
      reference["cartime"] = "test-car-fastest";
      assert.deepEqual(resource._linkedSource, reference);
    });

  });

  describe('Test de getSourceIdFromRequest()', function() {

    it('getSourceIdFromRequest() avec une requete route', function() {
      let request = { operation: "route", profile: "car", optimization: "fastest" };
      assert.equal(resource.getSourceIdFromRequest(request), "test-car-fastest");
    });

    it('getSourceIdFromRequest() avec une operation inconnue', function() {
      let request = { operation: "inconnue", profile: "car", optimization: "fastest" };
      assert.equal(resource.getSourceIdFromRequest(request), null);
    });

  });

});
