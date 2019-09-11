const assert = require('assert');
const Base = require('../../../src/js/base/base');
const logManager = require('../logManager');

describe('Test de la classe Base', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let configuration = {
    "host": "baseHost",
    "database": "baseName",
    "user": "user",
    "password": "pwd",
    "port": "5432"
  };

  let base = new Base(configuration);

  describe('Test du constructeur et des getters/setters', function() {

    it('Get connected', function() {
      assert.equal(base.connected, false);
    });

    it('Get pool', function() {
        assert.equal(base.pool.options.host, "baseHost");
    });

  });

  describe('Test de la connexion a une base', function() {

    it('Connect() avec les mauvais arguments', async function() {
      try {
        await base.connect();
      } catch(err) {
        assert.equal(base.connected, false);
      }
        
    });

  });

});
