const assert = require('assert');
const Polygon = require('../../../../src/js/geometry/polygon');
const proj4 = require('proj4');
const logManager = require('../logManager');

describe('Test de la classe Polygon', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let refGeomPolygon = {"type":"Polygon","coordinates":[[[2.32689460427517,48.8796664760288],[2.32472468908434,48.8806534168629],[2.32338130915736,48.8825632112067],[2.32206953790069,48.882561186561],[2.32095428209082,48.8823381270098],[2.32092436698872,48.8823316620015],[2.32242419764372,48.8840192132601],[2.3245085041333,48.884600267544],[2.32477614691189,48.8847825427569],[2.32501420082458,48.8849331739511],[2.32574230742436,48.88715232559],[2.32559587720714,48.8875076350737],[2.32576801732307,48.8880104297148],[2.32715614178612,48.8871800641188],[2.3288567997417,48.8857983467344],[2.33075204345075,48.8853970623475],[2.33185424388145,48.8885589613481],[2.33180026632535,48.888726834289],[2.3317775934945,48.8887932579532],[2.33337839987913,48.889453293149],[2.33574382909869,48.8895123042427],[2.33701742654633,48.8879203602709],[2.33750337619062,48.8876703390523],[2.33909347535874,48.8868130741082],[2.33976160902747,48.8846691634537],[2.34172981868777,48.8834479189961],[2.34386348025055,48.8829407175301],[2.34433279903902,48.8830305236972],[2.34443888269128,48.8830526885388],[2.34468547821561,48.8828534878423],[2.34474999949318,48.8827108474226],[2.34255154287428,48.8811150723814],[2.34044822598183,48.8804155140435],[2.33984157112535,48.8788994912569],[2.33737131803045,48.8776861309969],[2.33709317504751,48.8767214024118],[2.33535461098932,48.8761991404349],[2.3327040299337,48.8742867916612],[2.3314074826543,48.8750269072541],[2.32956775219663,48.8769708782012],[2.32700731273326,48.8795969615579],[2.32689460427517,48.8796664760288]]]};
  let refPolylinePolygon = "}xiiHaneMcEpL}JjG?dGj@~E@DqIkHsBaLc@u@]m@{LqCgAZcBa@dDuGrGsInAyJwR{Ea@HKBcC_IKwM|H_Gp@_BjD}HjLeCrFiKdBiLQ}ACUf@q@ZK|HvLjCbLnHxBpFlN`Ev@fBzI|JpOsC`GcKnJmO~NMV";
  let newGeomPolygon = {"type":"Polygon","coordinates":[[2.32689,48.87967],[2.32472,48.88065],[2.32338,48.88256],[2.32207,48.88256],[2.32095,48.88234],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32478,48.88478],[2.32501,48.88493],[2.32574,48.88715],[2.3256,48.88751],[2.32577,48.88801],[2.32716,48.88718],[2.32886,48.8858],[2.33075,48.8854],[2.33185,48.88856],[2.3318,48.88873],[2.33178,48.88879],[2.33338,48.88945],[2.33574,48.88951],[2.33702,48.88792],[2.3375,48.88767],[2.33909,48.88681],[2.33976,48.88467],[2.34173,48.88345],[2.34386,48.88294],[2.34433,48.88303],[2.34444,48.88305],[2.34469,48.88285],[2.34475,48.88271],[2.34255,48.88112],[2.34045,48.88042],[2.33984,48.8789],[2.33737,48.87769],[2.33709,48.87672],[2.33535,48.8762],[2.3327,48.87429],[2.33141,48.87503],[2.32957,48.87697],[2.32701,48.8796],[2.32689,48.87967]]};
  
  let refGeomLine = {"type":"LineString","coordinates":[[2.32689460427517,48.8796664760288],[2.32472468908434,48.8806534168629],[2.32338130915736,48.8825632112067]]};
  let refPolylineLine = "aneM}xiiHpLcEjG}J";
  let newGeomLine = {"type":"Polygon","coordinates":[[48.87967,2.32689],[48.88065,2.32472],[48.88256,2.32338]]};
  
  let refGeomPoint = {"type":"Point","coordinates":[2.32689460427517,48.8796664760288]};
  let refPolylinePoint = "aneM}xiiH";
  let newGeomPoint = {"type":"Polygon","coordinates":[[48.87967,2.32689]]};
  
  describe('Test du constructeur et des getters/setters', function() {

    let polygon = new Polygon(refGeomPolygon, "geojson", "EPSG:4326");

    it('Get type', function() {
      assert.equal(polygon.type, "polygon");
    });

    it('Get projection', function() {
      assert.equal(polygon.projection, "EPSG:4326");
    });

    it('Get geom', function() {
      assert.equal(polygon.geom, refGeomPolygon);
    });

  });

  describe('Changer le format avec getGeometryWithFormat()', function() {

    it('Polygon : geojson to polyline', function() {
      let polygon = new Polygon(refGeomPolygon, "geojson", "EPSG:4326");
      let tmpGeom = polygon.getGeometryWithFormat("polyline");
      assert.equal(tmpGeom, refPolylinePolygon);
    });

    it('Polygon : polyline to geojson', function() {
      let polygonPoly = new Polygon(refPolylinePolygon, "polyline", "EPSG:4326");
      let tmpGeom = polygonPoly.getGeometryWithFormat("geojson");
      assert.deepEqual(tmpGeom, newGeomPolygon);
    });

    it('Line : geojson to polyline', function() {
      let polygon = new Polygon(refGeomLine, "geojson", "EPSG:4326");
      let tmpGeom = polygon.getGeometryWithFormat("polyline");
      assert.equal(tmpGeom, refPolylineLine);
    });

    it('Line : polyline to geojson', function() {
      let polygonPoly = new Polygon(refPolylineLine, "polyline", "EPSG:4326");
      let tmpGeom = polygonPoly.getGeometryWithFormat("geojson");
      assert.deepEqual(tmpGeom, newGeomLine);
    });

    it('Point : geojson to polyline', function() {
      let polygon = new Polygon(refGeomPoint, "geojson", "EPSG:4326");
      let tmpGeom = polygon.getGeometryWithFormat("polyline");
      assert.equal(tmpGeom, refPolylinePoint);
    });

    it('Point : polyline to geojson', function() {
      let polygonPoly = new Polygon(refPolylinePoint, "polyline", "EPSG:4326");
      let tmpGeom = polygonPoly.getGeometryWithFormat("geojson");
      assert.deepEqual(tmpGeom, newGeomPoint);
    });

  });

});
