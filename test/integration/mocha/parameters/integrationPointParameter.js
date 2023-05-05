const assert = require('assert');
const Point = require('../../../../src/js/geometry/point');
const Parameter = require('../../../../src/js/parameters/parameter');
const PointParameter = require('../../../../src/js/parameters/pointParameter');
const logManager = require('../logManager');

describe('Test de la classe PointParameter', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let refPoint = new Point(2,48.5,"EPSG:4326");
  let parameterConf = {"id": "point","values": {"bbox": "1.7,48.4,3.3,49.1","projection": "EPSG:4326"}};
  let parameter = new Parameter("start","point","start","start","true","false");
  let pointParameter = new PointParameter(parameter);

  describe('Test du constructeur et des getters', function() {

    it('Get serviceParameter', function() {
      assert.equal(pointParameter.serviceParameter.style, "pipeDelimited");
    });

    it('Get defaultValueContent', function() {
      assert.equal(pointParameter.defaultValueContent, "");
    });

    it('Get values', function() {
      assert.deepEqual(pointParameter.values, {bbox:""});
    });

  });

  describe('Test du chargement', function() {

    it('load()', function() {
      assert.equal(pointParameter.load(parameterConf), true);
    });

    it('Get defaultValueContent', function() {
      assert.equal(pointParameter.defaultValueContent, "");
    });

    it('Get values', function() {
      assert.deepEqual(pointParameter.values, {bbox:"1.7,48.4,3.3,49.1"});
    });

  });

  describe('Test des vérifications', function() {

    it('check() avec bonne valeur', function() {
      assert.equal(pointParameter.check("2.1,48.6","EPSG:4326").code, "ok");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(pointParameter.check("2.1,48","EPSG:4326").code, "error");
    });

    it('check() avec mauvaise valeur', function() {
      assert.equal(pointParameter.check("1.5,48.5","EPSG:4326").code, "error");
    });

    it('specificCheck() avec bonne valeur', function() {
      assert.equal(pointParameter.specificCheck("2.1,48.6","EPSG:4326").code, "ok");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(pointParameter.specificCheck("2.1,48","EPSG:4326").code, "error");
    });

    it('specificCheck() avec mauvaise valeur', function() {
      assert.equal(pointParameter.specificCheck("1.5,48.5","EPSG:4326").code, "error");
    });

  });

  describe('Test des conversions', function() {

    it('convertIntoTable()', function() {
      assert.equal(pointParameter.convertIntoTable("2,48.5|2,48.6", [], "EPSG:4326"), true);
    });

    it('specificConvertion()', function() {
      assert.deepEqual(pointParameter.specificConvertion("2,48.5","EPSG:4326"), refPoint);
    });

  });


});
