const assert = require('assert');
const Parameter = require('../../../../src/js/parameters/parameter');
const EnumParameter = require('../../../../src/js/parameters/enumParameter');
const logManager = require('../logManager');

describe('Test de la classe EnumParameter', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let parameterConf = {"id": "resource","values": ["data","data2"]};
  let parameter = new Parameter("resource","enumeration","resource","resource","true","false");
  let enumParameter = new EnumParameter(parameter);

  describe('Test du constructeur et des getters', function() {

    it('Get serviceParameter', function() {
      assert.equal(enumParameter.serviceParameter.style, "pipeDelimited");
    });

    it('Get defaultValueContent', function() {
      assert.equal(enumParameter.defaultValueContent, "");
    });

    it('Get values', function() {
      assert.deepEqual(enumParameter.values, new Array());
    });

  });

  describe('Test du chargement', function() {

    it('load()', function() {
      assert.equal(enumParameter.load(parameterConf), true);
    });

  });

  describe('Test des vérifications', function() {

    it('check() avec bonne valeur', function() {
      assert.equal(enumParameter.check("data").code, "ok");
    });

    it('check() avec autre bonne valeur', function() {
      assert.equal(enumParameter.check("data2").code, "ok");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(enumParameter.check("test").code, "error");
    });

    it('specificCheck() avec bonne valeur', function() {
      assert.equal(enumParameter.specificCheck("data").code, "ok");
    });

    it('specificCheck() avec autre bonne valeur', function() {
      assert.equal(enumParameter.specificCheck("data2").code, "ok");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(enumParameter.specificCheck("test").code, "error");
    });

  });

  describe('Test des conversions', function() {

    it('convertIntoTable()', function() {
      assert.equal(enumParameter.convertIntoTable("data|data2", [], {}), true);
    });

    it('specificConvertion()', function() {
      assert.equal(enumParameter.specificConvertion("data"), "data");
    });

  });


});
