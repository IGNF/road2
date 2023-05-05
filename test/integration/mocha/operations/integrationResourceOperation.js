const assert = require('assert');
const ResourceOperation = require('../../../../src/js/operations/resourceOperation');
const ResourceParameter = require('../../../../src/js/parameters/resourceParameter');
const logManager = require('../logManager');
const Parameter = require('../../../../src/js/parameters/parameter');

describe('Test de la classe ResourceOperation', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let serviceParameter = new Parameter("start","point","start","Points de départ","true","false")
  let resourceParameter = new ResourceParameter(serviceParameter);
  let parameterHash = {};
  parameterHash["start"] = resourceParameter;
  let resourceOperation = new ResourceOperation("route", parameterHash);

  describe('Test du constructeur et des getters', function() {

    it('Get serviceOperationId', function() {
      assert.equal(resourceOperation.serviceOperationId, "route");
    });

    it('Get resourceParameters', function() {
      assert.deepEqual(resourceOperation.resourceParameters, parameterHash);
    });

  });

  describe('Test du constructeur et des getters', function() {

    it('getParameterById() d\'un paramètre existant', function() {
      assert.deepEqual(resourceOperation.getParameterById("start"), parameterHash["start"]);
    });

    it('getParameterById() d\'un paramètre non existant', function() {
      assert.deepEqual(resourceOperation.getParameterById("end"), {});
    });

  });

});
