const assert = require('assert');
const osrmSource = require('../../../src/js/sources/osrmSource');
const RouteRequest = require('../../../src/js/requests/routeRequest');
const logManager = require('../logManager');

describe('Test de la classe osrmSource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let sourceDescription = {
    "id": "corse-car-fastest",
    "type": "osrm",
    "storage": {
      "file": "/home/docker/data/corse-latest.osrm"
    },
    "cost": {
      "profile": "car",
      "optimization": "fastest",
      "compute": {
        "storage": {
          "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.20.0/profiles/car.lua"
        }
      }
    }
  };

  let otherSourceDescription = {
    "id": "corse-car-fastest-2",
    "type": "osrm",
    "storage": {
      "file": "/home/docker/data/corse-latest.osrm"
    },
    "cost": {
      "profile": "car",
      "optimization": "fastest",
      "compute": {
        "storage": {
          "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.20.0/profiles/car-2.lua"
        }
      }
    }
  };

  let source = new osrmSource(sourceDescription);

  describe('Test du constructeur et des getters', function() {

    it('Get Source id', function() {
      assert.equal(source.id, "corse-car-fastest");
    });

    it('Get Source type', function() {
      assert.equal(source.type, "osrm");
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
      source.connect();
      const routeResponse = await source.computeRequest(routeRequest);
      assert.equal(routeResponse.resource, "resource-test");
    });

  });

});
