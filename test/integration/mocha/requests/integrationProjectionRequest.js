const assert = require('assert');
const ProjectionRequest = require('../../../../src/js/requests/projectionRequest');
const logManager = require('../logManager');

describe('Test de la classe ProjectionRequest', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let request = new ProjectionRequest("test", "EPSG:4326");

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(request.type, "projectionRequest");
    });

    it('Get service', function() {
      assert.equal(request.service, "test");
    });

    it('Set service', function() {
        request.service = "main";
        assert.equal(request.service, "main");
      });
    

    it('Get projection', function() {
      assert.equal(request.projection, "EPSG:4326");
    });

    it('Set service', function() {
        request.projection = "EPSG:2154";
        assert.equal(request.projection, "EPSG:2154");
      });

  });

});
