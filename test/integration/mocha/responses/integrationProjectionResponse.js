const assert = require('assert');
const ProjectionResponse = require('../../../../src/js/responses/projectionResponse');
const logManager = require('../logManager');

describe('Test de la classe ProjectionResponse', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let response = new ProjectionResponse("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");

  describe('Test du constructeur et des getters/setters', function() {

    it('Get type', function() {
      assert.equal(response.type, "projectionResponse");
    });

    it('Get id', function() {
      assert.equal(response.id, "EPSG:4326");
    });

    it('Get parameters', function() {
        assert.equal(response.parameters, "+proj=longlat +datum=WGS84 +no_defs");
    });

  });

});
