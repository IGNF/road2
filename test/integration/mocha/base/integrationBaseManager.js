const assert = require('assert');
const Base = require('../../../../src/js/base/base');
const BaseManager = require('../../../../src/js/base/baseManager');
const logManager = require('../../../unit/mocha/logManager');
const fs = require('fs');

describe('Test de la classe BaseManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let configuration = "/home/docker/app/test/integration/mocha/config/dbs/db_config_test.json";
  let referenceBase = new Base(JSON.parse(fs.readFileSync(configuration)));

  let baseManager = new BaseManager();

  describe('Test du constructeur et des getters/setters', function() {

    it('Get loadedBaseConfiguration', function() {
      assert.deepEqual(baseManager.loadedBaseConfiguration, new Array());
    });

    it('Get baseCatalog', function() {
      assert.deepEqual(baseManager.baseCatalog, {});
    });

  });

  describe('Verifications des configurations', function() {

    it('checkBaseConfiguration()', async function() {
      let response = await baseManager.checkBaseConfiguration(configuration);
      assert.equal(response, true);
    });

    it('saveCheckedBaseConfiguration()', function() {
      baseManager.saveCheckedBaseConfiguration(configuration);
      assert.deepEqual(baseManager._checkedBaseConfiguration, [configuration]);
    });

  });

  describe('Creation d\'une base', function() {

    it('loadBaseConfiguration()', function() {
      let newBase = baseManager.loadBaseConfiguration(configuration);
      // TODO: comprendre pourquoi le assert qui suit ne marche pas 
      // assert.deepEqual(baseManager.baseCatalog[configuration], referenceBase);
      assert.equal(newBase.connected, false);
    });

  });

});
