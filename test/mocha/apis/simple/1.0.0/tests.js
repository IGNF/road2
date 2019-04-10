const assert = require('assert');
const path = require('path');
const fs = require('fs');
const logManager = require('../../../logManager');
const Service = require('../../../../../src/js/service/service');
const RouteRequest = require('../../../../../src/js/requests/routeRequest');
const express = require('express');
const router = require('../../../../../src/js/apis/simple/1.0.0/index');

describe('Test de l\'api simple 1.0.0', function() {

  let service = new Service();
  let httpConf;
  let configuration;

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();

    // Chargement de la configuration pour les tests
    let file = path.resolve(__dirname,'../../../config/road2.json');
    configuration = JSON.parse(fs.readFileSync(file));

    // Chargement de la configuration pour les requêtes http
    logsConf = logManager.getLogsConf();
    service.logConfiguration = logsConf;

    service.checkAndSaveGlobalConfiguration(configuration);
    service.loadResources();
    service.loadSources();
    // service.createServer("../apis/", "");

  });

  describe('Test de la fonction checkRouteParameters()', function() {

    // Création des paramètres utilisateur
    let parameters = {};
    parameters.resource = "corse-osm";
    parameters.start = "8.732901,41.928821";
    parameters.end = "8.76385,41.953932";

    // Création d'un objet routeRequest
    let routeRequest = new RouteRequest("corse-osm", {lon: 8.732901, lat: 41.928821}, {lon: 8.76385, lat: 41.953932}, "car", "fastest");

    it('checkRouteParameters() avec les bons parametres', function() {
      assert.deepEqual(router.checkRouteParameters(parameters, service), routeRequest);
    });

  });

  // after(function(done) {
  //   service.stopServer(done);
  // });

});
