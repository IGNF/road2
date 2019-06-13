const assert = require('assert');
const Service = require('../../../src/js/service/service');
const RouteRequest = require('../../../src/js/requests/routeRequest');
const SourceManager = require('../../../src/js/sources/sourceManager');
const Resource = require('../../../src/js/resources/resource');
const Source = require('../../../src/js/sources/source');
const logManager = require('../logManager');
const path = require('path');
const fs = require('fs');

const sinon = require('sinon');

describe('Test de la classe Service', function() {

  let service = new Service();
  let configuration;

  before(function() {

    // runs before all tests in this block
    logManager.manageLogs();

    // Chargement de la configuration pour les tests
    let file = path.resolve(__dirname,'../config/road2.json');
    configuration = JSON.parse(fs.readFileSync(file));

    // Chargement de la configuration pour les requêtes http
    logsConf = logManager.getLogsConf();
    service.logConfiguration = logsConf;

  });

  describe('Test de checkAndSaveGlobalConfiguration()', function() {

    it('checkAndSaveGlobalConfiguration() return true avec une configuration correcte', function() {
      assert.equal(service.checkAndSaveGlobalConfiguration(configuration), true);
    });

  });

  describe('Test de loadResources()', function() {

    it('loadResources() return true avec une configuration correcte', function() {
      assert.equal(service.loadResources(), true);
    });

  });

  describe('Test de loadSources()', function() {

    it('loadSources() return true avec une configuration correcte', async function() {
      const sourceManager = sinon.mock(SourceManager);
      // Mocking the source manager
      sourceManager.listOfSourceIds = ["toto"];
      sourceManager.sourceDescriptions = {"toto": 0};
      sourceManager.createSource = sinon.stub().returns(sinon.mock(Source));
      sourceManager.connectSource = sinon.stub().returns(true);
      sourceManager.disconnectSource = sinon.stub().returns(true);
      service._sourceManager = sourceManager;

      await service.loadSources();
      await service.disconnectAllSources();
    });

  });

  describe('Test de createServer() et stopServer()', function() {

    it('createServer() return true avec une configuration correcte', function() {
      assert.equal(service.createServer("../apis/", ""), true);
    });

    after(function(done) {
      service.stopServer(done);
    });

  });

  describe('Test de computeRequest()', function() {

    before(function() {
      service.createServer("../apis/", "");
    });

    it('computeRequest() avec une requete correcte', async function() {
      const request = new RouteRequest("corse-osm", {lon: 8.732901, lat: 41.928821}, {lon: 8.732901, lat: 41.953932}, "car", "fastest");

      const resource = sinon.mock(Resource);
      resource.getSourceIdFromRequest = sinon.stub().returns("sourcetest");

      const fakeRouteResponse = {"resource":"corse-osm","start":"8.732901,41.928821","end":"8.763831,41.953897","profile":"car","optimization":"fastest","geometry":"cf|~Fssht@tAgLFiNqJTaEuFiEpEgIxCsLdDwDw@oIac@mAg@cKkTBiBeAaByCqSkHc[mGaQHiGgB_@wL{[_FvBsDmEuEeB{RjGk@e@Z{B","portions":[{"start":"8.732901,41.928821","end":"8.763831,41.953897","steps":[{"geometry":"cf|~Fssht@B@"},{"geometry":"_f|~Fqsht@Rw@Hq@HwBL_ALw@LoAIuCG{BA]AY@SZkC"},{"geometry":"ec|~Fepit@MC_@Gg@LUFm@PwEEe@Qc@Y"},{"geometry":"aq|~F{pit@CIGOYk@g@aAi@aA"},{"geometry":"yt|~Fewit@SRkAtAa@b@gAbAMF_APs@JQGI@aA\\o@d@Y^]Tc@HuBJ"},{"geometry":"ej}~Fckit@e@PKDIB}Aj@_CfAu@Fu@@e@Q"},{"geometry":"qw}~F{fit@?KAKCIEGGEGAI@"},{"geometry":"wx}~Fkhit@e@aDm@kDs@uDc@_COq@_BgGm@cBOe@"},{"geometry":"qc~~Fsjjt@JS@SCQCKGEMCK?OH"},{"geometry":"}d~~Fyljt@W[[u@uAiCm@gAcDcH[o@Uq@M]Mk@"},{"geometry":"gr~~Fmdkt@HKFM@QAQGMIIKEMB"},{"geometry":"as~~Fegkt@YgAG[WsAKk@Ms@_@qBs@yDG]SgA"},{"geometry":"ey~~Fo|kt@JIDWAMIOSE"},{"geometry":"sy~~Fu~kt@_AaGYkA_C}I_@iAW_A"},{"geometry":"eb__Gkxlt@FMBOCMCKGECCO@"},{"geometry":"}b__Gkzlt@oC}Hg@iBy@qCG_AEm@C}@"},{"geometry":"ak__Gqqmt@LGJKDOBQ?IAKEQGKMIMCK@KDIHEL"},{"geometry":"ql__Gitmt@[e@Uu@s@_D{@oCiB_CkBmE{@iCM_@Q}@"},{"geometry":"e{__Gkrnt@u@h@g@\\k@\\m@Pg@?aAe@i@cAgAcB{Ac@yBaA"},{"geometry":"on`_Ggxnt@iBXyA`@{@`@c@RkAn@s@VaCf@uAh@"},{"geometry":"kba_G{ont@QIQIGQA]DUH[Lk@"},{"geometry":"{ba_G}tnt@"}]}]};

      const fakeSource = sinon.mock(Source);
      fakeSource.computeRequest = sinon.stub().returns(fakeRouteResponse);

      const fakeSourceCatalog = {"sourcetest": fakeSource};
      service._sourceCatalog = fakeSourceCatalog;

      const fakeResourceCatalog = {"corse-osm": resource};
      service._resourceCatalog = fakeResourceCatalog;

      const response = await service.computeRequest(request);
      assert.equal(response.resource, "corse-osm");
    });

    after(function(done) {
      service.stopServer(done);
    });

  });

});
