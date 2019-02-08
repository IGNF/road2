var assert = require('assert');
var errorManager = require('../../../src/js/utils/errorManager');
var logManager = require('../logManager');

describe('Test du errorManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction createError()', function() {

    var msg = "Un message d'erreur";

    var status = 500;

    var goodResult = new Error(msg);
    goodResult.status = status;

    it('createError() should return an error', function() {
      assert.deepEqual(errorManager.createError(msg,status), goodResult);
    });

  });

});
