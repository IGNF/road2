const assert = require('assert');
const ResourceParameter = require('../../../../src/js/parameters/resourceParameter');
const logManager = require('../../../unit/mocha/logManager');

describe('Test de la classe RouteRequest', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let resourceParameterExplode = new ResourceParameter({explode: true, min: 0, max: 5, style: "pipeDelimited"});
  let resourceParameterNotExplode = new ResourceParameter({explode: false, min: 0, max: 5, style: "pipeDelimited"});

  describe('Test du constructeur et des getters', function() {

    it('Get Parameter', function() {
      assert.equal(resourceParameterExplode.parameter, "corse-osm");
    });

  });

  describe('Test de load', function() {

    it('Load', function() {
      assert.equal(resourceParameterExplode.load("toto"), false);
    });

  });

  describe('Test des check', function() {

    it('Check good parameter', function() {
      assert.equal(resourceParameterExplode.check("toto", {}).code, "ok");
    });

    it('Check bad parameter', function() {
      assert.equal(resourceParameterExplode.check("toto", {}).code, "error");
    });

    it('Check other bad parameter', function() {
      assert.equal(resourceParameterExplode.check("toto", {}).code, "error");
    });

    it('Specific check', function() {
      assert.equal(resourceParameterExplode.specificCheck("toto", {}).code, "error");
    });

  });

  describe('Test des conversions', function() {

    it('Convert into table OK', function() {
      assert.equal(resourceParameterExplode.convertIntoTable(["toto", "tata"], [], {}), true);
    });

    it('Convert into table OK not exploded', function() {
      assert.equal(resourceParameterNotExplode.convertIntoTable("toto|tata", [], {}), true);
    });

    it('Convert into table NOK', function() {
      assert.equal(resourceParameterExplode.convertIntoTable("toto", [], {}), false);
    });

    it('Convert into table other NOK', function() {
      assert.equal(resourceParameterExplode.convertIntoTable("toto", [], {}), false);
    });

    it('Specific Convertion', function() {
      assert.equal(resourceParameterExplode.specificConvertion("toto", {}), null);
    });

  });


});
