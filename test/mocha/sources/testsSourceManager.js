var assert = require('assert');
var SourceManager = require('../../../src/js/sources/sourceManager');
var logManager = require('../logManager');

describe('Test de la classe SourceManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  var sourceManager = new SourceManager();
  var sourcesIds = [];
  var sourcesDescriptions = {};

  var description = {
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
  };

  var wrongDuplicateDescription = {
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
          "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.20.0/profiles/car.lua"
        }
      }
    }
  };

  sourcesIds.push(description.id);
  sourcesDescriptions[description.id] = description;

  describe('Test du constructeur et des getters/setters', function() {

    it('Get SourceManager listOfSourceIds', function() {
      assert.deepEqual(sourceManager.listOfSourceIds, []);
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

    it('checkSource() avec une bonne description', function() {
      assert.equal(sourceManager.checkSource(description), true);
    });

    it('checkSource() avec un mauvais id', function() {
      var wrongDescription = Object.assign({}, description);
      wrongDescription.id = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

    it('checkSource() avec un mauvais type', function() {
      var wrongDescription = Object.assign({}, description);
      wrongDescription.type = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

  });

  describe('Test de la fonction checkSourceOsrm()', function() {

    it('checkSourceOsrm() avec une bonne description', function() {
      assert.equal(sourceManager.checkSourceOsrm(description), true);
    });

    it('checkSourceOsrm() avec un mauvais cost', function() {
      var wrongDescription = Object.assign({}, description);
      wrongDescription.cost = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.profile', function() {
      var wrongDescription = Object.assign({}, description);
      wrongDescription.cost.profile = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.optimization', function() {
      var wrongDescription = Object.assign({}, description);
      wrongDescription.cost.optimization = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.compute', function() {
      var wrongDescription = Object.assign({}, description);
      wrongDescription.cost.compute = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
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
      var source = sourceManager.createSource(description);
      assert.equal(source.type, "osrm");
    });

  });

  describe('Test de la fonction connectSource()', function() {

    it('connectSource() avec une description correcte', function() {
      var source = sourceManager.createSource(description);
      assert.equal(sourceManager.connectSource(source), true);
    });

  });

});
