const assert = require('assert');
const HealthResponse = require('../../../../src/js/responses/healthResponse');
const logManager = require('../logManager');

describe('Test de la classe HealthResponse', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let response = new HealthResponse();

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(response.type, "healthResponse");
    });

    it('Get globalState', function() {
      assert.equal(response.globalState, "unknown");
    });

    it('Set globalState', function() {
        response.globalState = "green";
        assert.equal(response.globalState, "green");
    });

    it('Get adminState', function() {
        assert.equal(response.adminState, "unknown");
    });

    it('Set adminState', function() {
        response.adminState = "green";
        assert.equal(response.adminState, "green");
    });

    it('Get serviceStates', function() {
        assert.deepEqual(response.serviceStates, new Array());
    });

    it('Set serviceStates', function() {
        response.serviceStates.push({"serviceId":"unknown","state":"green"});
        assert.deepEqual(response.serviceStates[0], {"serviceId":"unknown","state":"green"});
    });

  });

});
