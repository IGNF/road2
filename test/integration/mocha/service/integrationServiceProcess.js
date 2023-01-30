const assert = require('assert');
const ServiceProcess = require('../../../../src/js/service/serviceProcess');
const logManager = require('../logManager');
const path = require('path');

describe('Test de la classe ServiceProcess', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let configuration = path.resolve(__dirname, "../config/service.json");
  let serviceProcess = new ServiceProcess("test", configuration);

  describe('Test du constructeur et des attributs', function() {

    it('Get id', function() {
      assert.equal(serviceProcess.id, "test");
    });

    it('Get type', function() {
      assert.equal(serviceProcess.type, "newProcess");
    });

    it('Get _configurationLocation', function() {
      assert.equal(serviceProcess._configurationLocation, configuration);
    });

    it('Get _serviceInstance', function() {
      assert.deepEqual(serviceProcess._serviceInstance, {});
    });

  });

  describe('Test du chargement d\'un service', function() {

    xit('loadService()', function() {
      assert.equal(serviceProcess.loadService(), true);
    });

  });

});
