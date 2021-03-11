const assert = require('assert');
const ResourceManager = require('../../../../src/js/resources/resourceManager');
const SourceManager = require('../../../../src/js/sources/sourceManager');
const TopologyManager = require('../../../../src/js/topology/topologyManager');
const OperationManager = require('../../../../src/js/operations/operationManager');
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
      "/home/docker/osrm/osrm-backend/osrm-backend-5.24.0/profiles": {
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
      "id": "corse-osm",
      "type": "osm",
      "description": "Données OSM sur la Corse.",
      "storage": {
        "file": "/home/docker/internal/corse-latest.osm.pbf"
      },
      "projection": "EPSG:4326",
      "bbox": "-90,-180,90,180"
    },
    "sources": [
      {
        "id": "corse-car-fastest",
        "type": "osrm",
        "storage": {
          "file": "/home/docker/internal/corse-latest.osrm"
        },
        "cost": {
          "profile": "car",
          "optimization": "fastest",
          "compute": {
            "storage": {
              "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.24.0/profiles/car.lua"
            }
          }
        }
      }
    ],
    "availableOperations":[
      {
        "id": "route",
        "parameters": [
          {
            "id": "resource",
            "values": [
              "corse-osm"
            ]
          },
          {
            "id": "start",
            "values": {
              "bbox": "-90,-180,90,180",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "end",
            "values": {
              "bbox": "-90,-180,90,180",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "profile",
            "defaultValueContent": "car",
            "values": [
              "car"
            ]
          },
          {
            "id": "optimization",
            "defaultValueContent": "fastest",
            "values": [
              "fastest"
            ]
          },
          {
            "id": "intermediates",
            "values": {
              "bbox": "-90,-180,90,180",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "getSteps",
            "defaultValueContent": "true"
          },
          {
            "id": "waysAttributes",
            "values": [
              "name"
            ]
          },
          {
            "id": "geometryFormat",
            "defaultValueContent": "geojson",
            "values": [
              "geojson",
              "polyline"
            ]
          },
          {
            "id": "bbox",
            "defaultValueContent": "true"
          },
          {
            "id": "projection",
            "defaultValueContent": "EPSG:4326",
            "values": [
              "EPSG:4326",
              "EPSG:2154"
            ]
          },
          {
            "id": "timeUnit",
            "defaultValueContent": "minute",
            "values": [
              "hour",
              "minute",
              "second"
            ]
          },
          {
            "id": "distanceUnit",
            "defaultValueContent": "meter",
            "values": [
              "meter",
              "kilometer"
            ]
          }
        ]
      }
    ]
    }
  }
  ;

  let resourceManager = new ResourceManager();
  let sourceManager = sinon.mock(SourceManager);
  let topologyManager = sinon.mock(TopologyManager);
  let operationManager = sinon.mock(OperationManager);

  // Comportements attendus
  sourceManager.checkSource = sinon.stub().withArgs(resourceConfiguration).returns(true);
  sourceManager.sourceTopology = new Array();
  topologyManager.checkTopology = sinon.stub().returns(true);
  operationManager.checkResourceOperationConf = sinon.stub().returns(true);
  operationManager.getResourceOperationConf = sinon.stub().returns(true);
  operationManager.createResourceOperation = sinon.stub().returns(true);

  describe('Test du constructeur et des getters', function() {

    it('Get listOfResourceIds', function() {
      assert.deepEqual(resourceManager.listOfResourceIds, new Array());
    });

  });

  describe('Test de checkResource() et checkResourceOsrm()', function() {

    it('Avec les bons parametres', function() {
      assert.equal(resourceManager.checkResource(resourceConfiguration, sourceManager, operationManager, topologyManager), true);
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
      let newResource = resourceManager.createResource(resourceConfiguration, operationManager);
      assert.equal(newResource.id, resourceConfiguration.resource.id);
    });

  });

});
