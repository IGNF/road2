const assert = require('assert');
const Portion = require('../../../../src/js/responses/portion');
const Step = require('../../../../src/js/responses/step');
const logManager = require('../../../unit/mocha/logManager');

describe('Test de la classe Portion', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des getters/setters', function() {

    let start = "8.732901,41.928821";
    let end = "8.763831,41.953897";
    let portion = new Portion(start, end);
    let step1 = new Step("{ba_G}tnt@");
    let step2 = new Step("kba_G{ont@QIQIGQA]DUH[Lk@");
    let stepsTable = [step1, step2];

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
