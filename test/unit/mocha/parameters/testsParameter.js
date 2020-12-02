const assert = require('assert');
const Parameter = require('../../../../src/js/parameters/parameter');
const logManager = require('../logManager');
const sinon = require('sinon');

describe('Test de la classe Parameter', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let id = "start";
  let type = "point";
  let name = "Point de départ";
  let description = "Point de départ de l'itineraire";
  let required = "true";
  let defaultValue = "false";

  let serviceParameter = new Parameter(id, type,  name, description, required, defaultValue);

  describe('Test du constructeur et des getters', function() {

    it('Get id', function() {
      assert.equal(serviceParameter.id, id);
    });

    it('Get type', function() {
      assert.equal(serviceParameter.type, type);
    });

    it('Get name', function() {
      assert.equal(serviceParameter.name, name);
    });

    it('Get description', function() {
      assert.equal(serviceParameter.description, description);
    });

    it('Get required', function() {
      assert.equal(serviceParameter.required, required);
    });

    it('Get defaultValue', function() {
      assert.equal(serviceParameter.defaultValue, defaultValue);
    });

    it('Get example', function() {
      assert.equal(serviceParameter.example, "");
    });

    it('Get min', function() {
      assert.equal(serviceParameter.min, 1);
    });

    it('Get max', function() {
      assert.equal(serviceParameter.max, 1);
    });

    it('Get explode', function() {
      assert.equal(serviceParameter.explode, "false");
    });

    it('Get style', function() {
      assert.equal(serviceParameter.style, "pipeDelimited");
    });

    it('Set example', function() {
      serviceParameter.example = "1,2";
      assert.equal(serviceParameter.example, "1,2");
    });

    it('Set min', function() {
      serviceParameter.min = "3";
      assert.equal(serviceParameter.min, "3");
    });

    it('Set max', function() {
      serviceParameter.max = "10";
      assert.equal(serviceParameter.max, "10");
    });

    it('Set explode', function() {
      serviceParameter.explode = "true";
      assert.equal(serviceParameter.explode, "true");
    });

    it('Set style', function() {
      serviceParameter.style = "test";
      assert.equal(serviceParameter.style, "test");
    });

  });

});
