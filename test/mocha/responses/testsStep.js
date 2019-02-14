var assert = require('assert');
var Step = require('../../../src/js/responses/step');
var logManager = require('../logManager');

describe('Test de la classe Step', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters/setters', function() {

    var step = new Step("{ba_G}tnt@");

    it('Get Geometry', function() {
      assert.equal(step.geometry, "{ba_G}tnt@");
    });

    it('Set Geometry', function() {
      step.geometry = "kba_G{ont@QIQIGQA]DUH[Lk@";
      assert.equal(step.geometry, "kba_G{ont@QIQIGQA]DUH[Lk@");
    });

  });

});
