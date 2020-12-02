const assert = require('assert');
const validationManager = require('../../../../src/js/utils/validationManager');
const logManager = require('../logManager');

describe('Test du validationManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction createValidationMessage()', function() {

    let msg = "Un message de validation";

    let goodResult = {
      code: "ok",
      message: msg
    };

    it('createValidationMessage() should return the right object', function() {
      assert.deepEqual(validationManager.createValidationMessage(msg), goodResult);
    });

  });

});
