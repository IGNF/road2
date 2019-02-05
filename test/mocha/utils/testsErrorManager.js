var assert = require('assert');
var errorManager = require('../../../src/js/utils/errorManager');

describe('Test du errorManager', function() {

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
