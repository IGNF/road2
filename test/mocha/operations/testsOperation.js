const assert = require('assert');
const Operation = require('../../../src/js/operations/operation');
const Parameter = require('../../../src/js/parameters/parameter');
const logManager = require('../logManager');
const sinon = require('sinon');

describe('Test de la classe Operation', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  // Pour ne pas dépendre de la classe Parameter
  let serviceParameter = sinon.mock(Parameter);
  serviceParameter.id = "start";

  let parameters = {};
  parameters["start"] = serviceParameter;

  let serviceOperation = new Operation("route", "Calcul d'itinéraire", "Calculer un itinéraire", parameters);

  describe('Test du constructeur et des getters', function() {

    it('Get id', function() {
      assert.equal(serviceOperation.id, "route");
    });

    it('Get name', function() {
      assert.equal(serviceOperation.name, "Calcul d'itinéraire");
    });

    it('Get description', function() {
      assert.equal(serviceOperation.description, "Calculer un itinéraire");
    });

    it('Get parameters', function() {
      assert.deepEqual(serviceOperation.parameters, parameters);
    });

    it('getParameterById()', function() {
      assert.deepEqual(serviceOperation.getParameterById("start"), parameters["start"]);
    });

  });

});
