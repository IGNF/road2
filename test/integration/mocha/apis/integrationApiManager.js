const assert = require('assert');
const path = require('path');
const ApisManager = require('../../../../src/js/apis/apisManager');
const Api = require('../../../../src/js/apis/api');
const logManager = require('../logManager');
const express = require('express');

const simpleApiDirectory = path.resolve(__dirname, '../config/apis/simple/1.0.0');

describe('Test de la classe ApisManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test du constructeur et des attributs', function() {

    let apisManager = new ApisManager();

    it('Get apisDirectory', function() {
      assert.deepEqual(apisManager._apisDirectory, "../apis/");
    });

    it('Get listOfRoutes', function() {
      assert.deepEqual(apisManager._listOfRoutes, new Array());
    });

    it('Get apisCatalog', function() {
      assert.deepEqual(apisManager._apisCatalog, {});
    });

  });

  describe('Test de la fonction checkApiConfiguration()', function() {

    let apisManager = new ApisManager("../../../test/integration/mocha/config/apis/");

    it('checkApiConfiguration() avec les bons parametres', function() {
      let configuration = {"name" : "simple","version" : "1.0.0"};
      assert.equal(apisManager.checkApiConfiguration(configuration), true);
    });

    it('checkApiConfiguration() avec des mauvais parametres', function() {
      let configuration = {"nam" : "todo","versio" : "2.0.0"};
      assert.equal(apisManager.checkApiConfiguration(configuration), false);
    });

  });

  describe('Test de la fonction loadApiConfiguration()', function() {

    let apisManager = new ApisManager("../../../test/integration/mocha/config/apis/");
    let app = express();
    let configuration = {"name" : "simple","version" : "1.0.0"};

    it('loadApiConfiguration() avec les bons parametres', function() {
      assert.equal(apisManager.loadApiConfiguration(app, configuration), true);
    });

  });

  describe('Test de la fonction getApi()', function() {

    let apisManager = new ApisManager("../../../test/integration/mocha/config/apis/");
    let app = express();
    let configuration = {"name" : "simple","version" : "1.0.0"};
    apisManager.loadApiConfiguration(app, configuration);
    let referenceApp = express();
    let referenceApi = new Api("simple","1.0.0",path.join(simpleApiDirectory, "index.js"));
    referenceApi.initFile = path.join(simpleApiDirectory, "init.js");
    referenceApi.updateFile = path.join(simpleApiDirectory, "update.js");
    referenceApi.initialize("/simple/1.0.0", referenceApp);


    it('getApi()', function() {
      assert.deepEqual(apisManager.getApi("simple", "1.0.0"), referenceApi);
    });

  });

});
