const assert = require('assert');
const errorManager = require('../../../src/js/utils/errorManager');
const logManager = require('../logManager');

describe('Test du errorManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction createError()', function() {

    let msg = "Un message d'erreur";

    let status = 500;

    let goodResult = new Error(msg);
    goodResult.status = status;

    it('createError() should return an error', function() {
      assert.deepEqual(errorManager.createError(msg,status), goodResult);
    });

  });

});
