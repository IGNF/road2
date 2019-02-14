var assert = require('assert');
var Response = require('../../../src/js/responses/response');
var logManager = require('../logManager');

describe('Test de la classe Response', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters/setters', function() {

    var response = new Response("mon-id");

    it('Get Resource', function() {
      assert.equal(response.resource, "mon-id");
    });

    it('Set Resource', function() {
      response.resource = "nouvel-id";
      assert.equal(response.resource, "nouvel-id");
    });

  });

});
