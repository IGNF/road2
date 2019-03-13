var assert = require('assert');
var Resource = require('../../../src/js/resources/resource');
var logManager = require('../logManager');

describe('Test de la classe Resource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  var resource = new Resource("mon-id", "osrm");

  describe('Test du constructeur et des getters', function() {

    it('Get Id', function() {
      assert.equal(resource.id, "mon-id");
    });

    it('Get Type', function() {
      assert.equal(resource.type, "osrm");
    });

  });

  describe('Test de la fonction getSourceIdFromRequest()', function() {

    it('getSourceIdFromRequest()', function() {
      assert.equal(resource.getSourceIdFromRequest(), "");
    });

  });

});
