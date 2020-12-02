const assert = require('assert');
const ProjectionManager = require('../../../../src/js/geography/projectionManager');
const logManager = require('../logManager');

describe('Test de la classe ProjectionManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters/setters', function() {

    let projManager = new ProjectionManager();

    it('Get listOfProjectionId', function() {
      assert.deepEqual(projManager.listOfProjectionId, new Array());
    });

  });

  describe('Chargement d\'une configuration de projection', function() {

    let projManager = new ProjectionManager();
    let configuration = {
      "id": "EPSG:4326",
      "parameters": "+proj=longlat +datum=WGS84 +no_defs"
    };

    it('loadProjection()', function() {
      assert.equal(projManager.loadProjection(configuration), true);
      assert.deepEqual(projManager.listOfProjectionId, ["EPSG:4326"]);
    });

  });

  describe('Chargement d\'un fichier de projections', function() {

    let projManager = new ProjectionManager();
    let file = "/home/docker/app/test/unit/mocha/config/projections/projection.json";

    it('loadProjectionFile()', function() {
      assert.equal(projManager.loadProjectionFile(file), true);
      assert.equal(projManager.isAvailableById("EPSG:4326"), true);
      assert.equal(projManager.isAvailableById("EPSG:2154"), true);
      assert.equal(projManager.isAvailableById("EPSG:2155"), false);
    });

  });

  describe('Chargement d\'un dossier de projections', function() {

    let projManager = new ProjectionManager();
    let directory = "/home/docker/app/test/unit/mocha/config/projections/";

    it('loadProjectionDirectory()', function() {
      assert.equal(projManager.loadProjectionDirectory(directory), true);
      assert.equal(projManager.isAvailableById("EPSG:4326"), true);
      assert.equal(projManager.isAvailableById("EPSG:2154"), true);
      assert.equal(projManager.isAvailableById("EPSG:2155"), false);
    });

  });

  describe('Test de isAvailableById', function() {

    let projManager = new ProjectionManager();
    let directory = "/home/docker/app/test/unit/mocha/config/projections/";

    it('isAvailableById()', function() {
      projManager.loadProjectionDirectory(directory);
      assert.equal(projManager.isAvailableById("EPSG:4326"), true);
      assert.equal(projManager.isAvailableById("EPSG:2154"), true);
      assert.equal(projManager.isAvailableById("EPSG:2155"), false);
    });

  });

});
