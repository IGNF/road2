const assert = require('assert');
const pgrSource = require('../../../src/js/sources/pgrSource');
const RouteRequest = require('../../../src/js/requests/routeRequest');
const logManager = require('../logManager');

describe('Test de la classe pgrSource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let sourceDescription = {
    "id": "test-car-fastest",
    "type": "pgr",
    "storage": {
      "costColumn": "cost_s_car",
      "rcostColumn": "reverse_cost_s_car"
    },
    "cost": {
      "profile": "car",
      "optimization": "fastest",
      "compute": {
        "storage": {
          "file": "/home/docker/route-graph-generator/io/costs_calculation_sample.json"
        }
      }
    }
  };

  let otherSourceDescription = {
    "id": "test-car-shortest",
    "type": "pgr",
    "storage": {
      "costColumn": "cost_m_car",
      "rcostColumn": "reverse_cost_m_car"
    },
    "cost": {
      "profile": "car",
      "optimization": "shortest",
      "compute": {
        "storage": {
          "file": "/home/docker/route-graph-generator/io/costs_calculation_sample.json"
        }
      }
    }
  };

  let source = new pgrSource(sourceDescription);

  describe('Test du constructeur et des getters', function() {

    it('Get Source id', function() {
      assert.equal(source.id, "test-car-fastest");
    });

    it('Get Source type', function() {
      assert.equal(source.type, "pgr");
    });

    it('Get Source connected', function() {
      assert.equal(source.connected, false);
    });

    it('Get Source configuration', function() {
      assert.deepEqual(source.configuration, sourceDescription);
    });

  });

  describe('Test des setters', function() {

    it('Set Source configuration', function() {
      source.configuration = otherSourceDescription;
      assert.deepEqual(source.configuration, otherSourceDescription);
    });

  });

  describe('Test de connect()', function() {

    it('Connect()', async function() {
      const sourceConnected = await source.connect();
      assert.equal(sourceConnected, true);
    });

  });

  describe('Test de disconnect()', function() {

    it('Disconnect()', async function() {
      const sourceDisonnected = await source.disconnect();
      assert.equal(sourceDisonnected, true);
    });

  });

  describe('Test de computeRequest() et writeRouteResponse()', function() {

    let resource = "resource-test";
    let start = {lon: 8.732901, lat: 41.928821};
    let end = {lon: 8.76385, lat: 41.953932};
    let profile = "car-test";
    let optimization = "fastest-test";
    let routeRequest = new RouteRequest(resource, start, end, profile, optimization);

    it('computeRequest() should return a routeResponse', async function() {
      await source.connect();
      const routeResponse = await source.computeRequest(routeRequest);
      assert.equal(routeResponse.resource, "resource-test");
    });

  });

});
