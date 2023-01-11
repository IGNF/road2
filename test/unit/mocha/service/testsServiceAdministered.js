const assert = require('assert');
const ServiceAdministered = require('../../../../src/js/service/serviceAdministered');
const logManager = require('../logManager');

describe('Test de la classe ServiceAdministered', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters', function() {

    let serviceAdm = new ServiceAdministered("test", "newProcess");

    it('Get Id', function() {
      assert.equal(serviceAdm.id, "test");
    });

    it('Get Type', function() {
      assert.equal(serviceAdm.type, "newProcess");
    });

  });

});
