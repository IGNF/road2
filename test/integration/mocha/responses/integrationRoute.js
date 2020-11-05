const assert = require('assert');
const Route = require('../../../../src/js/responses/route');
const Portion = require('../../../../src/js/responses/portion');
const Step = require('../../../../src/js/responses/step');
const logManager = require('../logManager');

describe('Test de la classe Route', function() {

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
    portion.steps = stepsTable;
    let portionsTable = [portion];
    let route = new Route("cf|~Fssht@tAgLFiNqJTaEuFiEpEgIxCsLdDwDw@oIac@mAg@cKkTBiBeAaByCqSkHc[mGaQHiGgB_@wL{[_FvBsDmEuEeB{RjGk@e@Z{B");

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
