const assert = require('assert');
const ApisManager = require('../../../../src/js/apis/apisManager');
const Api = require('../../../../src/js/apis/api');
const logManager = require('../logManager');
const express = require('express');

describe('Test de la classe ApisManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let apisManager = new ApisManager();
  let referenceApp = express();
  let app = express();
  let referenceApi = new Api("simple","1.0.0","/home/docker/app/test/integration/mocha/config/apis/simple/1.0.0/index.js");
  referenceApi.initFile = "/home/docker/app/test/integration/mocha/config/apis/simple/1.0.0/init.js";
  referenceApi.updateFile = "/home/docker/app/test/integration/mocha/config/apis/simple/1.0.0/update.js";
  referenceApi.initialize("/simple/1.0.0", referenceApp);

  describe('Test du constructeur et des getters', function() {

    it('Get listOfRoutes', function() {
      assert.deepEqual(apisManager.listOfRoutes, new Array());
    });

    it('Get apisCatalog', function() {
      assert.deepEqual(apisManager.apisCatalog, {});
    });

  });

  describe('Test de la fonction loadAPISDirectory()', function() {

    it('loadAPISDirectory() avec les bons parametres', function() {
      assert.equal(apisManager.loadAPISDirectory(app, "../../../test/integration/mocha/config/apis/", ""), true);
    });

  });

  describe('Test de la fonction verifyRouteExistanceById()', function() {

    it('verifyRouteExistanceById() avec une route qui existe', function() {
      assert.equal(apisManager.verifyRouteExistanceById("/simple/1.0.0"), true);
    });

    it('verifyRouteExistanceById() avec une route qui n\'existe pas', function() {
      assert.equal(apisManager.verifyRouteExistanceById("/test/1.0.3"), false);
    });

  });

  describe('Test de la fonction getApi()', function() {

    it('getApi()', function() {
      assert.deepEqual(apisManager.getApi("simple", "1.0.0"), referenceApi);
    });

  });

});
