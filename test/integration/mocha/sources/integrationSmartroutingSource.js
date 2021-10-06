const assert = require('assert');
const smartroutingSource = require('../../../../src/js/sources/smartroutingSource');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
const logManager = require('../logManager');

const sinon = require('sinon');

describe('Test de la classe smartroutingSource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let sourceDescription = {
    "id": "test-smartrouting",
    "type": "smartrouting",
    "storage": {
      "url" : "https://wxs.ign.fr/calcul"
    }
  };

  let source = new smartroutingSource(sourceDescription);

  describe('Test du constructeur et des getters', function() {

    it('Get Source id', function() {
      assert.equal(source.id, "test-smartrouting");
    });

    it('Get Source type', function() {
      assert.equal(source.type, "smartrouting");
    });

    it('Get Source connected', function() {
      assert.equal(source.connected, false);
    });

    it('Get Source configuration', function() {
      assert.deepEqual(source.configuration, sourceDescription);
    });

  });

  describe('Test de connect()', function() {

    it('Connect()', async function() {
      await source.connect();
    });

  });

  describe('Test de disconnect()', function() {

    it('Disconnect()', async function() {
      await source.disconnect();
    });

  });

  describe('Test de computeRequest() et writeRouteResponse()', function() {
    this.timeout(10000);

    let resource = "resource-test";
    let start = {x: 8.732901, y: 41.928821};
    let end = {x: 8.76385, y: 41.953932};
    let profile = "car";
    let optimization = "fastest";
    let routeRequest = new RouteRequest(resource, start, end, profile, optimization);

    it('computeRequest() should return a routeResponse', async function() {
      const routeResponse = await source.computeRequest(routeRequest);
      assert.equal(routeResponse.resource, resource);
    });

  });

});
