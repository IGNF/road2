const assert = require('assert');
const SourceManager = require('../../../../src/js/sources/sourceManager');
const logManager = require('../logManager');

const sinon = require('sinon');
const mockfs = require('mock-fs');

describe('Test de la classe SourceManager', function() {

  // le sourceManager délègue la validation des projections et des bbox au projectionManager
  let projectionManager = {
    isProjectionChecked: sinon.stub().returns(true),
    checkBboxConfiguration: sinon.stub().returns(true)
  };

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

  let sourceManager = new SourceManager(projectionManager, {});

  let description = {
    "id": "corse-car-fastest",
    "description": "Source osrm de la Corse",
    "projection": "EPSG:4326",
    "bbox": "-180,-90,180,90",
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

  let wrongDuplicateDescription = JSON.parse(JSON.stringify(description));
  wrongDuplicateDescription.storage.file = "/home/docker/data/corse-latest-2.osrm";

  describe('Test du constructeur et des getters', function() {

    it('Get SourceManager loadedSourceId', function() {
      assert.deepEqual(sourceManager.loadedSourceId, new Array());
    });

    it('Get SourceManager sources', function() {
      assert.deepEqual(sourceManager.sources, {});
    });

  });

  describe('Test de la fonction checkSourceConfiguration()', function() {

    it('checkSourceConfiguration() avec une bonne description', async function() {
      assert.equal(await sourceManager.checkSourceConfiguration(description), true);
    });

    it('checkSourceConfiguration() avec un mauvais id', async function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "";
      assert.equal(await sourceManager.checkSourceConfiguration(wrongDescription), false);
    });

    it('checkSourceConfiguration() avec un mauvais type', async function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-2";
      wrongDescription.type = "";
      assert.equal(await sourceManager.checkSourceConfiguration(wrongDescription), false);
    });

    it('checkSourceConfiguration() sans description', async function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-7";
      delete wrongDescription.description;
      assert.equal(await sourceManager.checkSourceConfiguration(wrongDescription), false);
    });

  });

  describe('Test de la fonction checkSourceOsrm()', function() {

    it('checkSourceOsrm() avec une bonne description', function() {
      assert.equal(sourceManager.checkSourceOsrm(description), true);
    });

    it('checkSourceOsrm() avec un mauvais storage', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.storage = "";
      assert.equal(sourceManager.checkSourceOsrm(wrongDescription), false);
    });

    it('checkSourceOsrm() avec un mauvais cost', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.cost = "";
      assert.equal(sourceManager.checkSourceOsrm(wrongDescription), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.profile', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.cost.profile = "";
      assert.equal(sourceManager.checkSourceOsrm(wrongDescription), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.optimization', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.cost.optimization = "";
      assert.equal(sourceManager.checkSourceOsrm(wrongDescription), false);
    });

  });

  describe('Test de la fonction loadSourceConfiguration()', function() {

    it('loadSourceConfiguration() avec une description correcte', function() {
      assert.equal(sourceManager.loadSourceConfiguration(description), true);
      assert.equal(sourceManager.isLoadedSourceAvailable(description.id), true);
      assert.equal(sourceManager.getSourceById(description.id).type, "osrm");
    });

    it('loadSourceConfiguration() avec un type inconnu', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-unknown-type";
      wrongDescription.type = "unknown";
      assert.equal(sourceManager.loadSourceConfiguration(wrongDescription), false);
    });

  });

  describe('Test de la fonction checkDuplicationLoadedSource()', function() {

    it('checkDuplicationLoadedSource() avec une description identique', function() {
      assert.equal(sourceManager.checkDuplicationLoadedSource(description), true);
    });

    it('checkDuplicationLoadedSource() avec une description ayant le même id mais différente', function() {
      assert.equal(sourceManager.checkDuplicationLoadedSource(wrongDuplicateDescription), false);
    });

  });

  describe('Test des fonctions connectSource() et disconnectSource()', function() {

    it('connectSource() avec une source chargée', async function() {
      sourceManager.sources[description.id].connect = sinon.stub().resolves(true);
      assert.equal(await sourceManager.connectSource(description.id), true);
    });

    it('disconnectSource() avec une source chargée', async function() {
      sourceManager.sources[description.id].disconnect = sinon.stub().resolves(true);
      assert.equal(await sourceManager.disconnectSource(description.id), true);
    });

  });

});
