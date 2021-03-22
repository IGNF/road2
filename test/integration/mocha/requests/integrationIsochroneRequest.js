const assert = require('assert');
const IsochroneRequest = require('../../../../src/js/requests/isochroneRequest');
const logManager = require('../../../unit/mocha/logManager');

describe('Test de la classe IsochroneRequest', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let request = new IsochroneRequest("corse-osm", {lon: 8.732901, lat: 41.928821}, "time", 100, "car", "departure", "EPSG:4326", "geojson", "s", "m");

  describe('Test du constructeur et des getters', function() {

    it('Get Operation', function() {
      assert.equal(request.operation, "isochrone");
    });

    it('Get Resource', function() {
      assert.equal(request.resource, "corse-osm");
    });

    it('Get Type', function() {
      assert.equal(request.type, "isochroneRequest");
    });

    it('Get point', function() {
      assert.deepEqual(request.point, {lon: 8.732901, lat: 41.928821});
    });

    it('Get Profile', function() {
      assert.equal(request.profile, "car");
    });

    it('Get costType', function() {
      assert.equal(request.costType, "time");
    });

    it('Get costValue', function() {
      assert.equal(request.costValue, 100);
    });

    it('Get direction', function() {
      assert.deepEqual(request.direction, "departure");
    });

    it('Get askedProjection', function() {
      assert.deepEqual(request.askedProjection, "EPSG:4326");
    });

    it('Get geometryFormat', function() {
      assert.deepEqual(request.geometryFormat, "geojson");
    });

    it('Get timeUnit', function() {
      assert.deepEqual(request.timeUnit, "s");
    });

    it('Get distanceUnit', function() {
      assert.deepEqual(request.distanceUnit, "m");
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

    it('Set point', function() {
      request.point = {lon: 8.732902, lat: 41.928820};
      assert.deepEqual(request.point, {lon: 8.732902, lat: 41.928820});
    });

    it('Set Profile', function() {
      request.profile = "bike";
      assert.equal(request.profile, "bike");
    });

    it('Set costType', function() {
      request.costType = "distance";
      assert.equal(request.costType, "distance");
    });

    it('Set costValue', function() {
      request.costValue = 200;
      assert.equal(request.costValue, 200);
    });

    it('Set direction', function() {
      request.direction = "arrival";
      assert.deepEqual(request.direction, "arrival");
    });

    it('Set askedProjection', function() {
      request.askedProjection = "EPSG:2154";
      assert.deepEqual(request.askedProjection, "EPSG:2154");
    });

    it('Set geometryFormat', function() {
      request.geometryFormat = "polyline";
      assert.deepEqual(request.geometryFormat, "polyline");
    });

    it('Set timeUnit', function() {
      request.timeUnit = "min";
      assert.deepEqual(request.timeUnit, "min");
    });

    it('Set distanceUnit', function() {
      request.distanceUnit = "km";
      assert.deepEqual(request.distanceUnit, "km");
    });


  });


});
