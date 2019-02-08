var assert = require('assert');
var Source = require('../../../src/js/sources/source');
var logManager = require('../logManager');

describe('Test de la classe Source', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters', function() {

    var source = new Source("mon-id", "osrm");

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

    var source = new Source("mon-id", "osrm");

    it('Set Source connected', function() {
      source.connected = true;
      assert.equal(source.connected, true);
    });

  });

  describe('Test de la fonction connect()', function() {

    var source = new Source("mon-id", "osrm");

    it('Connect()', function() {
      assert.equal(source.connect(), true);
    });

  });

  describe('Test de la fonction disconnect()', function() {

    var source = new Source("mon-id", "osrm");

    it('Disconnect()', function() {
      assert.equal(source.disconnect(), true);
    });

  });

});
