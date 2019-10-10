const assert = require('assert');
const ResourceOperation = require('../../../src/js/operations/resourceOperation');
const Parameter = require('../../../src/js/parameters/parameter');
const ResourceParameter = require('../../../src/js/parameters/resourceParameter');
const logManager = require('../logManager');
const sinon = require('sinon');

describe('Test de la classe ResourceOperation', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  // Pour ne pas dépendre de la classe Parameter et resourceParameter
  let serviceParameter = sinon.mock(Parameter);
  serviceParameter.id = "start";

  let resourceParameter = sinon.mock(ResourceParameter);
  resourceParameter.serviceParameter = serviceParameter;

  let parameters = {};
  parameters["start"] = serviceParameter;

  let resourceOperation = new ResourceOperation("route", parameters);

  describe('Test du constructeur et des getters', function() {

    it('Get serviceOperationId', function() {
      assert.equal(resourceOperation.serviceOperationId, "route");
    });

    it('Get resourceParameters', function() {
      assert.deepEqual(resourceOperation.resourceParameters, parameters);
    });

    it('getParameterById()', function() {
      assert.deepEqual(resourceOperation.getParameterById("start"), parameters["start"]);
    });

  });

});
