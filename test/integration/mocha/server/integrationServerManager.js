const assert = require('assert');
const ServerManager = require('../../../../src/js/server/serverManager');
const logManager = require('../logManager');
const path = require('path');
const fs = require('fs');
const express = require('express');

describe('Test de la classe ServerManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let file = path.resolve(__dirname, "../config/road2.json");
  let configuration = JSON.parse(fs.readFileSync(file));
  configuration = configuration.administration.network.server;

  let app = express();

  let serverManager = new ServerManager();

  describe('Test du constructeur et des attributs', function() {

    it('Get _loadedServerId', function() {
      assert.deepEqual(serverManager._loadedServerId, new Array());
    });

    it('Get _checkedServerId', function() {
      assert.deepEqual(serverManager._checkedServerId, new Array());
    });

    it('Get _serverCatalog', function() {
      assert.deepEqual(serverManager._serverCatalog, {});
    });

    it('Get _loadedServerDescription', function() {
      assert.deepEqual(serverManager._loadedServerDescription, {});
    });

    it('Get _checkedServerDescription', function() {
      assert.deepEqual(serverManager._checkedServerDescription, {});
    });

  });

  describe('Cycle de vérification des configurations', function() {

    it('checkServerConfiguration()', function() {
      assert.equal(serverManager.checkServerConfiguration(configuration), true);
    });

    it('saveServerConfiguration()', function() {
      serverManager.saveServerConfiguration(configuration);
      let refObject = {};
      refObject[configuration.id] = configuration;
      assert.deepEqual(serverManager._checkedServerDescription, refObject);
    });

    it('flushCheckedServer()', function() {
      serverManager.flushCheckedServer();
      assert.deepEqual(serverManager._checkedServerDescription, {});
    });

  });

  describe('Chargement des configurations', function() {

    it('loadServerConfiguration()', function() {
      assert.equal(serverManager.loadServerConfiguration(app, configuration), true);
    });

  });

  describe('Cycle de vie des serveurs gérés', function() {

    it('startAllServers()', function() {
      assert.equal(serverManager.startAllServers(), true);
    });

    it('stopAllServer()', function() {
      assert.equal(serverManager.stopAllServer(), true);
    });

  });

});
