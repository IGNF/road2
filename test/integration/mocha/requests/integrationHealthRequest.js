const assert = require('assert');
const HealthRequest = require('../../../../src/js/requests/healthRequest');
const logManager = require('../logManager');

describe('Test de la classe HealthRequest', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let request = new HealthRequest();

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(request.type, "healthRequest");
    });

    it('Get verbose', function() {
      assert.equal(request.verbose, false);
    });

    it('Set verbose', function() {
        request.verbose = true;
        assert.equal(request.verbose, true);
      });

  });

});
