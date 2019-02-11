var assert = require('assert');
var Service = require('../../../src/js/service/service');
var logManager = require('../logManager');
const nconf = require('nconf');
const path = require('path');

describe('Test de la classe Service', function() {

  var service = new Service();

  before(function() {

    // runs before all tests in this block
    logManager.manageLogs();

    // Chargement de la configuration pour les tests
    var file = path.resolve(__dirname,'../config/road2.json');
    nconf.file({ file: file });

    // Chargement de la configuration pour les requêtes http
    var httpConf = logManager.getHttpConf();
    nconf.set("httpConf",httpConf);

  });

  describe('Test de checkGlobalConfiguration()', function() {

    it('checkGlobalConfiguration() return true avec une configuration correcte', function() {
      assert.equal(service.checkGlobalConfiguration(), true);
    });

  });

  describe('Test de loadResources()', function() {

    it('loadResources() return true avec une configuration correcte', function() {
      assert.equal(service.loadResources(nconf.get("application:resources:directory")), true);
    });

  });

  describe('Test de loadSources()', function() {

    it('loadSources() return true avec une configuration correcte', function() {
      assert.equal(service.loadSources(), true);
    });

  });

  describe('Test de createServer() et stopServer()', function() {

    it('createServer() return true avec une configuration correcte', function() {
      assert.equal(service.createServer(nconf.get("ROAD2_PORT"), nconf.get("ROAD2_HOST"), "../apis/", ""), true);
    });

    after(function(done) {
      service.stopServer(done);
    });

  });

});
