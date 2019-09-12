const assert = require('assert');
const Base = require('../../../src/js/base/base');
const BaseManager = require('../../../src/js/base/baseManager');
const logManager = require('../logManager');

describe('Test de la classe BaseManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let configuration = "/home/docker/app/test/mocha/config/dbs/db_config_test.json";

  let baseManager = new BaseManager();

  describe('Test du constructeur et des getters/setters', function() {

    it('Get listOfVerifiedDbConfig', function() {
      assert.deepEqual(baseManager.listOfVerifiedDbConfig, new Array());
    });

    it('Get baseCatalog', function() {
      assert.deepEqual(baseManager.baseCatalog, {});
    });

  });

  describe('Verifications des configurations', function() {

    it('checkBase()', function() {
      assert.equal(baseManager.checkBase(configuration), true);
    });

  });

  describe('Creation d\'une base', function() {

    it('createBase()', function() {
      let newBase = baseManager.createBase(configuration);
      assert.equal(newBase.connected, false);
    });

  });

});
