var assert = require('assert');
var storageManager = require('../../../src/js/utils/storageManager');
var logManager = require('../logManager');

describe('Test du storageManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction checkJsonStorage()', function() {

    var json = {
      "file": "/home/docker/data/corse-latest.osrm"
    };

    var wrongJson = {
      "fil": "/home/docker/data/corse-latest.osrm"
    };

    it('checkJsonStorage() should return true when the json is correct', function() {
      assert.equal(storageManager.checkJsonStorage(json), true);
    });

    it('checkJsonStorage() should return false when the json is correct', function() {
      assert.equal(storageManager.checkJsonStorage(wrongJson), false);
    });

  });

});
