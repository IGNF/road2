const assert = require('assert');
const storageManager = require('../../../src/js/utils/storageManager');
const logManager = require('../logManager');

describe('Test du storageManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction checkJsonStorage()', function() {

    let json = {
      "file": "/home/docker/data/corse-latest.osrm"
    };

    let wrongJson = {
      "fil": "/home/docker/data/corse-latest.osrm"
    };

    it('checkJsonStorage() should return true when the json is correct', function() {
      assert.equal(storageManager.checkJsonStorage(json), true);
    });

    it('checkJsonStorage() should return false when the json is incorrect', function() {
      assert.equal(storageManager.checkJsonStorage(wrongJson), false);
    });

  });

});
