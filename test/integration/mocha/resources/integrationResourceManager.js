const assert = require('assert');
const ResourceManager = require('../../../../src/js/resources/resourceManager');
const logManager = require('../logManager');

const sinon = require('sinon');

describe('Test de la classe ResourceManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let sourceConfiguration = {
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
      "optimization": "fastest"
    }
  };

  // le resourceManager délègue la gestion des sources et des opérations aux managers associés
  let sourceManager = {
    isCheckedSourceAvailable: sinon.stub().returns(true),
    isLoadedSourceAvailable: sinon.stub().returns(true),
    getSourceById: sinon.stub().returns({ type: "osrm", configuration: sourceConfiguration })
  };

  let operationManager = {
    checkResourceOperationConfiguration: sinon.stub().returns(true),
    loadResourceOperationConfiguration: sinon.stub().returns(true)
  };

  let resourceConfiguration = {
    "resource": {
      "id": "corse-osm",
      "resourceVersion": "1.0.0",
      "type": "osrm",
      "description": "Exemple d'une ressource sur la Corse avec les données OSM.",
      "sources": [
        "corse-car-fastest"
      ],
      "availableOperations": [
        {
          "id": "route",
          "parameters": [
            {
              "id": "resource",
              "values": ["corse-osm"]
            }
          ]
        }
      ]
    }
  };

  let resourceManager = new ResourceManager(sourceManager, operationManager);

  describe('Test du constructeur et des getters', function() {

    it('Get resource', function() {
      assert.deepEqual(resourceManager.resource, {});
    });

  });

  describe('Test de checkResourceConfiguration()', function() {

    it('Avec les bons parametres', function() {
      assert.equal(resourceManager.checkResourceConfiguration(resourceConfiguration), true);
    });

    it('checkResourceConfiguration() sans objet resource', function() {
      assert.equal(resourceManager.checkResourceConfiguration({}), false);
    });

    it('checkResourceConfiguration() avec un mauvais id', function() {
      let wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      wrongDescription.resource.id = "";
      assert.equal(resourceManager.checkResourceConfiguration(wrongDescription), false);
    });

    it('checkResourceConfiguration() sans version', function() {
      let wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      wrongDescription.resource.id = "test-version";
      delete wrongDescription.resource.resourceVersion;
      assert.equal(resourceManager.checkResourceConfiguration(wrongDescription), false);
    });

    it('checkResourceConfiguration() avec un mauvais type', function() {
      let wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      wrongDescription.resource.id = "test-2";
      wrongDescription.resource.type = "test";
      assert.equal(resourceManager.checkResourceConfiguration(wrongDescription), false);
    });

    it('checkResourceConfiguration() avec des sources vides', function() {
      let wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      wrongDescription.resource.id = "test-3";
      wrongDescription.resource.sources = [];
      assert.equal(resourceManager.checkResourceConfiguration(wrongDescription), false);
    });

    it('checkResourceConfiguration() avec une operation indisponible pour le type', function() {
      let wrongDescription = JSON.parse(JSON.stringify(resourceConfiguration));
      wrongDescription.resource.id = "test-4";
      wrongDescription.resource.availableOperations[0].id = "isochrone";
      assert.equal(resourceManager.checkResourceConfiguration(wrongDescription), false);
    });

  });

  describe('Test de loadResourceConfiguration()', function() {

    it('loadResourceConfiguration() avec une description correcte', function() {
      assert.equal(resourceManager.loadResourceConfiguration(resourceConfiguration), true);
      assert.equal(resourceManager.resource[resourceConfiguration.resource.id].id, resourceConfiguration.resource.id);
    });

    it('checkResourceConfiguration() avec un id deja charge', function() {
      assert.equal(resourceManager.checkResourceConfiguration(resourceConfiguration), false);
    });

  });

});
