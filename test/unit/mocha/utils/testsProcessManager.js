const assert = require('assert');
const processManager = require('../../../../src/js/utils/processManager');
const logManager = require('../logManager');

describe('Test du processManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction shutdown()', function() {

    // TODO: voir si on peut tester l'extinction d'un autre process que celui de mocha
    xit('shutdown() avec un code de retour non nul', function() {
        assert.deepEqual(processManager.shutdown(1), true);
    });

  });

});
