const assert = require('assert');
const Server = require('../../../../src/js/server/server');
const logManager = require('../logManager');
const express = require('express');

describe('Test de la classe Server', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let httpServer = {
      "id": "internalServer",
      "https": "false",
      "host": "0.0.0.0",
      "port": "8082"
    };

    let httpsServer = {
      "id": "externalServer",
      "https": "true",
      "host": "0.0.0.0",
      "port": "444",
      "options": {
        "key": "/run/secrets/key",
        "cert": "/run/secrets/cert"
      }
    };

    let app = express();

  describe('Test du server HTTP', function() {

    let server = new Server(httpServer.id, app, httpServer.host, httpServer.port, httpServer.https);

    it('Get Id', function() {
      assert.equal(server.id, httpServer.id);
    });

    it('Start()', async function() {
      let status = await server.start();
      assert.equal(status, true);
    });

    it('Stop()', async function() {
      let status = await server.stop();
      assert.equal(status, true);
    });

  });

  describe('Test du server HTTPS', function() {

    let server = new Server(httpsServer.id, app, httpsServer.host, httpsServer.port, httpsServer.https, httpsServer.options);

    it('Get Id', function() {
      assert.equal(server.id, httpsServer.id);
    });

    it('Start()', async function() {
      let status = await server.start();
      assert.equal(status, true);
    });

    it('Stop()', async function() {
      let status = await server.stop();
      assert.equal(status, true);
    });

  });

});
