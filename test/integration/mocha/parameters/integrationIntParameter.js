const assert = require('assert');
const Parameter = require('../../../../src/js/parameters/parameter');
const IntParameter = require('../../../../src/js/parameters/intParameter');
const logManager = require('../logManager');

describe('Test de la classe IntParameter', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let parameterConf = {"id": "number", "defaultValueContent": 1, "values": {"min": 1,"max": 10}};
  let parameter = new Parameter("number","integer","number","number","false","true");
  let intParameter = new IntParameter(parameter);

  describe('Test du constructeur et des getters', function() {

    it('Get serviceParameter', function() {
      assert.equal(intParameter.serviceParameter.style, "pipeDelimited");
    });

    it('Get defaultValueContent', function() {
      assert.equal(intParameter.defaultValueContent, 0);
    });

    it('Get values', function() {
      assert.deepEqual(intParameter.values, {min:null,max:null});
    });

  });

  describe('Test du chargement', function() {

    it('load()', function() {
      assert.equal(intParameter.load(parameterConf), true);
    });

    it('Get defaultValueContent', function() {
      assert.equal(intParameter.defaultValueContent, 1);
    });

    it('Get values', function() {
      assert.deepEqual(intParameter.values, {min:1,max:10});
    });

  });

  describe('Test des vérifications', function() {

    it('check() avec bonne valeur', function() {
      assert.equal(intParameter.check("2").code, "ok");
    });

    it('check() avec autre bonne valeur', function() {
      assert.equal(intParameter.check("10").code, "ok");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(intParameter.check("test").code, "error");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(intParameter.check(1).code, "error");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(intParameter.check("0").code, "error");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(intParameter.check("2000").code, "error");
    });

    it('specificCheck() avec bonne valeur', function() {
      assert.equal(intParameter.specificCheck("2").code, "ok");
    });

    it('specificCheck() avec autre bonne valeur', function() {
      assert.equal(intParameter.specificCheck("10").code, "ok");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(intParameter.specificCheck("test").code, "error");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(intParameter.specificCheck(0).code, "error");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(intParameter.specificCheck(2000).code, "error");
    });

  });

  describe('Test des conversions', function() {

    it('convertIntoTable()', function() {
      assert.equal(intParameter.convertIntoTable("data|data2", [], {}), true);
    });

    it('specificConvertion()', function() {
      assert.equal(intParameter.specificConvertion(1), 1);
    });

  });


});
