var assert = require('assert');
var ResourceManager = require('../../../src/js/resources/resourceManager');
var SourceManager = require('../../../src/js/sources/sourceManager');
var OsrmResource = require('../../../src/js/resources/osrmResource');
var logManager = require('../logManager');

describe('Test de la classe ResourceManager', function() {

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

  var resourceManager = new ResourceManager();
  var sourceManager = new SourceManager();

  describe('Test du constructeur et des getters', function() {

    it('Get listOfResourceIds', function() {
      assert.deepEqual(resourceManager.listOfResourceIds, new Array());
    });

  });

  describe('Test de checkResource() et checkResourceOsrm()', function() {

    it('Avec les bons parametres', function() {
      assert.equal(resourceManager.checkResource(resourceConfiguration, sourceManager), true);
    });

    it('checkResource() avec un mauvais id', function() {
      var wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      wrongDescription.resource.id = "";
      assert.equal(resourceManager.checkResource(wrongDescription, sourceManager), false);
    });

    it('checkResource() avec un mauvais type', function() {
      var wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      wrongDescription.resource.id = "test-2";
      wrongDescription.resource.type = "test";
      assert.equal(resourceManager.checkResource(wrongDescription, sourceManager), false);
    });

    it('checkResource() avec un mauvais id deja pris', function() {
      var wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      assert.equal(resourceManager.checkResource(wrongDescription, sourceManager), false);
    });

  });

  describe('Test de createResource()', function() {

    it('createResource()', function() {
      var reference = new OsrmResource(resourceConfiguration);
      assert.deepEqual(resourceManager.createResource(resourceConfiguration), reference);
    });

  });

});
