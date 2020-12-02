const assert = require('assert');
const Base = require('../../../../src/js/base/base');
const logManager = require('../logManager');

describe('Test de la classe Base', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let configuration = {
    "host": "pgrouting-procedures-centos",
    "database": "pgrouting",
    "user": "postgres",
    "password": "postgres",
    "port": "5432"
  };

  let base = new Base(configuration);

  describe('Test du constructeur et des getters/setters', function() {

    it('Get connected', function() {
      assert.equal(base.connected, false);
    });

    it('Get pool', function() {
        assert.equal(base.pool.options.host, "pgrouting-procedures-centos");
    });

  });

  describe('Test de la connexion et de la deconnexion', function() {

    xit('Connect()', async function() {
        await base.connect();
        assert.equal(base.connected, true);
    });

    xit('Disconnect()', async function() {
      await base.disconnect();
      assert.equal(base.connected, false);
    });

  });

});
