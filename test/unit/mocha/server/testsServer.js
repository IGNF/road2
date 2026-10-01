const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const Server = require('../../../../src/js/server/server');
const logManager = require('../logManager');
const express = require('express');

// Les certificats sont générés à la volée pour que le test soit indépendant de l'environnement (docker secrets)
const certDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'road2-server-test-'));
const keyPath = path.join(certDirectory, 'server.key');
const certPath = path.join(certDirectory, 'server.cert');
execFileSync('openssl', [
  'req', '-x509', '-newkey', 'rsa:2048', '-nodes',
  '-keyout', keyPath, '-out', certPath,
  '-days', '1', '-subj', '/CN=localhost'
], { stdio: 'ignore' });

describe('Test de la classe Server', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  after(function() {
    fs.rmSync(certDirectory, { recursive: true, force: true });
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
      "port": "8444",
      "options": {
        "key": keyPath,
        "cert": certPath
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
