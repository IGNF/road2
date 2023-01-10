const assert = require('assert');
const BaseManager = require('../../../../src/js/base/baseManager');
const logManager = require('../logManager');
const path = require('path');

describe('Test de la classe BaseManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let configuration = path.resolve(__dirname, "../config/dbs/db_config_test.json");

  let baseManager = new BaseManager();

  describe('Test du constructeur et des attributs', function() {

    it('Get loadedBaseConfiguration', function() {
      assert.deepEqual(baseManager._loadedBaseConfiguration, new Array());
    });

    it('Get checkedBaseConfiguration', function() {
      assert.deepEqual(baseManager._checkedBaseConfiguration, new Array());
    });

    it('Get baseCatalog', function() {
      assert.deepEqual(baseManager._baseCatalog, {});
    });

  });

  describe('Cycle de vérification des configurations', function() {

    it('checkBaseConfiguration()', async function() {
      let response = await baseManager.checkBaseConfiguration(configuration);
      assert.equal(response, true);
    });

    it('saveCheckedBaseConfiguration()', function() {
      baseManager.saveCheckedBaseConfiguration(configuration);
      assert.deepEqual(baseManager._checkedBaseConfiguration, [configuration]);
    });

    it('flushCheckedBaseConfiguration()', function() {
      baseManager.saveCheckedBaseConfiguration(configuration);
      baseManager.flushCheckedBaseConfiguration();
      assert.deepEqual(baseManager._checkedBaseConfiguration, new Array());
    });

  });

  describe('Chargement des configurations', function() {

    it('loadBaseConfiguration()', function() {
      assert.equal(baseManager.loadBaseConfiguration(configuration), true);
    });

  });

  describe('Récupération d\'une base', function() {

    it('getBase()', function() {
      let base = baseManager.getBase(configuration);
      assert.deepEqual(base.connected, false);
    });

  });

});
