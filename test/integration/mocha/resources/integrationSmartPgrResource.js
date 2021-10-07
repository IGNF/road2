const assert = require('assert');
const SmartpgrResource = require('../../../../src/js/resources/smartpgrResource');
const IsochroneRequest = require('../../../../src/js/requests/isochroneRequest');
const logManager = require('../logManager');

const sinon = require('sinon');

describe('Test de la classe SmartpgrResource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let resourceConfiguration = {
    "resource": {
    "id": "test-smartpgr",
    "type": "smartpgr",
    "threshold" : 30000,
    "description": "Exemple d'une ressource SMARTPGR.",
    "topology": {
      "description": "Données pgr",
      "storage": {
        "dbConfig": "/home/docker/app/src/config/dbs/db_config_test.json"
      },
      "projection": "EPSG:4326"
    },
    "sources": [
      {
        "id": "test-smartrouting",
        "type": "smartrouting",
        "storage": {
          "url" : "https://wxs.ign.fr/calcul"
        }
      },
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
    "boundingBox": "-90,-180,90,180",
    "defaultProjection": "EPSG:4326",
    "availableProjections": ["EPSG:4326","EPSG:2154"]
    }
  };

  let operations = {isochrone:{}};

  let resource = new SmartpgrResource(resourceConfiguration, operations);

  describe('Test du constructeur et des getters', function() {

    it('Get Id', function() {
      assert.equal(resource.id, "test-smartpgr");
    });

    it('Get Type', function() {
      assert.equal(resource.type, "smartpgr");
    });

    it('Get Configuration', function() {
      assert.deepEqual(resource.configuration, resourceConfiguration.resource);
    });

    it('Get LinkedSource', function() {
      let reference = {};
      reference["cartime"] = "test-car-fastest";
      reference["smartrouting"] = "test-smartrouting";
      assert.deepEqual(resource.linkedSource, reference);
    });

  });

  describe('Test du constructeur et des getters', function() {

    // Pour ne pas dépendre de la classe RouteRequest
    let request = sinon.mock(IsochroneRequest);
    request.operation = "isochrone"
    request.profile = "car";
    request.costType = "time";
    request.timeUnit = "second";

    it('getSourceIdFromRequest()_1', function() {
      request.costValue = 830;
      assert.equal(resource.getSourceIdFromRequest(request), "test-car-fastest");
    });

    it('getSourceIdFromRequest()_2', function() {
      request.costValue = 831;
      assert.equal(resource.getSourceIdFromRequest(request), "test-smartrouting");
    });

  });

});
