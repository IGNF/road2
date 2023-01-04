const assert = require('assert');
const NearestRequest = require('../../../../src/js/requests/nearestRequest');
const Point = require('../../../../src/js/geometry/point');
const logManager = require('../../../unit/mocha/logManager');

describe('Test de la classe NearestRequest', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let point = new Point(2,48,"EPSG:4326");
  let request = new NearestRequest("data", point);

  describe('Test du constructeur et des getters', function() {

    it('Get Operation', function() {
      assert.equal(request.operation, "nearest");
    });

    it('Get Resource', function() {
      assert.equal(request.resource, "data");
    });

    it('Get Type', function() {
      assert.equal(request.type, "nearestRequest");
    });

    it('Get coordinates', function() {
      assert.deepEqual(request.coordinates, point);
    });

    it('Get number', function() {
      assert.equal(request.number, 1);
    });

  });

  describe('Test des setters', function() {

    it('Set Operation', function() {
      request.operation = "nearest";
      assert.equal(request.operation, "nearest");
    });

    it('Set Resource', function() {
      request.resource = "data";
      assert.equal(request.resource, "data");
    });

    it('Set Type ne change rien', function() {
      request.type = "otherRequest";
      assert.equal(request.type, "nearestRequest");
    });

    it('Set Start', function() {
      let newPoint = new Point(2.1,48.2,"EPSG:4326");
      request.coordinates = newPoint;
      assert.deepEqual(request.coordinates, newPoint);
    });

    it('Set number', function() {
      request.number = 2;
      assert.deepEqual(request.number, 2);
    });

  });

});
