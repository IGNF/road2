const assert = require('assert');
const Wkt = require('../../../../../src/js/geometry/formats/wkt');
const logManager = require('../../logManager');

const { hrtime } = require('node:process');
const WKTmodule = require('wkt');

describe('Test de la classe Wkt', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let pointWkt = "POINT(2 48)"; 
  let linestringWkt = "LINESTRING(2 48,2.1 48.1,2.2 48.2)"; 
  let polygonWkt = "POLYGON((2 48,2.1 48.1,2.2 48.2,2 48))"; 
  let polygonWkt2 = "POLYGON((2 48,2.1 48.1,2.2 48.2,2 48),(2 48,2.1 48.1,2.2 48.2,2 48))"; 
  let geomcollWkt = "GEOMETRYCOLLECTION(POINT(2 48),LINESTRING(2 48,2.1 48.1,2.2 48.2),POLYGON((2 48,2.1 48.1,2.2 48.2,2 48),(2 48,2.1 48.1,2.2 48.2,2 48)))";
  let spaceWkt = "  POLYGON ( (2   48,  2.1 48.1,2.2 48.2) , ( 2   48,  2.1 48.1 ,2.2 48.2 ) )   ";
  let lowWkt = "polygon((2 48,2.1 48.1,2.2 48.2,2 48))";
  let eWkt = "SRID:4326;POINT(2 48)";
  let numberWkt = 1;
  let objectWkt = {};
  let emptyWkt = "";
  let wrongTypeWkt = "TEST(2 48)";
  let noPointTypeWkt = "(2 48)";
  let noLinestringTypeWkt = "(2 48,2.1 48.1,2.2 48.2)";
  let wrongpointWkt = "POINT(2 48";
  let wrongpointWkt2 = "POINT(2)";
  let wronglineWkt = "LINESTRING(2 48";
  let wronglineWkt2 = "LINESTRING(2)";
  let wronglineWkt3 = "LINESTRING(2 48)";
  let wronglineWkt4 = "LINESTRING(2 48,2.1)";
  let wronglineWkt5 = "LINESTRING(2 48,";
  let wrongeWkt = "SID:4326;POINT(2 48)";
  let wrongeWkt2 = "SRID:;POINT(2 48)";
  let wrongeWkt3 = "SRID4326;POINT(2 48)";
  let loweWkt = "srid:4326;POINT(2 48)";
  let pointJson = {"type":"Point","coordinates":[2,48]};
  let linestringJson = {"type":"LineString","coordinates":[[2,48],[2.1,48.1],[2.2,48.2]]};
  let polygonJson = {"type":"Polygon","coordinates":[[[2,48],[2.1,48.1],[2.2,48.2],[2,48]]]};
  let polygonJson2 = {"type":"Polygon","coordinates":[[[2,48],[2.1,48.1],[2.2,48.2],[2,48]],[[2,48],[2.1,48.1],[2.2,48.2],[2,48]]]};
  let geometryCollectionJson = {"type":"GeometryCollection","geometries":[{"type":"Point","coordinates":[2,48]},{"type":"LineString","coordinates":[[2,48],[2.1,48.1],[2.2,48.2]]},{"type":"Polygon","coordinates":[[[2,48],[2.1,48.1],[2.2,48.2],[2,48]],[[2,48],[2.1,48.1],[2.2,48.2],[2,48]]]}]};

  describe('Test de la fonction validateWKT()', function() {

    it('Avec un bon wkt (point)', function() {
      assert.equal(Wkt.validateWKT(pointWkt), true);
    });

    it('Avec un bon wkt (linestring)', function() {
      assert.equal(Wkt.validateWKT(linestringWkt), true);
    });

    it('Avec un bon wkt (polygon)', function() {
      assert.equal(Wkt.validateWKT(polygonWkt), true);
    });

    it('Avec un bon wkt (polygon donut)', function() {
      assert.equal(Wkt.validateWKT(polygonWkt2), true);
    });

    it('Avec un bon wkt (geometryCollection)', function() {
      assert.equal(Wkt.validateWKT(geomcollWkt), true);
    });

    it('Avec un bon ewkt (point)', function() {
      assert.equal(Wkt.validateWKT(eWkt), true);
    });

    it('Avec un wkt qui contient des espaces', function() {
      assert.equal(Wkt.validateWKT(spaceWkt), true);
    });

    it('Avec un wkt (insensitive case)', function() {
      assert.equal(Wkt.validateWKT(lowWkt), true);
    });

    it('Avec un ewkt (insensitive case)', function() {
      assert.equal(Wkt.validateWKT(loweWkt), true);
    });

    it('Avec un nombre', function() {
      assert.equal(Wkt.validateWKT(numberWkt), "L'argument n'est pas une chaîne");
    });

    it('Avec un objet vide', function() {
      assert.equal(Wkt.validateWKT(objectWkt), "L'argument n'est pas une chaîne");
    });

    it('Avec une chaine vide', function() {
      assert.equal(Wkt.validateWKT(emptyWkt), "L'argument est vide");
    });

    it('Avec rien', function() {
      assert.equal(Wkt.validateWKT(), "L'argument est vide");
    });

    it('Avec un mauvais type', function() {
      assert.equal(Wkt.validateWKT(wrongTypeWkt), "La chaine nettoyee ne peut etre splittee");
    });

    it('Linestring sans type', function() {
      assert.equal(Wkt.validateWKT(noPointTypeWkt), "La chaine est trop courte");
    });

    it('Linestring sans type', function() {
      assert.equal(Wkt.validateWKT(noLinestringTypeWkt), "La chaine nettoyee ne peut etre splittee");
    });

    it('Mauvais wkt (point)', function() {
      assert.equal(Wkt.validateWKT(wrongpointWkt), "La chaine nettoyee ne peut etre splittee");
    });

    it('Mauvais wkt (point) 2', function() {
      assert.equal(Wkt.validateWKT(wrongpointWkt2), "La chaine est trop courte");
    });

    it('Mauvais wkt (linestring)', function() {
      assert.equal(Wkt.validateWKT(wronglineWkt), "La chaine nettoyee ne peut etre splittee");
    });

    it('Mauvais wkt (linestring) 2', function() {
      assert.equal(Wkt.validateWKT(wronglineWkt2), "La validation a echoue");
    });

    it('Mauvais wkt (linestring) 3', function() {
      assert.equal(Wkt.validateWKT(wronglineWkt3), "La validation a echoue");
    });

    it('Mauvais wkt (linestring) 4', function() {
      assert.equal(Wkt.validateWKT(wronglineWkt4), "La validation a echoue");
    });

    it('Mauvais wkt (linestring) 5', function() {
      assert.equal(Wkt.validateWKT(wronglineWkt5), "La chaine nettoyee ne peut etre splittee");
    });

    it('Mauvais ewkt (point)', function() {
      assert.equal(Wkt.validateWKT(wrongeWkt), "La chaine nettoyee ne peut etre splittee");
    });

    it('Mauvais ewkt (point) 2', function() {
      assert.equal(Wkt.validateWKT(wrongeWkt2), "La chaine nettoyee ne peut etre splittee");
    });

    it('Mauvais ewkt (point) 3', function() {
      assert.equal(Wkt.validateWKT(wrongeWkt3), "La chaine nettoyee ne peut etre splittee");
    });

  });

  describe('Test de la fonction toGeoJSON()', function() {

    it('Avec un bon wkt (point)', function() {
      assert.deepStrictEqual(Wkt.toGeoJSON(pointWkt), pointJson);
    });

    it('Avec un bon wkt (linestring)', function() {
      assert.deepStrictEqual(Wkt.toGeoJSON(linestringWkt), linestringJson);
    });

    it('Avec un bon wkt (polygon simple)', function() {
      assert.deepStrictEqual(Wkt.toGeoJSON(polygonWkt), polygonJson);
    });

    it('Avec un bon wkt (polygon donuts)', function() {
      assert.deepStrictEqual(Wkt.toGeoJSON(polygonWkt2), polygonJson2);
    });

    it('Avec un bon wkt (geometry collection)', function() {
      assert.deepStrictEqual(Wkt.toGeoJSON(geomcollWkt), geometryCollectionJson);
    });

    it('Avec un bon ewkt (point)', function() {
      assert.deepStrictEqual(Wkt.toGeoJSON(eWkt), pointJson);
    });

  });

});
