const assert = require('assert');
const ResourceParameter = require('../../../../src/js/parameters/resourceParameter');
const logManager = require('../../../unit/mocha/logManager');

describe('Test de la classe RouteRequest', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let resourceParameter = new ResourceParameter({explode: true, min: 0, max: 5, style: "pipeDelimited"});

  describe('Test du constructeur et des getters', function() {

    it('Get Parameter', function() {
      assert.equal(resourceParameter.serviceParameter.style, "pipeDelimited");
    });

  });

  describe('Test de load', function() {

    it('Load', function() {
      assert.equal(resourceParameter.load("toto"), false);
    });

  });

  describe('Test des check', function() {

    it('Check', function() {
      assert.equal(resourceParameter.check("toto", {}).code, "error");
    });

    it('Specific check', function() {
      assert.equal(resourceParameter.specificCheck("toto", {}).code, "error");
    });

  });

  describe('Test des conversions', function() {

    it('Convert into table OK', function() {
      assert.equal(resourceParameter.convertIntoTable(["toto", "tata"], [], {}), false);
    });

    it('Convert into table OK not exploded', function() {
      assert.equal(resourceParameterNotExplode.convertIntoTable("toto|tata", [], {}), true);
    });

    it('Specific Convertion', function() {
      assert.equal(resourceParameter.specificConvertion("toto", {}), null);
    });

  });


});
