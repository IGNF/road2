const assert = require('assert');
const SourceManager = require('../../../../src/js/sources/sourceManager');
const OperationManager = require('../../../../src/js/operations/operationManager');
const logManager = require('../../../unit/mocha/logManager');
const Source = require('../../../../src/js/sources/source');

const sinon = require('sinon');
const mockfs = require('mock-fs');

describe('Test de la classe SourceManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();

    mockfs({
      "/home/docker/data": {
        "corse-latest.osrm": "",
        "corse-latest.osm.pbf": "",
      },
      "/usr/local/share/osrm/profiles": {
        "car.lua": "",
      },
    });
  });

  after(() => {
    mockfs.restore();
  });

  let sourceManager = new SourceManager();
  let sourcesIds = new Array();
  let sourcesDescriptions = {};

  let description = {
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
  };

  let resourceOperationTable =
    [
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
              "bbox": "-180,-90,180,90",
              "projection": "EPSG:4326"
            }
          },
          {
            "id": "end",
            "values": {
              "bbox": "-180,-90,180,90",
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
              "bbox": "-180,-90,180,90",
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
    ];


  let wrongDuplicateDescription = {
    "id": "corse-car-fastest",
    "type": "osrm",
    "storage": {
      "file": "/home/docker/data/corse-latest-2.osrm"
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
  };

  sourcesIds.push(description.id);
  sourcesDescriptions[description.id] = description;

  describe('Test du constructeur et des getters/setters', function() {

    it('Get SourceManager listOfSourceIds', function() {
      assert.deepEqual(sourceManager.listOfSourceIds, new Array());
    });

    it('Get SourceManager sourceDescriptions', function() {
      assert.deepEqual(sourceManager.sourceDescriptions, {});
    });

    it('Set SourceManager listOfSourceIds', function() {
      sourceManager.listOfSourceIds = sourcesIds;
      assert.deepEqual(sourceManager.listOfSourceIds, sourcesIds);
    });

    it('Set SourceManager sourceDescriptions', function() {
      sourceManager.sourceDescriptions = sourcesDescriptions;
      assert.deepEqual(sourceManager.sourceDescriptions, sourcesDescriptions);
    });

  });

  describe('Test de la fonction checkSource()', function() {
    let opMgr = sinon.mock(OperationManager);
    opMgr.isOperationAvailable = sinon.stub().returns(true);
    opMgr.isAvailableInTable = sinon.stub().returns(true);
    it('checkSource() avec une bonne description', function() {

      assert.equal(sourceManager.checkSource(description, opMgr, resourceOperationTable), true);
    });

    it('checkSource() avec un mauvais id', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "";
      assert.equal(sourceManager.checkSource(wrongDescription, opMgr, resourceOperationTable), false);
    });

    it('checkSource() avec un mauvais type', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-2";
      wrongDescription.type = "";
      assert.equal(sourceManager.checkSource(wrongDescription, opMgr, resourceOperationTable), false);
    });

  });

  describe('Test de la fonction checkSourceOsrm()', function() {
    let opMgr = sinon.mock(OperationManager);
    opMgr.isOperationAvailable = sinon.stub().returns(true);
    opMgr.isAvailableInTable = sinon.stub().returns(true);

    it('checkSourceOsrm() avec une bonne description', function() {
      assert.equal(sourceManager.checkSourceOsrm(description, opMgr, resourceOperationTable), true);
    });

    it('checkSourceOsrm() avec un mauvais cost', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-3";
      wrongDescription.cost = "";
      assert.equal(sourceManager.checkSource(wrongDescription, opMgr, resourceOperationTable), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.profile', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-4";
      wrongDescription.cost.profile = "";
      assert.equal(sourceManager.checkSource(wrongDescription, opMgr, resourceOperationTable), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.optimization', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-5";
      wrongDescription.cost.optimization = "";
      assert.equal(sourceManager.checkSource(wrongDescription, opMgr, resourceOperationTable), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.compute', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-6";
      wrongDescription.cost.compute = "";
      assert.equal(sourceManager.checkSource(wrongDescription, opMgr, resourceOperationTable), false);
    });

  });

  describe('Test de la fonction checkDuplicationSource()', function() {

    it('checkDuplicationSource() avec une description identique', function() {
      assert.equal(sourceManager.checkDuplicationSource(description), true);
    });

    it('checkDuplicationSource() avec une description ayant le même id mais différente', function() {
      assert.equal(sourceManager.checkDuplicationSource(wrongDuplicateDescription), false);
    });

  });

  describe('Test de la fonction createSource()', function() {

    it('createSource() avec une description correcte', function() {
      let source = sourceManager.createSource(description);
      assert.equal(source.type, "osrm");
    });

  });

  describe('Test de la fonction connectSource()', function() {

    it('connectSource() avec une description correcte', async function() {
      const source = sinon.mock(Source);
      source.connect = sinon.stub().returns(true);
      await sourceManager.connectSource(source);
    });

  });

});
