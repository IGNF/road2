const assert = require('assert');
const OsrmResource = require('../../../../src/js/resources/osrmResource');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
const logManager = require('../../../unit/mocha/logManager');

const sinon = require('sinon');

describe('Test de la classe OsrmResource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let resourceConfiguration = {
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
              "file": "/usr/local/share/osrm/profiles/car.lua"
            }
          }
        }
      }
    ],
    "availableOperations":[

    ],
    "defaultSourceId": "corse-car-fastest",
    "boundingBox": "-180,-90,180,90",
    "defaultProjection": "EPSG:4326",
    "availableProjections": ["EPSG:4326","EPSG:2154"]
    }
  };

  let resource = new OsrmResource(resourceConfiguration);

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
      reference["carfastest"] = "corse-car-fastest";
      assert.deepEqual(resource.linkedSource, reference);
    });

  });

  describe('Test de getSourceIdFromRequest', function() {

    // Pour ne pas dépendre de la classe RouteRequest
    let request = sinon.mock(RouteRequest);
    request.profile = "car";
    request.optimization = "fastest";

    it('getSourceIdFromRequest()', function() {
      assert.equal(resource.getSourceIdFromRequest(request), "corse-car-fastest");
    });

  });

});
