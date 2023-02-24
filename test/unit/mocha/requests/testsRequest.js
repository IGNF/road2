const assert = require('assert');
const Request = require('../../../../src/js/requests/request');
const logManager = require('../logManager');

describe('Test de la classe Request', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let request = new Request("route", "corse-osm", "routeRequest");

  describe('Test du constructeur et des getters', function() {

    it('Get Operation', function() {
      assert.equal(request.operation, "route");
    });

    it('Get Type', function() {
      assert.equal(request.type, "routeRequest");
    });

  });

  describe('Test des setters', function() {

    it('Set Operation', function() {
      request.operation = "nearest";
      assert.equal(request.operation, "nearest");
    });

    // Le type ne devrait pas changer car il dépend de la classe fille appelée
    it('Set Type ne change rien', function() {
      request.type = "otherRequest";
      assert.equal(request.type, "routeRequest");
    });

  });


});
