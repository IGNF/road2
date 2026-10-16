const assert = require('assert');
const proxyMapper = require('../../../../src/js/sources/proxyMapper');

describe('Test de proxyMapper', function() {

  const context = {
    profile: "car",
    coordinates: [[2.1, 48.1], [2.2, 48.2]],
    costValue: 600,
    date_time: undefined,
    cost: { costing: "auto" },
    constraints: ["toll"],
    direction: "arrival"
  };

  describe('render()', function() {

    it('conserve le type pour un placeholder seul', function() {
      assert.strictEqual(proxyMapper.render("${costValue}", context), 600);
    });

    it('interpole une chaîne', function() {
      assert.strictEqual(proxyMapper.render("/route/${profile}", context), "/route/car");
    });

    it('omet les valeurs indéfinies et rend les clés', function() {
      const result = proxyMapper.render({ a: "${date_time}", "${cost.costing}": { b: 1 } }, context);
      assert.deepStrictEqual(result, { auto: { b: 1 } });
    });

    it('$for', function() {
      const result = proxyMapper.render({ $for: "coordinates", $as: { lat: "${item.1}", lon: "${item.0}" } }, context);
      assert.deepStrictEqual(result, [{ lat: 48.1, lon: 2.1 }, { lat: 48.2, lon: 2.2 }]);
    });

    it('$if avec et sans valeur', function() {
      assert.deepStrictEqual(proxyMapper.render({ $if: "profile", $then: "yes", $else: "no" }, context), "yes");
      assert.deepStrictEqual(proxyMapper.render({ x: { $if: "date_time", $then: 1 } }, context), {});
    });

    it('$divide et $multiply', function() {
      assert.strictEqual(proxyMapper.render({ $divide: ["${costValue}", 60] }, context), 10);
      assert.strictEqual(proxyMapper.render({ $multiply: ["${costValue}", 2] }, context), 1200);
    });

    it('$lookup', function() {
      const node = { $lookup: { value: "${direction}", table: { arrival: true }, default: false } };
      assert.strictEqual(proxyMapper.render(node, context), true);
      assert.strictEqual(proxyMapper.render(node, { direction: "departure" }), false);
    });

    it('$concat et $join', function() {
      const node = { $concat: ["/route/", "${profile}", "/", { $join: { from: "coordinates", separator: ";", as: "${item.0},${item.1}" } }] };
      assert.strictEqual(proxyMapper.render(node, context), "/route/car/2.1,48.1;2.2,48.2");
    });

    it('$fromEntries', function() {
      const result = proxyMapper.render({ $fromEntries: { from: "constraints", key: "${item}", value: "1" } }, context);
      assert.deepStrictEqual(result, { toll: "1" });
    });

  });

  describe('checkMapping()', function() {

    const valid = { route: { path: "/route", response: { format: "osrm" } } };

    it('mapping valide', function() {
      assert.strictEqual(proxyMapper.checkMapping(valid), null);
    });

    it('opération inconnue', function() {
      assert.notStrictEqual(proxyMapper.checkMapping({ nearest: valid.route }), null);
    });

    it('path absent', function() {
      assert.notStrictEqual(proxyMapper.checkMapping({ route: { response: { format: "osrm" } } }), null);
    });

    it('format de réponse invalide', function() {
      assert.notStrictEqual(proxyMapper.checkMapping({ route: { path: "/r", response: { format: "geojson" } } }), null);
    });

    it('directive inconnue', function() {
      assert.notStrictEqual(proxyMapper.checkMapping({ route: { path: "/r", body: { $foo: 1 }, response: { format: "osrm" } } }), null);
    });

  });

});
