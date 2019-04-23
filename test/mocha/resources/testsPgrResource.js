const assert = require('assert');
const PgrResource = require('../../../src/js/resources/pgrResource');
const RouteRequest = require('../../../src/js/requests/routeRequest');
const logManager = require('../logManager');

describe('Test de la classe PgrResource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let resourceConfiguration = {
    "resource": {
    "id": "test-pgr",
    "type": "pgr",
    "description": "Exemple d'une ressource PGR.",
    "topology": {
      "description": "Données pgr",
      "storage": {
        "dbConfig": "/home/docker/app/src/config/dbs/db_config_test.json"
      },
      "projection": "EPSG:4326"
    },
    "sources": [
      {
        "id": "test-car-fastest",
        "type": "pgr",
        "storage": {
          "costColumn": "cost_s_car",
          "rcostColumn": "reverse_cost_s_car"
        },
        "cost": {
          "profile": "car",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/docker/route-graph-generator/io/costs_calculation_sample.json"
            }
          }
        }
      }
    ],
    "availableOperations":[

    ],
    "defaultSourceId": "test-car-fastest",
    "boundingBox": "-90,-180,90,180",
    "defaultProjection": "EPSG:4326",
    "availableProjections": ["EPSG:4326","EPSG:2154"]
    }
  };

  let resource = new PgrResource(resourceConfiguration);

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

    it('Get DefaultProfile', function() {
      assert.equal(resource.defaultProfile, "car");
    });

    it('Get DefaultOptimization', function() {
      assert.equal(resource.defaultOptimization, "fastest");
    });

    it('Get DefaultSourceId', function() {
      assert.equal(resource.defaultSourceId, "test-car-fastest");
    });

    it('Get LinkedSource', function() {
      let reference = {};
      reference["carfastest"] = "test-car-fastest";
      assert.deepEqual(resource.linkedSource, reference);
    });

  });

  describe('Test du constructeur et des getters', function() {

    let request = new RouteRequest("resource-id", {lon: 8.732901, lat: 41.928821}, {lon: 8.732901, lat: 41.953932}, "car", "fastest");

    it('getSourceIdFromRequest()', function() {
      assert.equal(resource.getSourceIdFromRequest(request), "test-car-fastest");
    });

  });

});
