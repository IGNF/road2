var assert = require('assert');
var osrmSource = require('../../../src/js/sources/osrmSource');
var RouteRequest = require('../../../src/js/requests/routeRequest');
var logManager = require('../logManager');

describe('Test de la classe osrmSource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  var sourceDescription = {
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

  var otherSourceDescription = {
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
          "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.20.0/profiles/car.lua"
        }
      }
    }
  };

  var source = new osrmSource(sourceDescription);

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
      assert.equal(source.configuration, otherSourceDescription);
    });

  });

  describe('Test de connect()', function() {

    it('Connect()', function() {
      assert.equal(source.connect(), true);
    });

  });

  describe('Test de disconnect()', function() {

    it('Disconnect()', function() {
      assert.equal(source.disconnect(), true);
    });

  });

  describe('Test de computeRequest() et writeRouteResponse()', function() {

    var resource = "resource-test";
    var start = {lon: 8.732901, lat: 41.928821};
    var end = {lon: 8.76385, lat: 41.953932};
    var profile = "car-test";
    var optimization = "fastest-test";
    var routeRequest = new RouteRequest(resource, start, end, profile, optimization);

    it('computeRequest() should return a routeResponse', function(done) {
      source.connect();
      source.computeRequest(routeRequest, done);
    });

  });

});