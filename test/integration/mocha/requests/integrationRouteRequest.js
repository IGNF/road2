const assert = require('assert');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
const logManager = require('../../../unit/mocha/logManager');

describe('Test de la classe RouteRequest', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let request = new RouteRequest("corse-osm", {lon: 8.732901, lat: 41.928821}, {lon: 8.732901, lat: 41.953932}, "car", "fastest");

  describe('Test du constructeur et des getters', function() {

    it('Get Operation', function() {
      assert.equal(request.operation, "route");
    });

    it('Get Resource', function() {
      assert.equal(request.resource, "corse-osm");
    });

    it('Get Type', function() {
      assert.equal(request.type, "routeRequest");
    });

    it('Get Start', function() {
      assert.deepEqual(request.start, {lon: 8.732901, lat: 41.928821});
    });

    it('Get End', function() {
      assert.deepEqual(request.end, {lon: 8.732901, lat: 41.953932});
    });

    it('Get Profile', function() {
      assert.equal(request.profile, "car");
    });

    it('Get Optimization', function() {
      assert.equal(request.optimization, "fastest");
    });

    it('Get computeSteps', function() {
      assert.equal(request.computeSteps, true);
    });

    it('Get Intermediates', function() {
      assert.deepEqual(request.intermediates, new Array());
    });

  });

  describe('Test des setters', function() {

    it('Set Operation', function() {
      request.operation = "nearest";
      assert.equal(request.operation, "nearest");
    });

    it('Set Resource', function() {
      request.resource = "corse-osm-2";
      assert.equal(request.resource, "corse-osm-2");
    });

    it('Set Type', function() {
      request.type = "otherRequest";
      assert.equal(request.type, "otherRequest");
    });

    it('Set Start', function() {
      request.start = {lon: 8.732902, lat: 41.928820};
      assert.deepEqual(request.start, {lon: 8.732902, lat: 41.928820});
    });

    it('Set End', function() {
      request.end = {lon: 8.732901, lat: 41.953935};
      assert.deepEqual(request.end, {lon: 8.732901, lat: 41.953935});
    });

    it('Set Profile', function() {
      request.profile = "bike";
      assert.equal(request.profile, "bike");
    });

    it('Set Optimization', function() {
      request.optimization = "shortest";
      assert.equal(request.optimization, "shortest");
    });

    it('Set computeSteps', function() {
      request.computeSteps = false;
      assert.equal(request.computeSteps, false);
    });

    it('Set Intermediates', function() {
      request.intermediates = [{lon: 8.732902, lat: 41.953932},{lon: 8.732801, lat: 41.953835}];
      assert.deepEqual(request.intermediates, [{lon: 8.732902, lat: 41.953932},{lon: 8.732801, lat: 41.953835}]);
    });

  });


});
