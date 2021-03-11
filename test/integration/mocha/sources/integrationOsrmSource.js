const assert = require('assert');
const osrmSource = require('../../../../src/js/sources/osrmSource');
const RouteRequest = require('../../../../src/js/requests/routeRequest');
const logManager = require('../logManager');
const OSRM = require("osrm");

const sinon = require('sinon');
const mockfs = require('mock-fs');

describe('Test de la classe osrmSource', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();

    mockfs({
      "/home/docker/data": {
        "corse-latest.osm": "",
        "corse-latest.osrm": "",
        "corse-latest.osrm.cnbg": "",
        "corse-latest.osrm.cnbg_to_ebg": "",
        "corse-latest.osrm.datasource_names": "",
        "corse-latest.osrm.ebg": "",
        "corse-latest.osrm.ebg_nodes": "",
        "corse-latest.osrm.edges": "",
        "corse-latest.osrm.enw": "",
        "corse-latest.osrm.fileIndex": "",
        "corse-latest.osrm.geometry": "",
        "corse-latest.osrm.hsgr": "",
        "corse-latest.osrm.icd": "",
        "corse-latest.osrm.maneuver_overrides": "",
        "corse-latest.osrm.names": "",
        "corse-latest.osrm.nbg_nodes": "",
        "corse-latest.osrm.properties": "",
        "corse-latest.osrm.ramIndex": "",
        "corse-latest.osrm.restrictions": "",
        "corse-latest.osrm.timestamp": "",
        "corse-latest.osrm.tld": "",
        "corse-latest.osrm.tls": "",
        "corse-latest.osrm.turn_duration_penalties": "",
        "corse-latest.osrm.turn_penalties_index": "",
        "corse-latest.osrm.turn_weight_penalties": "",
      },
      "/home/docker/osrm/osrm-backend/osrm-backend-5.24.0/profiles": {
        "car.lua": "",
        "car-2.lua": "",
      },
    });
  });

  after(() => {
    mockfs.restore();
  });

  let sourceDescription = {
    "id": "corse-car-fastest",
    "type": "osrm",
    "storage": {
      "file": "/home/docker/data/corse-latest.osrm"
    },
    "cost": {
      "profile": "car",
      "optimization": "fastest",
      "compute": {
        "storage": {
          "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.24.0/profiles/car.lua"
        }
      }
    }
  };

  let topology = {
    "id": "corse-osm",
    "type": "osm",
    "description": "Données OSM sur la Corse.",
    "storage": {
      "file": "/home/docker/internal/corse-latest.osm.pbf"
    },
    "projection": "EPSG:4326",
    "bbox": "-90,-180,90,180",

  };

  let otherSourceDescription = {
    "id": "corse-car-fastest-2",
    "type": "osrm",
    "storage": {
      "file": "/home/docker/data/corse-latest.osrm"
    },
    "cost": {
      "profile": "car",
      "optimization": "fastest",
      "compute": {
        "storage": {
          "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.24.0/profiles/car-2.lua"
        }
      }
    }
  };

  let source = new osrmSource(sourceDescription, topology);

  describe('Test du constructeur et des getters', function() {

    it('Get Source id', function() {
      assert.equal(source.id, "corse-car-fastest");
    });

    it('Get Source type', function() {
      assert.equal(source.type, "osrm");
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

  // describe('Test de connect()', function() {

  //   // Impossible à tester sans les fichiers : connect() appelle le constructeur OSRM qui a besoin
  //   // d'un fichier, et qui visiblement le check (cf. mockfs dans le script before() )
  //   it('Connect()', async function() {
  //     const sourceConnected = await source.connect();
  //     assert.equal(sourceConnected, true);
  //   });

  // });

  describe('Test de disconnect()', function() {

    it('Disconnect()', async function() {
      await source.disconnect();
    });

  });

  describe('Test de computeRequest() et writeRouteResponse()', function() {

    let resource = "resource-test";
    let start = {lon: 8.732901, lat: 41.928821, getCoordinatesIn(toto) { return [8.732901, 41.928821];} };
    let end = {lon: 8.76385, lat: 41.953932, getCoordinatesIn(toto) { return [8.76385, 41.953932];}};
    let profile = "car-test";
    let optimization = "fastest-test";
    let routeRequest = new RouteRequest(resource, start, end, profile, optimization);

    // TODO: better fake osrm response
    const fakeOsrmResponse = {"routes":[{"geometry":"cf|~Fssht@tAgLFiNqJTaEuFiEpEgIxCsLdDwDw@oIac@mAg@cKkTBiBeAaByCqSkHc[mGaQHiGgB_@wL{[_FvBsDmEuEeB{RjGk@e@Z{B","legs":[{"summary":"Avenue Colonel Colonna d'Ornano, Route de Mezzavia","weight":449.7,"duration":449.7,"steps":[{"intersections":[{"out":0,"entry":[true],"bearings":[204],"location":[8.732901,41.928821]}],"driving_side":"right","geometry":"cf|~Fssht@B@","mode":"driving","maneuver":{"bearing_after":204,"bearing_before":0,"location":[8.732901,41.928821],"type":"depart"},"weight":5.3,"duration":5.3,"name":"Avenue du Maréchal Moncey","distance":2.4},{"intersections":[{"out":1,"in":0,"entry":[false,true,true],"bearings":[15,120,300],"location":[8.732889,41.928801]},{"out":0,"in":1,"entry":[true,false,true],"bearings":[105,285,315],"location":[8.734336,41.92853]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[105,135,285],"location":[8.734622,41.92846]}],"driving_side":"right","geometry":"_f|~Fqsht@Rw@Hq@HwBL_ALw@LoAIuCG{BA]AY@SZkC","mode":"driving","maneuver":{"bearing_after":113,"bearing_before":199,"location":[8.732889,41.928801],"modifier":"left","type":"turn"},"ref":"D 11","weight":53.3,"duration":53.3,"name":"Avenue Colonel Colonna d'Ornano","distance":388.2},{"intersections":[{"out":0,"in":3,"entry":[true,false,true,false],"bearings":[15,105,180,285],"location":[8.737468,41.928353]},{"out":3,"in":1,"entry":[true,false,true,true],"bearings":[105,165,285,345],"location":[8.737421,41.928889]},{"out":0,"in":1,"entry":[true,false,false],"bearings":[15,180,345],"location":[8.737359,41.930203]}],"driving_side":"right","geometry":"ec|~Fepit@MC_@Gg@LUFm@PwEEe@Qc@Y","mode":"driving","maneuver":{"bearing_after":9,"bearing_before":104,"location":[8.737468,41.928353],"modifier":"left","type":"turn"},"weight":22.8,"duration":22.8,"name":"Boulevard Dominique Paoli","distance":253.1},{"intersections":[{"out":0,"in":1,"entry":[true,false,true],"bearings":[60,210,270],"location":[8.737582,41.930566]},{"out":0,"in":1,"entry":[true,false,true],"bearings":[60,240,315],"location":[8.737632,41.930591]},{"out":0,"in":2,"entry":[true,false,false],"bearings":[45,105,240],"location":[8.737712,41.93063]},{"out":0,"in":1,"entry":[true,false,true],"bearings":[45,225,330],"location":[8.737925,41.930761]}],"driving_side":"right","geometry":"aq|~F{pit@CIGOYk@g@aAi@aA","mode":"driving","maneuver":{"bearing_after":54,"bearing_before":28,"location":[8.737582,41.930566],"modifier":"slight right","type":"new name"},"weight":14.5,"duration":14.5,"name":"Avenue du Président Kennedy","distance":107.6},{"intersections":[{"out":2,"in":1,"entry":[true,false,true],"bearings":[120,225,330],"location":[8.738593,41.931173]},{"out":2,"in":1,"entry":[true,false,true],"bearings":[45,150,315],"location":[8.738491,41.931273]},{"out":2,"in":1,"entry":[true,false,true],"bearings":[45,135,315],"location":[8.738055,41.931646]},{"out":2,"in":1,"entry":[true,false,true],"bearings":[75,165,345],"location":[8.737414,41.932566]},{"out":0,"in":2,"entry":[true,true,false,true],"bearings":[15,60,165,300],"location":[8.737348,41.932831]},{"out":2,"in":1,"entry":[true,false,true],"bearings":[30,195,345],"location":[8.737389,41.932923]}],"driving_side":"right","geometry":"yt|~Fewit@SRkAtAa@b@gAbAMF_APs@JQGI@aA\\o@d@Y^]Tc@HuBJ","mode":"driving","maneuver":{"bearing_after":322,"bearing_before":49,"location":[8.738593,41.931173],"modifier":"left","type":"end of road"},"weight":28.2,"duration":28.2,"name":"Montée Saint-Jean","distance":426.4},{"intersections":[{"out":2,"in":1,"entry":[false,false,true],"bearings":[135,180,345],"location":[8.736664,41.934585]},{"out":2,"in":1,"entry":[true,false,true],"bearings":[75,165,330],"location":[8.736303,41.935359]}],"driving_side":"right","geometry":"ej}~Fckit@e@PKDIB}Aj@_CfAu@Fu@@e@Q","mode":"driving","maneuver":{"bearing_after":337,"bearing_before":355,"location":[8.736664,41.934585],"modifier":"straight","type":"new name"},"weight":17.5,"duration":17.5,"name":"Route d'Alata","distance":251.1},{"intersections":[{"out":0,"in":1,"entry":[true,false,false],"bearings":[90,195,285],"location":[8.735976,41.936731]}],"driving_side":"right","geometry":"qw}~F{fit@?KAKCIEGGEGAI@","mode":"driving","maneuver":{"exit":1,"bearing_after":95,"bearing_before":16,"location":[8.735976,41.936731],"modifier":"right","type":"roundabout"},"weight":3.3,"duration":3.3,"name":"Boulevard de l'Abbé Recco","distance":34.7},{"intersections":[{"out":0,"in":1,"entry":[true,false,true],"bearings":[75,180,330],"location":[8.736216,41.936918]}],"driving_side":"right","geometry":"wx}~Fkhit@e@aDm@kDs@uDc@_COq@_BgGm@cBOe@","mode":"driving","maneuver":{"exit":1,"bearing_after":71,"bearing_before":351,"location":[8.736216,41.936918],"modifier":"right","type":"exit roundabout"},"weight":28.1,"duration":28.1,"name":"Boulevard de l'Abbé Recco","distance":494.6},{"intersections":[{"out":0,"in":1,"entry":[true,false,false],"bearings":[135,240,330],"location":[8.7417,41.938654]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[60,150,255],"location":[8.74199,41.938595]}],"driving_side":"right","geometry":"qc~~Fsjjt@JS@SCQCKGEMCK?OH","mode":"driving","maneuver":{"exit":2,"bearing_after":130,"bearing_before":57,"location":[8.7417,41.938654],"modifier":"right","type":"roundabout"},"weight":3.8,"duration":3.8,"name":"","distance":61.3},{"intersections":[{"out":0,"in":1,"entry":[true,false,true],"bearings":[45,150,300],"location":[8.742045,41.938866]}],"driving_side":"right","geometry":"}d~~Fyljt@W[[u@uAiCm@gAcDcH[o@Uq@M]Mk@","mode":"driving","maneuver":{"exit":2,"bearing_after":39,"bearing_before":336,"location":[8.742045,41.938866],"modifier":"right","type":"exit roundabout"},"weight":23,"duration":23,"name":"","distance":394.8},{"intersections":[{"out":0,"in":1,"entry":[true,false,false],"bearings":[150,240,345],"location":[8.745834,41.941003]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[75,165,285],"location":[8.746049,41.940898]}],"driving_side":"right","geometry":"gr~~Fmdkt@HKFM@QAQGMIIKEMB","mode":"driving","maneuver":{"exit":2,"bearing_after":146,"bearing_before":66,"location":[8.745834,41.941003],"modifier":"right","type":"roundabout"},"weight":3.9000000000000004,"duration":3.9000000000000004,"name":"","distance":59.2},{"intersections":[{"out":0,"in":1,"entry":[true,false,true],"bearings":[60,180,330],"location":[8.746274,41.941128]},{"out":0,"in":1,"entry":[true,false,true],"bearings":[75,240,285],"location":[8.746626,41.94126]},{"out":1,"in":2,"entry":[false,true,false],"bearings":[30,75,255],"location":[8.747412,41.941483]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[70,82,250],"location":[8.747665,41.941553]},{"out":0,"in":2,"entry":[true,false,false,true],"bearings":[75,240,255,270],"location":[8.749168,41.94197]}],"driving_side":"right","geometry":"as~~Fegkt@YgAG[WsAKk@Ms@_@qBs@yDG]SgA","mode":"driving","maneuver":{"exit":2,"bearing_after":61,"bearing_before":351,"location":[8.746274,41.941128],"modifier":"right","type":"exit roundabout"},"weight":17.6,"duration":17.6,"name":"","distance":302.1},{"intersections":[{"out":1,"in":2,"entry":[false,true,false],"bearings":[0,150,255],"location":[8.749676,41.942111]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[75,180,285],"location":[8.749846,41.942021]},{"out":0,"in":2,"entry":[true,false,false],"bearings":[15,180,225],"location":[8.75,41.942081]}],"driving_side":"right","geometry":"ey~~Fo|kt@JIDWAMIOSE","mode":"driving","maneuver":{"exit":2,"bearing_after":146,"bearing_before":68,"location":[8.749676,41.942111],"modifier":"right","type":"roundabout"},"weight":3.1,"duration":3.1,"name":"Boulevard Louis Campi","distance":44.2},{"intersections":[{"out":0,"in":1,"entry":[true,false,true],"bearings":[75,195,330],"location":[8.750029,41.94218]}],"driving_side":"right","geometry":"sy~~Fu~kt@_AaGYkA_C}I_@iAW_A","mode":"driving","maneuver":{"exit":2,"bearing_after":70,"bearing_before":11,"location":[8.750029,41.94218],"modifier":"right","type":"exit roundabout"},"weight":21.4,"duration":21.4,"name":"Boulevard Louis Campi","distance":373.6},{"intersections":[{"out":0,"in":1,"entry":[true,false,false],"bearings":[135,240,345],"location":[8.754141,41.94355]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[75,135,255],"location":[8.754363,41.943511]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[30,90,210],"location":[8.754453,41.943572]}],"driving_side":"right","geometry":"eb__Gkxlt@FMBOCMCKGECCO@","mode":"driving","maneuver":{"exit":1,"bearing_after":135,"bearing_before":61,"location":[8.754141,41.94355],"modifier":"right","type":"roundabout"},"weight":2.6999999999999997,"duration":2.6999999999999997,"name":"Rue Louis Campi","distance":43.2},{"intersections":[{"out":0,"in":1,"entry":[true,false,true],"bearings":[60,180,330],"location":[8.754461,41.943674]}],"driving_side":"right","geometry":"}b__Gkzlt@oC}Hg@iBy@qCG_AEm@C}@","mode":"driving","maneuver":{"exit":1,"bearing_after":57,"bearing_before":357,"location":[8.754461,41.943674],"modifier":"right","type":"exit roundabout"},"weight":19.9,"duration":19.9,"name":"Rue Louis Campi","distance":343.5},{"intersections":[{"out":1,"in":2,"entry":[false,true,false],"bearings":[0,165,270],"location":[8.758172,41.944968]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[120,195,315],"location":[8.758272,41.944843]},{"out":0,"in":2,"entry":[true,false,false],"bearings":[90,195,285],"location":[8.758437,41.944791]},{"out":0,"in":2,"entry":[true,true,false],"bearings":[30,75,225],"location":[8.758702,41.944872]},{"out":0,"in":2,"entry":[true,false,false],"bearings":[0,105,195],"location":[8.75877,41.94501]}],"driving_side":"right","geometry":"ak__Gqqmt@LGJKDOBQ?IAKEQGKMIMCK@KDIHEL","mode":"driving","maneuver":{"exit":3,"bearing_after":160,"bearing_before":85,"location":[8.758172,41.944968],"modifier":"right","type":"roundabout"},"ref":"T 22","weight":8.8,"duration":8.8,"name":"Route de Mezzavia","distance":100.3},{"intersections":[{"out":0,"in":1,"entry":[true,false,true],"bearings":[45,135,285],"location":[8.758609,41.945214]}],"driving_side":"right","geometry":"ql__Gitmt@[e@Uu@s@_D{@oCiB_CkBmE{@iCM_@Q}@","mode":"driving","maneuver":{"exit":3,"bearing_after":45,"bearing_before":306,"location":[8.758609,41.945214],"modifier":"right","type":"exit roundabout"},"ref":"T 22","weight":49.4,"duration":49.4,"name":"Route de Mezzavia","distance":480.3},{"intersections":[{"out":2,"in":1,"entry":[true,false,true],"bearings":[60,255,330],"location":[8.763419,41.947548]}],"driving_side":"right","geometry":"e{__Gkrnt@u@h@g@\\k@\\m@Pg@?aAe@i@cAgAcB{Ac@yBaA","mode":"driving","maneuver":{"bearing_after":330,"bearing_before":67,"location":[8.763419,41.947548],"modifier":"left","type":"turn"},"weight":57.4,"duration":57.4,"name":"","distance":397.2},{"intersections":[{"out":2,"in":1,"entry":[true,false,true],"bearings":[45,195,345],"location":[8.764357,41.950639]},{"out":2,"in":1,"entry":[true,false,true],"bearings":[60,150,345],"location":[8.763892,41.951919]}],"driving_side":"right","geometry":"on`_Ggxnt@iBXyA`@{@`@c@RkAn@s@VaCf@uAh@","mode":"driving","maneuver":{"bearing_after":348,"bearing_before":21,"location":[8.764357,41.950639],"modifier":"slight left","type":"fork"},"weight":53.5,"duration":53.5,"name":"","distance":372},{"intersections":[{"out":0,"in":1,"entry":[true,false,true],"bearings":[15,165,315],"location":[8.763022,41.953818]}],"driving_side":"right","geometry":"kba_G{ont@QIQIGQA]DUH[Lk@","mode":"driving","maneuver":{"bearing_after":18,"bearing_before":338,"location":[8.763022,41.953818],"modifier":"slight right","type":"fork"},"weight":12.2,"duration":12.2,"name":"","distance":85.1},{"intersections":[{"in":0,"entry":[true],"bearings":[294],"location":[8.763831,41.953897]}],"driving_side":"right","geometry":"{ba_G}tnt@","mode":"driving","maneuver":{"bearing_after":0,"bearing_before":114,"location":[8.763831,41.953897],"type":"arrive"},"weight":0,"duration":0,"name":"","distance":0}],"distance":5015}],"weight_name":"routability","weight":449.7,"duration":449.7,"distance":5015}],"waypoints":[{"hint":"dQ0AgO8zAIAPAAAABAAAAIIAAAAAAAAAoawtQWjKG0D0ELRCAAAAAA8AAAAEAAAAggAAAAAAAAAMAAAA5UCFAHXIfwLlQIUAdch_AgMAvwy-YJX8","name":"Avenue du Maréchal Moncey","location":[8.732901,41.928821]},{"hint":"8iwAgCEtAIAAAAAAFwAAAHoAAAAiAAAApgWzPh9jf0E3v6lCdn-wQQAAAAAXAAAAegAAACIAAAAMAAAAt7mFAGkqgALKuYUAjCqAAgcA_wa-YJX8","name":"","location":[8.763831,41.953897]}]};

    const fakeClient = sinon.mock(OSRM);
    fakeClient.route = sinon.stub().callsArgOnWith(1, source, null, fakeOsrmResponse);
    source._osrm = fakeClient;

    it('computeRequest() should return a routeResponse', async function() {
      const routeResponse = await source.computeRequest(routeRequest);
      assert.equal(routeResponse.resource, "resource-test");
    });

  });

});
