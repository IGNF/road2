const assert = require('assert');
const Response = require('../../../src/js/responses/response');
const logManager = require('../logManager');

describe('Test de la classe Response', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters/setters', function() {

    let response = new Response("mon-id");

    it('Get Resource', function() {
      assert.equal(response.resource, "mon-id");
    });

    it('Set Resource', function() {
      response.resource = "nouvel-id";
      assert.equal(response.resource, "nouvel-id");
    });

  });

});
