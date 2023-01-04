const assert = require('assert');
const Parameter = require('../../../../src/js/parameters/parameter');
const ResourceParameter = require('../../../../src/js/parameters/resourceParameter');
const logManager = require('../../../unit/mocha/logManager');

describe('Test de la classe RresourceParameter', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let parameter = new Parameter("intermediates","point","intermediates","Points intermédiaires","true","false");
  let resourceParameter = new ResourceParameter(parameter);

  describe('Test du constructeur et des getters', function() {

    it('Get serviceParameter', function() {
      assert.equal(resourceParameter.serviceParameter.style, "pipeDelimited");
    });

  });

  describe('Test du chargement', function() {

    // Dans cette classe, cette fonction renvoit toujours false car elle est réellement implémentée dans les classes filles
    it('load()', function() {
      assert.equal(resourceParameter.load({"id":"test"}), false);
    });

  });

  describe('Test des vérifications', function() {

    // Dans cette classe, cette fonction renvoit toujours une erreur car elle fait appel à specificCheck() qui est réellement implémentée dans les classes filles
    it('check() avec options', function() {
      assert.equal(resourceParameter.check("toto", {"test":true}).code, "error");
    });

    it('check() avec options vides', function() {
      assert.equal(resourceParameter.check("toto", {}).code, "error");
    });

    it('check() sans options', function() {
      assert.equal(resourceParameter.check("toto").code, "error");
    });

    // Dans cette classe, cette fonction renvoit toujours une erreur car elle est réellement implémentée dans les classes filles
    it('specificCheck() avec options', function() {
      assert.equal(resourceParameter.specificCheck("toto", {"test":true}).code, "error");
    });

    it('specificCheck() avec options vides', function() {
      assert.equal(resourceParameter.specificCheck("toto", {}).code, "error");
    });

    it('specificCheck() sans options', function() {
      assert.equal(resourceParameter.specificCheck("toto").code, "error");
    });

  });

  describe('Test des conversions', function() {

    // Dans cette classe, cette fonction renvoit toujours une erreur car elle fait appel à specificConversion() qui est réellement implémentée dans les classes filles
    it('convertIntoTable() avec des paramètres bons', function() {
      assert.equal(resourceParameter.convertIntoTable("test", [], {}), false);
    });

    // Dans cette classe, cette fonction renvoit toujours une erreur car elle est réellement implémentée dans les classes filles
    it('specificConvertion() avec options', function() {
      assert.equal(resourceParameter.specificConvertion("toto", {"test":true}), null);
    });

    it('specificConvertion() avec options vides', function() {
      assert.equal(resourceParameter.specificConvertion("toto", {}), null);
    });

    it('specificConvertion() sans options', function() {
      assert.equal(resourceParameter.specificConvertion("toto"), null);
    });

  });


});
