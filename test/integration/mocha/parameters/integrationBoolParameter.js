const assert = require('assert');
const Parameter = require('../../../../src/js/parameters/parameter');
const BoolParameter = require('../../../../src/js/parameters/boolParameter');
const logManager = require('../logManager');

describe('Test de la classe BoolParameter', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let parameterConf = {"id": "bbox", "defaultValueContent": "true"};
  let parameter = new Parameter("bbox","boolean","bbox","bbox","false","true");
  let boolParameter = new BoolParameter(parameter);

  describe('Test du constructeur et des getters', function() {

    it('Get serviceParameter', function() {
      assert.equal(boolParameter.serviceParameter.style, "pipeDelimited");
    });

    it('Get defaultValueContent', function() {
      assert.equal(boolParameter.defaultValueContent, null);
    });

    it('Get values', function() {
      assert.deepEqual(boolParameter.values, [true, false]);
    });

  });

  describe('Test du chargement', function() {

    it('load()', function() {
      assert.equal(boolParameter.load(parameterConf), true);
    });

  });

  describe('Test des vérifications', function() {

    it('check() avec bonne valeur', function() {
      assert.equal(boolParameter.check("true").code, "ok");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(boolParameter.check("toto").code, "error");
    });

    it('specificCheck() avec bonne valeur', function() {
      assert.equal(boolParameter.specificCheck("true").code, "ok");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(boolParameter.specificCheck("toto").code, "error");
    });

  });

  describe('Test des conversions', function() {

    it('convertIntoTable() avec des paramètres bons', function() {
      assert.equal(boolParameter.convertIntoTable("true|false", [], {}), true);
    });

    it('specificConvertion() avec des bons paramètres', function() {
      assert.equal(boolParameter.specificConvertion("true"), true);
    });

    it('specificConvertion() avec des bons paramètres', function() {
      assert.equal(boolParameter.specificConvertion("false"), false);
    });

    it('specificConvertion() avec des mauvais paramètres', function() {
      assert.equal(boolParameter.specificConvertion("test"), null);
    });

  });


});
