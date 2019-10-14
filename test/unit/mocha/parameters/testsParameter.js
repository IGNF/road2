const assert = require('assert');
const Parameter = require('../../../../src/js/parameters/parameter');
const logManager = require('../logManager');
const sinon = require('sinon');

describe('Test de la classe Parameter', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let serviceParameter = new Parameter("start", "point", "Point de départ", "Point de départ de l'itineraire", "true", "false");

  describe('Test du constructeur et des getters', function() {

    it('Get id', function() {
      assert.equal(serviceParameter.id, "start");
    });

  });

});
