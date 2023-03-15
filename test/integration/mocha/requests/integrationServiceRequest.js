const assert = require('assert');
const ServiceRequest = require('../../../../src/js/requests/serviceRequest');
const logManager = require('../logManager');

describe('Test de la classe ServiceRequest', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let request = new ServiceRequest("test");

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(request.type, "serviceRequest");
    });

    it('Get service', function() {
      assert.equal(request.service, "test");
    });

    it('Set service', function() {
        request.service = "main";
        assert.equal(request.service, "main");
      });

  });

});
