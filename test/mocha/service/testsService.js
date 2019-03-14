var assert = require('assert');
var Service = require('../../../src/js/service/service');
var RouteRequest = require('../../../src/js/requests/routeRequest');
var logManager = require('../logManager');
const path = require('path');
const fs = require('fs');

describe('Test de la classe Service', function() {

  var service = new Service();
  var httpConf;
  var configuration;

  before(function() {

    // runs before all tests in this block
    logManager.manageLogs();

    // Chargement de la configuration pour les tests
    var file = path.resolve(__dirname,'../config/road2.json');
    configuration = JSON.parse(fs.readFileSync(file));

    // Chargement de la configuration pour les requêtes http
    logsConf = logManager.getLogsConf();
    service.logConfiguration = logsConf;

  });

  describe('Test de checkAndSaveGlobalConfiguration()', function() {

    it('checkAndSaveGlobalConfiguration() return true avec une configuration correcte', function() {
      assert.equal(service.checkAndSaveGlobalConfiguration(configuration), true);
    });

  });

  describe('Test de loadResources()', function() {

    it('loadResources() return true avec une configuration correcte', function() {
      assert.equal(service.loadResources(), true);
    });

  });

  describe('Test de loadSources()', function() {

    it('loadSources() return true avec une configuration correcte', function() {
      assert.equal(service.loadSources(), true);
    });

  });

  describe('Test de createServer() et stopServer()', function() {

    it('createServer() return true avec une configuration correcte', function() {
      assert.equal(service.createServer("../apis/", ""), true);
    });

    after(function(done) {
      service.stopServer(done);
    });

  });

  describe('Test de computeRequest()', function() {

    before(function() {
      service.createServer("../apis/", "");
    });

    it('computeRequest() avec une requete correcte', function(done) {
      var request = new RouteRequest("corse-osm", {lon: 8.732901, lat: 41.928821}, {lon: 8.732901, lat: 41.953932}, "car", "fastest");
      service.computeRequest(request, done);
    });

    after(function(done) {
      service.stopServer(done);
    });

  });

});
