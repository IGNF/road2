const assert = require('assert');
const PgrResource = require('../../../../src/js/resources/pgrResource');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
const logManager = require('../logManager');

const sinon = require('sinon');

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
          "dbConfig": "/home/docker/app/src/config/dbs/db_config_test.json",
          "costColumn": "cost_s_car",
          "rcostColumn": "reverse_cost_s_car"
        },
        "cost": {
          "profile": "car",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/docker/route-graph-generator/configuration/costs_calculation_sample.json"
            }
          }
        }
      }
    ],
    "availableOperations":[

    ],
    "defaultSourceId": "test-car-fastest",
    "boundingBox": "-180,-90,180,90",
    "defaultProjection": "EPSG:4326",
    "availableProjections": ["EPSG:4326","EPSG:2154"]
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

    it('Get LinkedSource', function() {
      let reference = {};
      reference["carfastest"] = "test-car-fastest";
      assert.deepEqual(resource.linkedSource, reference);
    });

  });

  describe('Test du constructeur et des getters', function() {

    // Pour ne pas dépendre de la classe RouteRequest
    let request = sinon.mock(RouteRequest);
    request.profile = "car";
    request.optimization = "fastest";

    it('getSourceIdFromRequest()', function() {
      assert.equal(resource.getSourceIdFromRequest(request), "test-car-fastest");
    });

  });

});
