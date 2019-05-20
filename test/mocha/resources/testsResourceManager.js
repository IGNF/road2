const assert = require('assert');
const ResourceManager = require('../../../src/js/resources/resourceManager');
const SourceManager = require('../../../src/js/sources/sourceManager');
const OsrmResource = require('../../../src/js/resources/osrmResource');
const logManager = require('../logManager');

const sinon = require('sinon');
const mockfs = require('mock-fs');

describe('Test de la classe ResourceManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();

    mockfs({
      "/home/docker/data": {
        "corse-latest.osrm": "",
        "corse-latest.osm.pbf": "",
      },
      "/home/docker/osrm/osrm-backend/osrm-backend-5.20.0/profiles": {
        "car.lua": "",
      },
    });
  });

  after(() => {
    mockfs.restore();
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

  let resourceManager = new ResourceManager();
  let sourceManager = sinon.mock(SourceManager);

  describe('Test du constructeur et des getters', function() {

    it('Get listOfResourceIds', function() {
      assert.deepEqual(resourceManager.listOfResourceIds, new Array());
    });

  });

  describe('Test de checkResource() et checkResourceOsrm()', function() {

    it('Avec les bons parametres', function() {
      sourceManager.checkSource = sinon.stub().withArgs(resourceConfiguration).returns(true);
      assert.equal(resourceManager.checkResource(resourceConfiguration, sourceManager), true);
    });

    it('checkResource() avec un mauvais id', function() {
      let wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      wrongDescription.resource.id = "";
      assert.equal(resourceManager.checkResource(wrongDescription, sourceManager), false);
    });

    it('checkResource() avec un mauvais type', function() {
      let wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      wrongDescription.resource.id = "test-2";
      wrongDescription.resource.type = "test";
      assert.equal(resourceManager.checkResource(wrongDescription, sourceManager), false);
    });

    it('checkResource() avec un mauvais id deja pris', function() {
      let wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      assert.equal(resourceManager.checkResource(wrongDescription, sourceManager), false);
    });

  });

  describe('Test de createResource()', function() {

    it('createResource()', function() {
      let reference = new OsrmResource(resourceConfiguration);
      assert.deepEqual(resourceManager.createResource(resourceConfiguration), reference);
    });

  });

});
