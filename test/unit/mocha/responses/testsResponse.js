const assert = require('assert');
const Response = require('../../../../src/js/responses/response');
const logManager = require('../logManager');

describe('Test de la classe Response', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters/setters', function() {

    let response = new Response("mon-type");

    it('Get Type', function() {
      assert.equal(response.type, "mon-type");
    });

    it('Set Type n\'existe pas car non modifiable', function() {
      response.type = "nouveau-type";
      assert.equal(response.type, "mon-type");
    });

  });

});
