const assert = require('assert');
const pgrSource = require('../../../src/js/sources/pgrSource');
const RouteRequest = require('../../../src/js/requests/routeRequest');
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
      "dbConfig": "/home/docker/app/src/config/dbs/db_config_test.json",
      "costColumn": "cost_s_car",
      "rcostColumn": "reverse_cost_s_car"
    },
    "cost": {
      "profile": "car",
      "optimization": "fastest",
      "compute": {
        "storage": {
          "file": "/home/docker/route-graph-generator/io/costs_calculation_sample.json"
        }
      }
    }
  };

  let otherSourceDescription = {
    "id": "test-car-shortest",
    "type": "pgr",
    "storage": {
      "costColumn": "cost_m_car",
      "rcostColumn": "reverse_cost_m_car"
    },
    "cost": {
      "profile": "car",
      "optimization": "shortest",
      "compute": {
        "storage": {
          "file": "/home/docker/route-graph-generator/io/costs_calculation_sample.json"
        }
      }
    }
  };

  let source = new pgrSource(sourceDescription);
  const fakeClient = sinon.mock(Client);
  fakeClient.connect = sinon.stub();
  fakeClient.end = sinon.stub();

  source._client = fakeClient;

  describe('Test du constructeur et des getters', function() {

    it('Get Source id', function() {
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
      const sourceConnected = await source.connect();
      assert.equal(sourceConnected, true);
    });

  });

  describe('Test de disconnect()', function() {

    it('Disconnect()', async function() {
      const sourceDisonnected = await source.disconnect();
      assert.equal(sourceDisonnected, true);
    });

  });

  describe('Test de computeRequest() et writeRouteResponse()', function() {

    let resource = "resource-test";
    let start = {lon: 8.732901, lat: 41.928821};
    let end = {lon: 8.76385, lat: 41.953932};
    let profile = "car-test";
    let optimization = "fastest-test";
    let routeRequest = new RouteRequest(resource, start, end, profile, optimization);

    // TODO: better fake pgr response
    const fakePgrResponse = {command:'SELECT',rowCount:2,oid:null,rows:[{seq:1,path_seq:1,node:1,edge:1,cost:10,agg_cost:0,geom_json:'{"type":"LineString","coordinates":[[8.732901,41.928821],[8.76385,41.953932]]}',node_lon:'8.732901',node_lat:'41.928821',},{seq:2,path_seq:2,node:2,edge:-1,cost:'0',agg_cost:'10',geom_json:null,node_lon:'8.76385',node_lat:'41.953932',}],fields:[{name:'seq',tableID:0,columnID:0,dataTypeID:23,dataTypeSize:4,dataTypeModifier:-1,format:'text'},{name:'path_seq',tableID:0,columnID:0,dataTypeID:23,dataTypeSize:4,dataTypeModifier:-1,format:'text'},{name:'node',tableID:0,columnID:0,dataTypeID:20,dataTypeSize:8,dataTypeModifier:-1,format:'text'},{name:'edge',tableID:0,columnID:0,dataTypeID:20,dataTypeSize:8,dataTypeModifier:-1,format:'text'},{name:'cost',tableID:0,columnID:0,dataTypeID:701,dataTypeSize:8,dataTypeModifier:-1,format:'text'},{name:'agg_cost',tableID:0,columnID:0,dataTypeID:701,dataTypeSize:8,dataTypeModifier:-1,format:'text'},{name:'geom_json',tableID:0,columnID:0,dataTypeID:25,dataTypeSize:-1,dataTypeModifier:-1,format:'text'},{name:'node_lon',tableID:0,columnID:0,dataTypeID:701,dataTypeSize:8,dataTypeModifier:-1,format:'text'},{name:'node_lat',tableID:0,columnID:0,dataTypeID:701,dataTypeSize:8,dataTypeModifier:-1,format:'text'}],RowCtor:null,rowAsArray:!1,_getTypeParser:[]}

    fakeClient.query = sinon.stub().callsArgOnWith(2, source, null, fakePgrResponse);
    source._client = fakeClient;

    it('computeRequest() should return a routeResponse', async function() {
      await source.connect();
      const routeResponse = await source.computeRequest(routeRequest);
      assert.equal(routeResponse.resource, "resource-test");
    });

  });

});
