const assert = require('assert');
const Operation = require('../../../../src/js/operations/operation');
const Parameter = require('../../../../src/js/parameters/parameter');
const logManager = require('../logManager');

describe('Test de la classe Operation', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let id = "route";
  let name = "Calcul d'itinéraire";
  let description = "Calculer un itinéraire";
  let parameters = {};

  let paramId = "start";
  let paramType = "point";
  let paramName = "Point de départ";
  let paramDescription = "Point de départ de l'itineraire";
  let paramRequired = "true";
  let paramDefaultValue = "false";

  // Pour ne pas dépendre de la classe Parameter
  let serviceParameter = new Parameter(paramId, paramType, paramName, paramDescription, paramRequired, paramDefaultValue);
  
  parameters[paramId] = serviceParameter;

  let serviceOperation = new Operation(id, name, description, parameters);

  describe('Test du constructeur et des getters', function() {

    it('Get id', function() {
      assert.equal(serviceOperation.id, id);
    });

    it('Get name', function() {
      assert.equal(serviceOperation.name, name);
    });

    it('Get description', function() {
      assert.equal(serviceOperation.description, description);
    });

    it('Get parameters', function() {
      assert.deepEqual(serviceOperation.parameters, parameters);
    });

    it('getParameterById()', function() {
      assert.deepEqual(serviceOperation.getParameterById(paramId), parameters[paramId]);
    });

  });

});
