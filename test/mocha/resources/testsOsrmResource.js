var assert = require('assert');
var OsrmResource = require('../../../src/js/resources/osrmResource');
var RouteRequest = require('../../../src/js/requests/routeRequest');
var logManager = require('../logManager');

describe('Test de la classe OsrmResource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  var resourceConfiguration = {
    "resource": {
    "id": "corse-osm",
    "type": "osrm",
    "description": "Exemple d'une ressource sur la Corse avec les données OSM.",
    "topology": {
      "description": "Données OSM sur la Corse.",
      "storage": {
        "file": "/home/docker/data/corse-latest.osm.pbf"
      },
      "projection": "EPSG:4326"
    },
    "sources": [
      {
        "id": "corse-car-fastest",
        "type": "osrm",
        "storage": {
          "file": "/home/docker/data/corse-latest.osrm"
        },
        "cost": {
          "profile": "car",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.20.0/profiles/car.lua"
            }
          }
        }
      }
    ],
    "availableOperations":[

    ],
    "defaultSourceId": "corse-car-fastest",
    "boundingBox": "-90,-180,90,180",
    "defaultProjection": "EPSG:4326",
    "availableProjections": ["EPSG:4326","EPSG:2154"]
    }
  };

  var resource = new OsrmResource(resourceConfiguration);

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

    it('Get DefaultProfile', function() {
      assert.equal(resource.defaultProfile, "car");
    });

    it('Get DefaultOptimization', function() {
      assert.equal(resource.defaultOptimization, "fastest");
    });

    it('Get DefaultSourceId', function() {
      assert.equal(resource.defaultSourceId, "corse-car-fastest");
    });

    it('Get LinkedSource', function() {
      var reference = {};
      reference["carfastest"] = "corse-car-fastest";
      assert.deepEqual(resource.linkedSource, reference);
    });

  });

  describe('Test du constructeur et des getters', function() {

    var request = new RouteRequest("resource-id", {lon: 8.732901, lat: 41.928821}, {lon: 8.732901, lat: 41.953932}, "car", "fastest");

    it('getSourceIdFromRequest()', function() {
      assert.equal(resource.getSourceIdFromRequest(request), "corse-car-fastest");
    });

  });

});
