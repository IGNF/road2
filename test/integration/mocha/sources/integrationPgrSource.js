const assert = require('assert');
const pgrSource = require('../../../../src/js/sources/pgrSource');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
const { Client } = require('pg');
const logManager = require('../logManager');

const sinon = require('sinon');

describe('Test de la classe pgrSource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let sourceDescription = {
    "id": "test-car-fastest",
    "type": "pgr",
    "storage": {
      "dbConfig": "./dbs/db_config_test.json",
      "costColumn": "cost_s_car",
      "rcostColumn": "reverse_cost_s_car",
      "base": {
        "schema" : "public",
        "attributes" : {length: 0}
      }
    },
    "costs": [{
      "profile": "car",
      "optimization": "fastest",
      "costColumn": "cost_s_car",
      "rcostColumn": "reverse_cost_s_car",
      "compute": {
        "storage": {
          "file": "/home/docker/route-graph-generator/configuration/costs_calculation_sample.json"
        }
      }
    }
  ]
  };

  // instance de Base simulée : le pgrSource ne fait que s'y connecter et y envoyer ses requêtes
  let base = {
    connected: false,
    pool: null,
    async connect() { this.connected = true; },
    async disconnect() { this.connected = false; }
  };

  let otherSourceDescription = {
    "id": "test-car-shortest",
    "type": "pgr",
    "storage": {
      "costColumn": "cost_m_car",
      "rcostColumn": "reverse_cost_m_car",
      "base": {
        "schema" : "public",
        "attributes" : {length: 0}
      }
    },
    "costs": [{
      "profile": "car",
      "optimization": "shortest",
      "compute": {
        "storage": {
          "file": "/home/docker/route-graph-generator/configuration/costs_calculation_sample.json"
        }
      }
    }
    ]
  };

  let source = new pgrSource(sourceDescription, base);
  const fakeClient = sinon.mock(Client);
  fakeClient.connect = sinon.stub();
  fakeClient.end = sinon.stub();

  source._client = fakeClient;

  describe('Test du constructeur et des getters', function() {

    xit('Get Source id', function() {
      assert.equal(source.id, "test-car-fastest");
    });

    it('Get Source type', function() {
      assert.equal(source.type, "pgr");
    });

    it('Get Source connected', function() {
      assert.equal(source.connected, false);
    });

    it('Get Source configuration', function() {
      assert.deepEqual(source.configuration, sourceDescription);
    });

  });

  describe('Test des setters', function() {

    it('Set Source configuration', function() {
      source.configuration = otherSourceDescription;
      assert.deepEqual(source.configuration, otherSourceDescription);
    });

  });

  describe('Test de connect()', function() {

    it('Connect()', async function() {
      await source.connect();
    });

  });

  describe('Test de disconnect()', function() {

    it('Disconnect()', async function() {
      await source.disconnect();
    });

  });

  describe('Test de computeRequest() et writeRouteResponse()', function() {

    let resource = "resource-test";
    let start = {lon: 8.732901, lat: 41.928821,  getCoordinatesIn(toto) { return [8.732901, 41.928821];}};
    let end = {lon: 8.76385, lat: 41.953932,  getCoordinatesIn(toto) { return [8.76385, 41.953932];}};
    let profile = "car";
    let optimization = "fastest";
    let routeRequest = new RouteRequest(resource, start, end, profile, optimization);

    // TODO: better fake pgr response
    const fakePgrResponse = {command:'SELECT',rowCount:2,oid:null,rows:[{seq:1,path_seq:1,node:1,edge:1,cost:10,agg_cost:0,duration:10,distance:100,geom_json:'{"type":"LineString","coordinates":[[8.732901,41.928821],[8.76385,41.953932]]}',node_lon:'8.732901',node_lat:'41.928821',},{seq:2,path_seq:1,node:2,edge:-1,cost:0,agg_cost:10,duration:0,distance:0,geom_json:null,node_lon:'8.76385',node_lat:'41.953932',}]}

    fakeClient.query = sinon.stub().callsArgOnWith(2, source, null, fakePgrResponse);
    base.pool = fakeClient;

    it('computeRequest() should return a routeResponse', async function() {
      await source.connect();
      const routeResponse = await source.computeRequest(routeRequest);
      assert.equal(routeResponse.resource, "resource-test");
    });

  });

});
