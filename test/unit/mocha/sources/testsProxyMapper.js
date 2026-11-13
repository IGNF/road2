const assert = require('assert');
const fs = require('fs');
const path = require('path');
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

    it('$lookup rend la valeur sélectionnée ou le défaut', function() {
      const node = {
        $lookup: {
          value: "${direction}",
          table: { arrival: { $divide: ["${costValue}", 60] } },
          default: { profile: "${profile}", missing: "${missing}" }
        }
      };
      assert.strictEqual(proxyMapper.render(node, context), 10);
      assert.deepStrictEqual(proxyMapper.render(node, { profile: "car" }), { profile: "car" });
      assert.deepStrictEqual(proxyMapper.render(node, { ...context, direction: "departure" }), { profile: "car" });
      assert.strictEqual(proxyMapper.render({ $lookup: { value: "x", table: {} } }, context), undefined);
    });

    it('$concat et $join', function() {
      const node = { $concat: ["/route/", "${profile}", "/", { $join: { from: "coordinates", separator: ";", as: "${item.0},${item.1}" } }] };
      assert.strictEqual(proxyMapper.render(node, context), "/route/car/2.1,48.1;2.2,48.2");
    });

    it('$join avec un séparateur vide', function() {
      const node = { $join: { from: "values", separator: "", as: "${item}" } };
      assert.strictEqual(proxyMapper.render(node, { values: ["first", "last"] }), "firstlast");
    });

    it('$fromEntries', function() {
      const result = proxyMapper.render({ $fromEntries: { from: "constraints", key: "${item}", value: "1" } }, context);
      assert.deepStrictEqual(result, { toll: "1" });
    });

    it('$merge', function() {
      const result = proxyMapper.render({ $merge: [{ walking_speed: 4 }, { $fromEntries: { from: "constraints", key: "${item}", value: true } }] }, context);
      assert.deepStrictEqual(result, { walking_speed: 4, toll: true });
    });

    it('$fromEntries omet les clés et valeurs indéfinies sans écraser les défauts', function() {
      const node = {
        $merge: [
          { toll: true },
          { $fromEntries: { from: "entries", key: "${item.key}", value: "${item.value}" } }
        ]
      };
      const result = proxyMapper.render(node, {
        entries: [
          { key: "toll" },
          { value: "ignored" },
          { key: "ferry", value: false },
          { key: "speed", value: 0 },
          { key: "empty", value: "" },
          { key: "nullable", value: null }
        ]
      });
      assert.deepStrictEqual(result, { toll: true, ferry: false, speed: 0, empty: "", nullable: null });
    });

    it('conditionne le paramètre exclude aux contraintes présentes', function() {
      const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../documentation/configuration/sources/osrm-proxy.mapping')));
      assert.deepStrictEqual(proxyMapper.render(mapping.route.query, context).exclude, ["toll"]);
      assert.strictEqual(proxyMapper.render(mapping.route.query, { ...context, constraints: [] }).exclude, undefined);
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

    const malformedTemplates = [
      { $for: 1, $as: "${item}" },
      { $for: "", $as: "${item}" },
      { $for: "coordinates" },
      { $if: null, $then: true },
      { $if: "profile" },
      { $divide: null },
      { $divide: [1] },
      { $multiply: [1, 2, 3] },
      { $lookup: null },
      { $lookup: { table: {} } },
      { $lookup: { value: "x", table: [] } },
      { $lookup: { value: "x", table: null } },
      { $fromEntries: { from: [], key: "${item}", value: true } },
      { $fromEntries: { from: "constraints", value: true } },
      { $fromEntries: { from: "constraints", key: "${item}" } },
      { $concat: "bad" },
      { $join: { from: 1, as: "${item}" } },
      { $join: { from: "coordinates" } },
      { $join: { from: "coordinates", as: "${item}", separator: {} } },
      { $merge: {} },
      { $as: "orphan" },
      { $then: "orphan" },
      { $else: "orphan" },
      { $concat: [], $merge: [] },
      { $concat: [], ignored: true },
      { $join: { from: "coordinates", as: "${item}", typo: true } }
    ];

    for (const template of malformedTemplates) {
      it('rejette le template malformé ' + JSON.stringify(template), function() {
        for (const field of ["path", "query", "body", "headers"]) {
          const error = proxyMapper.checkMapping({ route: { ...valid.route, [field]: template } });
          assert.strictEqual(typeof error, "string", field);
          assert.ok(error.includes("route"), error);
        }
      });
    }

    it('valide récursivement les templates, y compris les résultats de lookup', function() {
      for (const template of [
        { nested: [{ $concat: "bad" }] },
        { $lookup: { value: "x", table: { x: { $for: 42, $as: true } } } },
        { $lookup: { value: "x", table: {}, default: { $merge: {} } } },
        { $for: "coordinates", $as: { $join: null } }
      ]) {
        assert.notStrictEqual(proxyMapper.checkMapping({ route: { ...valid.route, body: template } }), null);
      }
      assert.notStrictEqual(proxyMapper.checkMapping({ route: { ...valid.route, headers: { $foo: 1 } } }), null);
    });

    it('accepte les directives valides et les valeurs littérales dans les tables', function() {
      const body = [
        { $for: "coordinates", $as: null },
        { $if: "profile", $then: false, $else: null },
        { $divide: [0, 1] },
        { $multiply: [1, 2] },
        { $lookup: { value: null, table: { $as: false }, default: null } },
        { $lookup: { value: "x", table: {} } },
        { $fromEntries: { from: "constraints", key: "${item}", value: false } },
        { $concat: [] },
        { $join: { from: "constraints", as: "${item}", separator: "" } },
        { $join: { from: "constraints", as: "${item}" } },
        { $merge: [] },
        { "${profile}": true }
      ];
      assert.strictEqual(proxyMapper.checkMapping({ route: { ...valid.route, body } }), null);
    });

    it('accepte les mappings fournis', function() {
      for (const file of ["osrm-proxy.mapping", "valhalla-proxy.mapping"]) {
        const mapping = proxyMapper.loadMappingFile(path.join(__dirname, '../../../../documentation/configuration/sources', file));
        assert.strictEqual(proxyMapper.checkMapping(mapping), null, file);
      }
    });

  });

});
