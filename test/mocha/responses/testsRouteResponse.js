const assert = require('assert');
const RouteResponse = require('../../../src/js/responses/routeResponse');
const Route = require('../../../src/js/responses/route');
const Portion = require('../../../src/js/responses/portion');
const Step = require('../../../src/js/responses/step');
const logManager = require('../logManager');

describe('Test de la classe RouteResponse', function() {

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
    route.portions = portionsTable;
    let routesTable = [route];

    let resource = "mon-id";
    let profile = "car";
    let optimization = "fastest";
    let routeResponse = new RouteResponse(resource, start, end, profile, optimization);


    it('Get start', function() {
      assert.equal(routeResponse.start, "8.732901,41.928821");
    });

    it('Set start', function() {
      routeResponse.start = "8.732901,41.928830";
      assert.equal(routeResponse.start, "8.732901,41.928830");
    });

    it('Get end', function() {
      assert.equal(routeResponse.end, "8.763831,41.953897");
    });

    it('Set end', function() {
      routeResponse.end = "8.763831,41.953880";
      assert.equal(routeResponse.end, "8.763831,41.953880");
    });

    it('Get profile', function() {
      assert.equal(routeResponse.profile, "car");
    });

    it('Set profile', function() {
      routeResponse.profile = "bike";
      assert.equal(routeResponse.profile, "bike");
    });

    it('Get optimization', function() {
      assert.equal(routeResponse.optimization, "fastest");
    });

    it('Set optimization', function() {
      routeResponse.optimization = "shortest";
      assert.equal(routeResponse.optimization, "shortest");
    });

    it('Set routes', function() {
      routeResponse.routes = routesTable;
      assert.deepEqual(routeResponse.routes, routesTable);
    });


  });

});
