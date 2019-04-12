const assert = require('assert');
const Source = require('../../../src/js/sources/source');
const logManager = require('../logManager');

describe('Test de la classe Source', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters', function() {

    let source = new Source("mon-id", "osrm");

    it('Get Source id', function() {
      assert.equal(source.id, "mon-id");
    });

    it('Get Source type', function() {
      assert.equal(source.type, "osrm");
    });

    it('Get Source connected', function() {
      assert.equal(source.connected, false);
    });

  });

  describe('Test des setters', function() {

    let source = new Source("mon-id", "osrm");

    it('Set Source connected', function() {
      source.connected = true;
      assert.equal(source.connected, true);
    });

  });

  describe('Test de la fonction connect()', function() {

    let source = new Source("mon-id", "osrm");

    it('Connect()', async function() {
      const sourceConnected = await source.connect();
      assert.equal(sourceConnected, true);
    });

  });

  describe('Test de la fonction disconnect()', function() {

    let source = new Source("mon-id", "osrm");

    it('Disconnect()', async function() {
      const sourceDisconnected = await source.disconnect();
      assert.equal(sourceDisconnected, true);
    });

  });

});
