const assert = require('assert');
const Service = require('../../../../src/js/service/service');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
const logManager = require('../logManager');

const sinon = require('sinon');

describe('Test de la classe Service', function() {

  let service = new Service();

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
    service.logConfiguration = logManager.getLogsConf();
  });

  describe('Test des getters/setters', function() {

    it('Get configuration', function() {
      assert.deepEqual(service.configuration, {});
    });

    it('Get logConfiguration', function() {
      assert.deepEqual(service.logConfiguration, logManager.getLogsConf());
    });

    it('Get apisManager', function() {
      assert.notEqual(service.apisManager, undefined);
    });

  });

  describe('Test de checkServiceConfiguration()', function() {

    it('checkServiceConfiguration() sans objet application', async function() {
      assert.equal(await service.checkServiceConfiguration({}, ""), false);
    });

    it('checkServiceConfiguration() sans application.name', async function() {
      assert.equal(await service.checkServiceConfiguration({"application": {}}, ""), false);
    });

    it('checkServiceConfiguration() sans application.title', async function() {
      let configuration = {"application": {"name": "Road2"}};
      assert.equal(await service.checkServiceConfiguration(configuration, ""), false);
    });

    it('checkServiceConfiguration() sans application.description', async function() {
      let configuration = {"application": {"name": "Road2", "title": "Service de calcul d'itinéraire"}};
      assert.equal(await service.checkServiceConfiguration(configuration, ""), false);
    });

  });

  describe('Test de la gestion des ressources', function() {

    let resource = { id: "corse-osm" };

    before(function() {
      service._resourceManager.resource["corse-osm"] = resource;
    });

    it('verifyResourceExistenceById() avec une ressource chargée', function() {
      assert.equal(service.verifyResourceExistenceById("corse-osm"), true);
    });

    it('verifyResourceExistenceById() avec une ressource inconnue', function() {
      assert.equal(service.verifyResourceExistenceById("inconnue"), false);
    });

    it('getResourceById()', function() {
      assert.deepEqual(service.getResourceById("corse-osm"), resource);
    });

    it('getResources()', function() {
      assert.deepEqual(service.getResources(), {"corse-osm": resource});
    });

  });

  describe('Test de computeRequest()', function() {

    it('computeRequest() avec une requete correcte', function() {

      const request = new RouteRequest("corse-osm", {lon: 8.732901, lat: 41.928821}, {lon: 8.763831, lat: 41.953897}, "car", "fastest");
      const fakeRouteResponse = {"resource": "corse-osm"};

      service._resourceManager.resource["corse-osm"] = {
        getSourceIdFromRequest: sinon.stub().returns("sourcetest")
      };
      service._sourceManager.sources["sourcetest"] = {
        computeRequest: sinon.stub().returns(fakeRouteResponse)
      };

      assert.equal(service.computeRequest(request).resource, "corse-osm");

    });

  });

  describe('Test de stopServers()', function() {

    it('stopServers() return true quand les serveurs sont arrêtés', async function() {
      service._serverManager.stopAllServers = sinon.stub().resolves(true);
      assert.equal(await service.stopServers(), true);
    });

    it('stopServers() return false quand les serveurs ne sont pas arrêtés', async function() {
      service._serverManager.stopAllServers = sinon.stub().resolves(false);
      assert.equal(await service.stopServers(), false);
    });

  });

});
