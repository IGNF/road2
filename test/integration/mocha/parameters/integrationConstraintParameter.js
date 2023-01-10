const assert = require('assert');
const Parameter = require('../../../../src/js/parameters/parameter');
const ConstraintParameter = require('../../../../src/js/parameters/constraintParameter');
const logManager = require('../logManager');
const Constraint = require('../../../../src/js/constraint/constraint');

describe('Test de la classe ConstraintParameter', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let refContraint = new Constraint("banned","waytype","toll","=","autoroute");
  let parameterConf = {"id":"constraints","values":[{"keyType":"name-osrm","key":"waytype","availableConstraintType":["banned"],"availableValues":[{"value":"autoroute","field":"toll"},{"value":"tunnel","field":"tunnel"},{"value":"pont","field":"bridge"}]}]};
  let parameter = new Parameter("resource","enumeration","resource","resource","true","false");
  let constraintParameter = new ConstraintParameter(parameter);

  describe('Test du constructeur et des getters', function() {

    it('Get serviceParameter', function() {
      assert.equal(constraintParameter.serviceParameter.style, "pipeDelimited");
    });

    it('Get defaultValueContent', function() {
      assert.deepEqual(constraintParameter.defaultValueContent, {});
    });

    it('Get values', function() {
      assert.deepEqual(constraintParameter.values, new Array());
    });

  });

  describe('Test du chargement', function() {

    it('load()', function() {
      assert.equal(constraintParameter.load(parameterConf), true);
    });

  });

  describe('Test des vérifications', function() {

    it('check() avec bonne valeur', function() {
      assert.equal(constraintParameter.check("{\"constraintType\":\"banned\",\"key\":\"waytype\",\"operator\":\"=\",\"value\":\"autoroute\"}").code, "ok");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(constraintParameter.check("test").code, "error");
    });

    it('specificCheck() avec bonne valeur', function() {
      assert.equal(constraintParameter.specificCheck("{\"constraintType\":\"banned\",\"key\":\"waytype\",\"operator\":\"=\",\"value\":\"autoroute\"}").code, "ok");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(constraintParameter.specificCheck("test").code, "error");
    });

  });

  describe('Test des conversions', function() {

    it('convertIntoTable()', function() {
      assert.equal(constraintParameter.convertIntoTable("{\"constraintType\":\"banned\",\"key\":\"waytype\",\"operator\":\"=\",\"value\":\"autoroute\"}\|{\"constraintType\":\"banned\",\"key\":\"waytype\",\"operator\":\"=\",\"value\":\"tunnel\"}", [], {}), true);
    });

    it('specificConvertion()', function() {
      assert.deepEqual(constraintParameter.specificConvertion("{\"constraintType\":\"banned\",\"key\":\"waytype\",\"operator\":\"=\",\"value\":\"autoroute\"}"), refContraint);
    });

  });


});
