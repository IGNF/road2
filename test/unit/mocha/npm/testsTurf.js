const assert = require('assert');
const logManager = require('../logManager');
const turf = require('@turf/turf');

describe('Test de la dépendance NPM TurfJS', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  describe('Test de la fonction point', function() {

    let refPoint = {"geometry": {"coordinates": [2,48],"type": "Point"},"properties": {},"type": "Feature"};

    it('Creation d\'un point à partir de nombres', function() {
        let point = turf.point([2,48]);
        assert.deepEqual(point, refPoint);
    });

  });

  describe('Test de la fonction bbox', function() {

    let refBbox = [-82, 35, -74, 42];

    it('Creation d\'une bbox à partir d\'une ligne en geojson ', function() {
        let line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
        let bbox = turf.bbox(line);
        assert.deepEqual(bbox, refBbox);
    });

  });

  describe('Test de la fonction polygon', function() {

    let refPolygon = {"type":"Feature", "properties":{},"geometry":{"type": "Polygon","coordinates":[[[2.32689,48.87967],[2.32472,48.88065],[2.32338,48.88256],[2.32207,48.88256],[2.32095,48.88234],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32478,48.88478],[2.32501,48.88493],[2.32574,48.88715],[2.3256,48.88751],[2.32577,48.88801],[2.32716,48.88718],[2.32886,48.8858],[2.33075,48.8854],[2.33185,48.88856],[2.3318,48.88873],[2.33178,48.88879],[2.33338,48.88945],[2.33574,48.88951],[2.33702,48.88792],[2.3375,48.88767],[2.33909,48.88681],[2.33976,48.88467],[2.34173,48.88345],[2.34386,48.88294],[2.34433,48.88303],[2.34444,48.88305],[2.34469,48.88285],[2.34475,48.88271],[2.34255,48.88112],[2.34045,48.88042],[2.33984,48.8789],[2.33737,48.87769],[2.33709,48.87672],[2.33535,48.8762],[2.3327,48.87429],[2.33141,48.87503],[2.32957,48.87697],[2.32701,48.8796],[2.32689,48.87967]]]}};

    it('Creation d\'un polygon à partir des coordonnées d\'un polygon en geojson', function() {
        let geojsonCoord = [[[2.32689,48.87967],[2.32472,48.88065],[2.32338,48.88256],[2.32207,48.88256],[2.32095,48.88234],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32478,48.88478],[2.32501,48.88493],[2.32574,48.88715],[2.3256,48.88751],[2.32577,48.88801],[2.32716,48.88718],[2.32886,48.8858],[2.33075,48.8854],[2.33185,48.88856],[2.3318,48.88873],[2.33178,48.88879],[2.33338,48.88945],[2.33574,48.88951],[2.33702,48.88792],[2.3375,48.88767],[2.33909,48.88681],[2.33976,48.88467],[2.34173,48.88345],[2.34386,48.88294],[2.34433,48.88303],[2.34444,48.88305],[2.34469,48.88285],[2.34475,48.88271],[2.34255,48.88112],[2.34045,48.88042],[2.33984,48.8789],[2.33737,48.87769],[2.33709,48.87672],[2.33535,48.8762],[2.3327,48.87429],[2.33141,48.87503],[2.32957,48.87697],[2.32701,48.8796],[2.32689,48.87967]]];
        let polygon = turf.polygon(geojsonCoord);
        assert.deepEqual(polygon, refPolygon);
    });

  });

  describe('Test de la fonction polygonToLine', function() {

    let refLine = {"type":"Feature", "properties":{},"geometry":{"type": "LineString","coordinates":[[2.32689,48.87967],[2.32472,48.88065],[2.32338,48.88256],[2.32207,48.88256],[2.32095,48.88234],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32478,48.88478],[2.32501,48.88493],[2.32574,48.88715],[2.3256,48.88751],[2.32577,48.88801],[2.32716,48.88718],[2.32886,48.8858],[2.33075,48.8854],[2.33185,48.88856],[2.3318,48.88873],[2.33178,48.88879],[2.33338,48.88945],[2.33574,48.88951],[2.33702,48.88792],[2.3375,48.88767],[2.33909,48.88681],[2.33976,48.88467],[2.34173,48.88345],[2.34386,48.88294],[2.34433,48.88303],[2.34444,48.88305],[2.34469,48.88285],[2.34475,48.88271],[2.34255,48.88112],[2.34045,48.88042],[2.33984,48.8789],[2.33737,48.87769],[2.33709,48.87672],[2.33535,48.8762],[2.3327,48.87429],[2.33141,48.87503],[2.32957,48.87697],[2.32701,48.8796],[2.32689,48.87967]]}};

    it('Creation d\'une ligne à partir des coordonnées d\'un polygon en geojson', function() {
        let geojsonCoord = [[[2.32689,48.87967],[2.32472,48.88065],[2.32338,48.88256],[2.32207,48.88256],[2.32095,48.88234],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32478,48.88478],[2.32501,48.88493],[2.32574,48.88715],[2.3256,48.88751],[2.32577,48.88801],[2.32716,48.88718],[2.32886,48.8858],[2.33075,48.8854],[2.33185,48.88856],[2.3318,48.88873],[2.33178,48.88879],[2.33338,48.88945],[2.33574,48.88951],[2.33702,48.88792],[2.3375,48.88767],[2.33909,48.88681],[2.33976,48.88467],[2.34173,48.88345],[2.34386,48.88294],[2.34433,48.88303],[2.34444,48.88305],[2.34469,48.88285],[2.34475,48.88271],[2.34255,48.88112],[2.34045,48.88042],[2.33984,48.8789],[2.33737,48.87769],[2.33709,48.87672],[2.33535,48.8762],[2.3327,48.87429],[2.33141,48.87503],[2.32957,48.87697],[2.32701,48.8796],[2.32689,48.87967]]];
        let polygon = turf.polygon(geojsonCoord);
        let line = turf.polygonToLine(polygon);
        assert.deepEqual(line, refLine);
    });

  });

  describe('Test de la fonction lineSlice', function() {

    let line = {"type":"Feature", "properties":{},"geometry":{"type": "LineString","coordinates":[[2.32689,48.87967],[2.32472,48.88065],[2.32338,48.88256],[2.32207,48.88256],[2.32095,48.88234],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32478,48.88478],[2.32501,48.88493],[2.32574,48.88715],[2.3256,48.88751],[2.32577,48.88801],[2.32716,48.88718],[2.32886,48.8858],[2.33075,48.8854],[2.33185,48.88856],[2.3318,48.88873],[2.33178,48.88879],[2.33338,48.88945],[2.33574,48.88951],[2.33702,48.88792],[2.3375,48.88767],[2.33909,48.88681],[2.33976,48.88467],[2.34173,48.88345],[2.34386,48.88294],[2.34433,48.88303],[2.34444,48.88305],[2.34469,48.88285],[2.34475,48.88271],[2.34255,48.88112],[2.34045,48.88042],[2.33984,48.8789],[2.33737,48.87769],[2.33709,48.87672],[2.33535,48.8762],[2.3327,48.87429],[2.33141,48.87503],[2.32957,48.87697],[2.32701,48.8796],[2.32689,48.87967]]}};
    let start = turf.point([2.32207,48.88256]);
    let stop = turf.point([2.32451,48.8846]);
    let refSliced = {"geometry":{"coordinates":[[2.32207,48.88256],[2.32095,48.88234],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32451,48.8846]],"type":"LineString"},"properties":{},"type":"Feature"};

    it('Découpage d\'une ligne à partir d\'une ligne en geojson', function() {
        let lineSliced = turf.lineSlice(start, stop, line);
        assert.deepEqual(lineSliced, refSliced);
    });

  });

  describe('Test de la fonction truncate', function() {

    let line = {"geometry":{"coordinates":[[2.322075785,48.882563257],[2.320957896,48.8823445245],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32451,48.8846]],"type":"LineString"},"properties":{},"type":"Feature"};
    let refTrunc = {"geometry":{"coordinates":[[2.322076,48.882563],[2.320958,48.882345],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32451,48.8846]],"type":"LineString"},"properties":{},"type":"Feature"};

    it('Modification de la géométrie par découpage des coordonnées', function() {
        let lineTrunc = turf.truncate(line, {precision: 6});
        assert.deepEqual(lineTrunc, refTrunc);
    });

  });

  describe('Test de la fonction nearestPointOnLine', function() {

    let line = {"geometry":{"coordinates":[[2.322075785,48.882563257],[2.320957896,48.8823445245],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32451,48.8846]],"type":"LineString"},"properties":{},"type":"Feature"};
    let point = turf.point([2.32207,48.88256]);
    let refPoint = {geometry: {coordinates: [2.3220691120694474,48.88256195133658],type: 'Point'},properties: {dist: 0.00022648508237084762,index: 0,location: 0.0005090817926782273},type: 'Feature'};

    it('Calcul du point le plus proche d\'un autre sur une ligne ', function() {
        let nearest = turf.nearestPointOnLine(line, point,{precision: 6});
        assert.deepEqual(nearest, refPoint);
    });

  });

  describe('Test de la fonction length', function() {

    let line = {"geometry":{"coordinates":[[2.322075785,48.882563257],[2.320957896,48.8823445245],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32451,48.8846]],"type":"LineString"},"properties":{},"type":"Feature"};
    let refLength = 0.4719505233593252;

    it('Calcul du point le plus proche d\'un autre sur une ligne ', function() {
        let lengthOfLine = turf.length(line);
        assert.equal(lengthOfLine, refLength);
    });

  });

  describe('Test de la fonction cleanCoords', function() {

    let line = {"geometry":{"coordinates":[[2.322075785,48.882563257],[2.320957896,48.8823445245],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846],[2.32451,48.8846]],"type":"LineString"},"properties":{},"type":"Feature"};
    let refLine = {"geometry":{"coordinates":[[2.322075785,48.882563257],[2.320957896,48.8823445245],[2.32092,48.88233],[2.32242,48.88402],[2.32451,48.8846]],"type":"LineString"},"properties":{},"type":"Feature"};

    it('Calcul du point le plus proche d\'un autre sur une ligne ', function() {
        let cleanedLine = turf.cleanCoords(line);
        assert.deepEqual(cleanedLine, refLine);
    });

  });

});
