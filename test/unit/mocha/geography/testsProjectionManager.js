const assert = require('assert');
const path = require('path');
const ProjectionManager = require('../../../../src/js/geography/projectionManager');
const logManager = require('../logManager');

const projectionsDirectory = path.resolve(__dirname, '../config/projections/');
const projectionsFile = path.join(projectionsDirectory, 'france.json');

describe('Test de la classe ProjectionManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur', function() {

    let projManager = new ProjectionManager();

    it('Get loadedProjectionId', function() {
      assert.deepEqual(projManager.loadedProjectionId, new Array());
    });

  });

  describe('Vérification d\'une configuration de projection', function() {

    let projManager = new ProjectionManager();
    let configuration = {
      "id": "EPSG:4326",
      "parameters": "+proj=longlat +datum=WGS84 +no_defs"
    };

    it('checkProjectionConfiguration()', function() {
      assert.equal(projManager.checkProjectionConfiguration(configuration), true);
    });

  });

  describe('Test de isProjectionChecked', function() {

    let projManager = new ProjectionManager();
    let directory = projectionsDirectory;

    it('isProjectionChecked()', function() {
      projManager.checkProjectionDirectory(directory);
      assert.equal(projManager.isProjectionChecked("EPSG:4326"), true);
      assert.equal(projManager.isProjectionChecked("EPSG:2154"), true);
      assert.equal(projManager.isProjectionChecked("EPSG:2155"), false);
    });

  });

  describe('Vérification d\'un fichier de projections', function() {

    let projManager = new ProjectionManager();
    let file = projectionsFile;

    it('checkProjectionFile()', function() {
      assert.equal(projManager.checkProjectionFile(file), true);
      assert.equal(projManager.isProjectionChecked("EPSG:4326"), true);
      assert.equal(projManager.isProjectionChecked("EPSG:2154"), true);
      assert.equal(projManager.isProjectionChecked("EPSG:2155"), false);
    });

  });

  describe('Vérification d\'un dossier de projections', function() {

    let projManager = new ProjectionManager();
    let directory = projectionsDirectory;

    it('checkProjectionDirectory()', function() {
      assert.equal(projManager.checkProjectionDirectory(directory), true);
      assert.equal(projManager.isProjectionChecked("EPSG:4326"), true);
      assert.equal(projManager.isProjectionChecked("EPSG:2154"), true);
      assert.equal(projManager.isProjectionChecked("EPSG:2155"), false);
    });

  });

  describe('Chargement d\'une configuration de projection', function() {

    let projManager = new ProjectionManager();
    let configuration = {
      "id": "EPSG:4326",
      "parameters": "+proj=longlat +datum=WGS84 +no_defs"
    };

    it('loadProjectionConfiguration()', function() {
      assert.equal(projManager.loadProjectionConfiguration(configuration), true);
      assert.deepEqual(projManager.loadedProjectionId, ["EPSG:4326"]);
    });

  });

  describe('Test de isProjectionLoaded', function() {

    let projManager = new ProjectionManager();
    let directory = projectionsDirectory;

    it('isProjectionLoaded()', function() {
      projManager.loadProjectionDirectory(directory);
      assert.equal(projManager.isProjectionLoaded("EPSG:4326"), true);
      assert.equal(projManager.isProjectionLoaded("EPSG:2154"), true);
      assert.equal(projManager.isProjectionLoaded("EPSG:2155"), false);
    });

  });

  describe('Chargement d\'un fichier de projections', function() {

    let projManager = new ProjectionManager();
    let file = projectionsFile;

    it('loadProjectionFile()', function() {
      assert.equal(projManager.loadProjectionFile(file), true);
      assert.equal(projManager.isProjectionLoaded("EPSG:4326"), true);
      assert.equal(projManager.isProjectionLoaded("EPSG:2154"), true);
      assert.equal(projManager.isProjectionLoaded("EPSG:2155"), false);
    });

  });

  describe('Chargement d\'un dossier de projections', function() {

    let projManager = new ProjectionManager();
    let directory = projectionsDirectory;

    it('loadProjectionDirectory()', function() {
      assert.equal(projManager.loadProjectionDirectory(directory), true);
      assert.equal(projManager.isProjectionLoaded("EPSG:4326"), true);
      assert.equal(projManager.isProjectionLoaded("EPSG:2154"), true);
      assert.equal(projManager.isProjectionLoaded("EPSG:2155"), false);
    });

  });

});
