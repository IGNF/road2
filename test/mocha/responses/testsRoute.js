var assert = require('assert');
var Route = require('../../../src/js/responses/route');
var Portion = require('../../../src/js/responses/portion');
var Step = require('../../../src/js/responses/step');
var logManager = require('../logManager');

describe('Test de la classe Route', function() {

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
    portion.steps = stepsTable;
    var portionsTable = [portion];
    var route = new Route("cf|~Fssht@tAgLFiNqJTaEuFiEpEgIxCsLdDwDw@oIac@mAg@cKkTBiBeAaByCqSkHc[mGaQHiGgB_@wL{[_FvBsDmEuEeB{RjGk@e@Z{B");

    it('Get Geometry', function() {
      assert.equal(route.geometry, "cf|~Fssht@tAgLFiNqJTaEuFiEpEgIxCsLdDwDw@oIac@mAg@cKkTBiBeAaByCqSkHc[mGaQHiGgB_@wL{[_FvBsDmEuEeB{RjGk@e@Z{B");
    });

    it('Set Geometry', function() {
      route.geometry = "cf|~Fssht@tAgLFiNqJTaEuFiEpEgIxCsLdDwDw@oIac@mAg@cKkTBiBeAaByCqSkHc[mGaQHiGgB_@wL{[_FvBsDmEuEeB{RjGk@e@^gC";
      assert.equal(route.geometry, "cf|~Fssht@tAgLFiNqJTaEuFiEpEgIxCsLdDwDw@oIac@mAg@cKkTBiBeAaByCqSkHc[mGaQHiGgB_@wL{[_FvBsDmEuEeB{RjGk@e@^gC");
    });

    it('Set Portions', function() {
      route.portions = portionsTable;
      assert.deepEqual(route.portions, portionsTable);
    });

  });

});
