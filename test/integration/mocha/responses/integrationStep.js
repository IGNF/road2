const assert = require('assert');
const Step = require('../../../../src/js/responses/step');
const logManager = require('../logManager');

describe('Test de la classe Step', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters/setters', function() {

    let step = new Step("{ba_G}tnt@");

    it('Get Geometry', function() {
      assert.equal(step.geometry, "{ba_G}tnt@");
    });

    it('Set Geometry', function() {
      step.geometry = "kba_G{ont@QIQIGQA]DUH[Lk@";
      assert.equal(step.geometry, "kba_G{ont@QIQIGQA]DUH[Lk@");
    });

  });

});
