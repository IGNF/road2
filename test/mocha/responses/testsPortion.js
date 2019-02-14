var assert = require('assert');
var Portion = require('../../../src/js/responses/portion');
var Step = require('../../../src/js/responses/step');
var logManager = require('../logManager');

describe('Test de la classe Portion', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters/setters', function() {

    var start = "8.732901,41.928821";
    var end = "8.763831,41.953897";
    var portion = new Portion(start, end);
    var step1 = new Step("{ba_G}tnt@");
    var step2 = new Step("kba_G{ont@QIQIGQA]DUH[Lk@");
    var stepsTable = [step1, step2];

    it('Get Start', function() {
      assert.equal(portion.start, "8.732901,41.928821");
    });

    it('Set Start', function() {
      portion.start = "8.732901,41.828822";
      assert.equal(portion.start, "8.732901,41.828822");
    });

    it('Get End', function() {
      assert.equal(portion.end, "8.763831,41.953897");
    });

    it('Set End', function() {
      portion.end = "8.763831,41.953880";
      assert.equal(portion.end, "8.763831,41.953880");
    });

    it('Set Steps', function() {
      portion.steps = stepsTable;
      assert.deepEqual(portion.steps, stepsTable);
    });

  });

});
