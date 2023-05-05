const assert = require('assert');
const Parameter = require('../../../../src/js/parameters/parameter');
const FloatParameter = require('../../../../src/js/parameters/floatParameter');
const logManager = require('../logManager');

describe('Test de la classe FloatParameter', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let parameterConf = {"id": "costValue","values": {"min": 100,"max": 20000}};
  let parameter = new Parameter("costValue","float","costValue","costValue","true","false");
  let floatParameter = new FloatParameter(parameter);

  describe('Test du constructeur et des getters', function() {

    it('Get serviceParameter', function() {
      assert.equal(floatParameter.serviceParameter.style, "pipeDelimited");
    });

    it('Get defaultValueContent', function() {
      assert.equal(floatParameter.defaultValueContent, 0);
    });

    it('Get values', function() {
      assert.deepEqual(floatParameter.values, {min:null,max:null});
    });

  });

  describe('Test du chargement', function() {

    it('load()', function() {
      assert.equal(floatParameter.load(parameterConf), true);
    });

    it('Get defaultValueContent', function() {
      assert.equal(floatParameter.defaultValueContent, 0);
    });

    it('Get values', function() {
      assert.deepEqual(floatParameter.values, {min:100,max:20000});
    });

  });

  describe('Test des vérifications', function() {

    it('check() avec bonne valeur', function() {
      assert.equal(floatParameter.check("200").code, "ok");
    });

    it('check() avec autre bonne valeur', function() {
      assert.equal(floatParameter.check("10000").code, "ok");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(floatParameter.check("test").code, "error");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(floatParameter.check(1).code, "error");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(floatParameter.check("1").code, "error");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(floatParameter.check("300000").code, "error");
    });

    it('specificCheck() avec bonne valeur', function() {
      assert.equal(floatParameter.specificCheck("200").code, "ok");
    });

    it('specificCheck() avec autre bonne valeur', function() {
      assert.equal(floatParameter.specificCheck("10000").code, "ok");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(floatParameter.specificCheck("test").code, "error");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(floatParameter.specificCheck(1).code, "error");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(floatParameter.specificCheck(300000).code, "error");
    });

  });

  describe('Test des conversions', function() {

    it('convertIntoTable()', function() {
      assert.equal(floatParameter.convertIntoTable("data|data2", [], {}), true);
    });

    it('specificConvertion()', function() {
      assert.equal(floatParameter.specificConvertion(1.321), 1.321);
    });

  });


});
