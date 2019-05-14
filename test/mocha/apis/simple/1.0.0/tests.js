const assert = require('assert');
const logManager = require('../../../logManager');
const Service = require('../../../../../src/js/service/service');
const RouteResponse = require('../../../../../src/js/responses/routeResponse');
const Route = require('../../../../../src/js/responses/route');
const Portion = require('../../../../../src/js/responses/portion');
const RouteRequest = require('../../../../../src/js/requests/routeRequest');
const Resource = require('../../../../../src/js/resources/resource');
const Source = require('../../../../../src/js/sources/source');

const controler = require('../../../../../src/js/apis/simple/1.0.0/controler/controler');
const sinon = require('sinon');

describe('Test de l\'api simple 1.0.0', function() {

  before(function() {

    // runs before all tests in this block
    logManager.manageLogs();

  });

  describe('Test de la fonction checkRouteParameters()', function() {

    // Pour ne pas dépendre de la classe service
    let service = sinon.mock(Service);

    // Création des paramètres utilisateur
    let parameters = {};
    parameters.resource = "corse-osm";
    parameters.start = "8.732901,41.928821";
    parameters.end = "8.76385,41.953932";

    // Pour ne pas dépendre de la classe resource
    const resource = sinon.mock(Resource);
    resource.defaultProfile = "car";
    resource.defaultOptimization = "fastest";
    resource.linkedSource = {};
    resource.linkedSource["carfastest"] = sinon.mock(Source);

    // Comportement attendu
    service.verifyResourceExistenceById = sinon.stub().withArgs(parameters.resource).returns(true);
    service.getResourceById = sinon.stub().withArgs(parameters.resource).returns(resource);

    // Création d'un objet routeRequest
    let routeRequest = new RouteRequest("corse-osm", {lon: 8.732901, lat: 41.928821}, {lon: 8.76385, lat: 41.953932}, "car", "fastest");

    it('checkRouteParameters() avec les bons parametres', async function() {
      // await service.loadSources();
      assert.deepEqual(controler.checkRouteParameters(parameters, service), routeRequest);
      // await service.disconnectAllSources();
    });

  });

  describe('Test de la fonction writeRouteResponse()', function() {
    // Réponse attendue
    let referenceResponse = {};
    referenceResponse = {"resource":"corse-osm","start":"8.732901,41.928821","end":"8.763831,41.953897","profile":"car","optimization":"fastest","geometry":"cf|~Fssht@tAgLFiNqJTaEuFiEpEgIxCsLdDwDw@oIac@mAg@cKkTBiBeAaByCqSkHc[mGaQHiGgB_@wL{[_FvBsDmEuEeB{RjGk@e@Z{B","portions":[{"start":"8.732901,41.928821","end":"8.763831,41.953897","steps":[{"geometry":"cf|~Fssht@B@"},{"geometry":"_f|~Fqsht@Rw@Hq@HwBL_ALw@LoAIuCG{BA]AY@SZkC"},{"geometry":"ec|~Fepit@MC_@Gg@LUFm@PwEEe@Qc@Y"},{"geometry":"aq|~F{pit@CIGOYk@g@aAi@aA"},{"geometry":"yt|~Fewit@SRkAtAa@b@gAbAMF_APs@JQGI@aA\\o@d@Y^]Tc@HuBJ"},{"geometry":"ej}~Fckit@e@PKDIB}Aj@_CfAu@Fu@@e@Q"},{"geometry":"qw}~F{fit@?KAKCIEGGEGAI@"},{"geometry":"wx}~Fkhit@e@aDm@kDs@uDc@_COq@_BgGm@cBOe@"},{"geometry":"qc~~Fsjjt@JS@SCQCKGEMCK?OH"},{"geometry":"}d~~Fyljt@W[[u@uAiCm@gAcDcH[o@Uq@M]Mk@"},{"geometry":"gr~~Fmdkt@HKFM@QAQGMIIKEMB"},{"geometry":"as~~Fegkt@YgAG[WsAKk@Ms@_@qBs@yDG]SgA"},{"geometry":"ey~~Fo|kt@JIDWAMIOSE"},{"geometry":"sy~~Fu~kt@_AaGYkA_C}I_@iAW_A"},{"geometry":"eb__Gkxlt@FMBOCMCKGECCO@"},{"geometry":"}b__Gkzlt@oC}Hg@iBy@qCG_AEm@C}@"},{"geometry":"ak__Gqqmt@LGJKDOBQ?IAKEQGKMIMCK@KDIHEL"},{"geometry":"ql__Gitmt@[e@Uu@s@_D{@oCiB_CkBmE{@iCM_@Q}@"},{"geometry":"e{__Gkrnt@u@h@g@\\k@\\m@Pg@?aAe@i@cAgAcB{Ac@yBaA"},{"geometry":"on`_Ggxnt@iBXyA`@{@`@c@RkAn@s@VaCf@uAh@"},{"geometry":"kba_G{ont@QIQIGQA]DUH[Lk@"},{"geometry":"{ba_G}tnt@"}]}]}

    it('writeRouteResponse() avec les bons parametres', async function() {
      // Ce test semble être trivial et inutile, car aucun traitement n'est fait dans writeRouteresponse

      // Création d'une routeResponse
      const portion = sinon.mock(Portion);
      portion.start = '8.732901,41.928821';
      portion.end = '8.763831,41.953897';
      portion.steps = [{"geometry":"cf|~Fssht@B@"},{"geometry":"_f|~Fqsht@Rw@Hq@HwBL_ALw@LoAIuCG{BA]AY@SZkC"},{"geometry":"ec|~Fepit@MC_@Gg@LUFm@PwEEe@Qc@Y"},{"geometry":"aq|~F{pit@CIGOYk@g@aAi@aA"},{"geometry":"yt|~Fewit@SRkAtAa@b@gAbAMF_APs@JQGI@aA\\o@d@Y^]Tc@HuBJ"},{"geometry":"ej}~Fckit@e@PKDIB}Aj@_CfAu@Fu@@e@Q"},{"geometry":"qw}~F{fit@?KAKCIEGGEGAI@"},{"geometry":"wx}~Fkhit@e@aDm@kDs@uDc@_COq@_BgGm@cBOe@"},{"geometry":"qc~~Fsjjt@JS@SCQCKGEMCK?OH"},{"geometry":"}d~~Fyljt@W[[u@uAiCm@gAcDcH[o@Uq@M]Mk@"},{"geometry":"gr~~Fmdkt@HKFM@QAQGMIIKEMB"},{"geometry":"as~~Fegkt@YgAG[WsAKk@Ms@_@qBs@yDG]SgA"},{"geometry":"ey~~Fo|kt@JIDWAMIOSE"},{"geometry":"sy~~Fu~kt@_AaGYkA_C}I_@iAW_A"},{"geometry":"eb__Gkxlt@FMBOCMCKGECCO@"},{"geometry":"}b__Gkzlt@oC}Hg@iBy@qCG_AEm@C}@"},{"geometry":"ak__Gqqmt@LGJKDOBQ?IAKEQGKMIMCK@KDIHEL"},{"geometry":"ql__Gitmt@[e@Uu@s@_D{@oCiB_CkBmE{@iCM_@Q}@"},{"geometry":"e{__Gkrnt@u@h@g@\\k@\\m@Pg@?aAe@i@cAgAcB{Ac@yBaA"},{"geometry":"on`_Ggxnt@iBXyA`@{@`@c@RkAn@s@VaCf@uAh@"},{"geometry":"kba_G{ont@QIQIGQA]DUH[Lk@"},{"geometry":"{ba_G}tnt@"}];

      const route = sinon.mock(Route);
      route.geometry = 'cf|~Fssht@tAgLFiNqJTaEuFiEpEgIxCsLdDwDw@oIac@mAg@cKkTBiBeAaByCqSkHc[mGaQHiGgB_@wL{[_FvBsDmEuEeB{RjGk@e@Z{B';
      route.portions = [portion];

      const routeResponse = sinon.mock(RouteResponse);
      routeResponse.resource = 'corse-osm';
      routeResponse.start = '8.732901,41.928821';
      routeResponse.end = '8.763831,41.953897';
      routeResponse.profile = 'car';
      routeResponse.optimization = 'fastest';
      routeResponse.routes = [route];

      assert.deepEqual(controler.writeRouteResponse(routeResponse), referenceResponse);
    });

  });

  // after(function(done) {
  //   service.stopServer(done);
  // });

});
