const assert = require('assert');
const ApisManager = require('../../../../src/js/apis/apisManager');
const logManager = require('../logManager');
const express = require('express');

describe('Test de la classe ApisManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let apisManager = new ApisManager();
  let app = express();

  describe('Test du constructeur et des getters', function() {

    it('Get listOfRoutes', function() {
      assert.deepEqual(apisManager.listOfRoutes, new Array());
    });

  });

  describe('Test de la fonction loadAPISDirectory()', function() {

    it('loadAPISDirectory() avec les bons parametres', function() {
      assert.equal(apisManager.loadAPISDirectory(app, "../../../test/unit/mocha/config/apis/", ""), true);
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

});
