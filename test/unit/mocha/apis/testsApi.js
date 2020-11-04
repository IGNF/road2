const assert = require('assert');
const Api = require('../../../../src/js/apis/api');
const logManager = require('../logManager');
const express = require('express');

describe('Test de la classe Api', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let apiId = "test-api";
  let apiVersion = "0.0.1";
  let apiUid = "api-"+apiId+"-"+apiVersion;
  let routerFile = "../../../test/unit/mocha/config/api/default.js";
  let initFile = "../../../test/unit/mocha/config/api/init.js";
  let updateFile = "../../../test/unit/mocha/config/api/update.js";
  let app = express();
  let route = "/default/0.0.1/"

  let api = new Api(apiId, apiVersion, routerFile);

  describe('Test du constructeur et des getters/setters', function() {

    it('Get id', function() {
      assert.equal(api.id, apiId);
    });

    it('Get version', function() {
        assert.equal(api.version, apiVersion);
    });

    it('Get uid', function() {
        assert.equal(api.uid, apiUid);
    });

    it('Get routerFile', function() {
        assert.equal(api.routerFile, routerFile);
    });

  });

  describe('Test de la gestion des init et update files', function() {

    it('Get initFile', function() {
        assert.equal(api.initFile, "");
    });

    it('Set initFile', function() {
        api.initFile = initFile;
        assert.equal(api.initFile, initFile);
    });

    it('Get updateFile', function() {
        assert.equal(api.updateFile, "");
    });

    it('Set updateFile', function() {
        api.updateFile = updateFile;
        assert.equal(api.updateFile, updateFile);
    });

  });

  describe('Test de initialize et update', function() {

    it('Initialize', function() {
        assert.equal(api.initialize(route, app), true);
    });

    it('Update', function() {
        assert.equal(api.update(app), true);
    });

  });


});
