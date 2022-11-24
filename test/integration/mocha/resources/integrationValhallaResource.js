const assert = require('assert');
const ValhallaResource = require('../../../../src/js/resources/valhallaResource');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
const logManager = require('../../../unit/mocha/logManager');

const sinon = require('sinon');

describe('Test de la classe ValhallaResource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let resourceConfiguration = {
    "resource": {
    "id": "test-valhalla",
    "type": "valhalla",
    "description": "Exemple d'une ressource Valhalla",
    "topology": {
      "description": "Données OSM",
      "storage": {
        "file": "/home/docker/data/corse-latest.osm.pbf"
      },
      "projection": "EPSG:4326"
    },
    "sources": [
      {
        "id": "corse-auto-valhalla",
        "type": "valhalla",
        "storage": {
          "tar": "/home/docker/data/corse-latest-valhalla-tiles.tar",
          "dir": "/home/docker/data/corse-latest-valhalla-tiles/",
          "config": "/home/docker/data/valhalla.json"
        },
        "cost": {
          "profile": "car",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/docker/config/graph_bdtopo.lua"
            },
            "configuration": {
              "costing": "auto",
              "storage": {
                "file": "/home/docker/config/costs_calculation_sample.json"
              }
            }
          }
        }
      }
    ],
    "availableOperations":[

    ],
    "defaultSourceId": "corse-auto-valhalla",
    "boundingBox": "-180,-90,180,90",
    "defaultProjection": "EPSG:4326",
    "availableProjections": ["EPSG:4326","EPSG:2154"]
    }
  };

  let resource = new ValhallaResource(resourceConfiguration);

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

    it('Get LinkedSource', function() {
      let reference = {};
      reference["carfastest"] = "corse-auto-valhalla";
      assert.deepEqual(resource.linkedSource, reference);
    });

  });

  describe('Test de getSourceIdFromRequest', function() {

    // Pour ne pas dépendre de la classe RouteRequest
    let request = sinon.mock(RouteRequest);
    request.profile = "car";
    request.optimization = "fastest";

    it('getSourceIdFromRequest()', function() {
      assert.equal(resource.getSourceIdFromRequest(request), "corse-auto-valhalla");
    });

  });

});
