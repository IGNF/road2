const assert = require('assert');
const Base = require('../../../../src/js/base/base');
const logManager = require('../logManager');
const fs = require('fs');
const path = require('path');

describe('Test de la classe Base', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let file = path.resolve(__dirname, "../config/base/config.json");
  let configuration = JSON.parse(fs.readFileSync(file));

  let base = new Base(configuration);

  describe('Test du constructeur et des getters/setters', function() {

    it('Get connected', function() {
      assert.equal(base.connected, false);
    });

    it('Get pool', function() {
        assert.equal(base.pool, null);
    });

    it('Get configuration', function() {
      assert.equal(base.configuration, configuration);
    });

  });

  describe('Test de la connexion et de la deconnexion', function() {

    it('Connect()', async function() {
        await base.connect();
        assert.equal(base.connected, true);
    });

    it('Disconnect()', async function() {
      await base.disconnect();
      assert.equal(base.connected, false);
    });

  });

});
