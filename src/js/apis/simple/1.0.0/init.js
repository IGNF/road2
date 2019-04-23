'use strict';

const log4js = require('log4js');

var LOGGER = log4js.getLogger("INIT");

module.exports = {

  /**
  *
  * @function
  * @name createGetCapabilities
  * @description Fonction utilisée pour créer le GetCapabilities
  * @param {object} app - App ExpressJS
  * @param {string} uid - uid de l'api. Il permet de stocker des objets dans app.
  * @return {boolean} True si tout s'est bien passé et False sinon
  *
  */

  createGetCapabilities: function(app, uid) {

    // récupération du service
    let service = app.get("service");

    // récupération de la configuration de l'application
    let globalConfiguration = service.configuration;

    //création du getCapabilities
    let getCapabilities = {};

    // info
    // info.name
    getCapabilities.info = {};
    getCapabilities.info.name = globalConfiguration.application.name;
    // info.description
    getCapabilities.info.description = globalConfiguration.application.description;
    // info.url
    getCapabilities.info.url = globalConfiguration.application.url;

    // api
    getCapabilities.api = {};
    // api.name
    getCapabilities.api.name = "simple";
    // api.version
    getCapabilities.api.version = "1.0.0";

    // --- operations
    getCapabilities.operations = new Array();

    // route
    let routeDescription = {};
    // route.id
    routeDescription.id = "route";
    // route.description
    routeDescription.description = "Calculer un itinéraire.";
    // route.url
    routeDescription.url = "/route?";
    // route.methods
    routeDescription.methods = new Array();
    routeDescription.methods.push("GET");

    // -- route.parameters
    routeDescription.parameters = new Array();

    // route.parameters.resource
    let resourceParameterDescription = {};
    resourceParameterDescription.name = "resource";
    resourceParameterDescription.in = "query";
    resourceParameterDescription.description = "Ressource utilisée pour le calcul. Les valeurs disponibles sont présentes dans la partie ressources du GetCapabilities.";
    resourceParameterDescription.required = "true";
    resourceParameterDescription.default = "false";
    resourceParameterDescription.schema = {};
    resourceParameterDescription.schema.type = "string";
    resourceParameterDescription.example = "bduni";
    routeDescription.parameters.push(resourceParameterDescription);

    // route.parameters.start
    let startParameterDescription = {};
    startParameterDescription.name = "start";
    startParameterDescription.in = "query";
    startParameterDescription.description = "Point de départ.";
    startParameterDescription.required = "true";
    startParameterDescription.default = "false";
    startParameterDescription.schema = {};
    startParameterDescription.schema.type = "string";
    startParameterDescription.example = "48.849319,2.337306";
    routeDescription.parameters.push(startParameterDescription);

    // route.parameters.end
    let endParameterDescription = {};
    endParameterDescription.name = "end";
    endParameterDescription.in = "query";
    endParameterDescription.description = "Point d'arrivée.";
    endParameterDescription.required = "true";
    endParameterDescription.default = "false";
    endParameterDescription.schema = {};
    endParameterDescription.schema.type = "string";
    endParameterDescription.example = "48.852891,2.367776";
    routeDescription.parameters.push(endParameterDescription);

    // route.parameters.intermediates
    let intermediatesParameterDescription = {};
    intermediatesParameterDescription.name = "intermediates";
    intermediatesParameterDescription.in = "query";
    intermediatesParameterDescription.description = "Point(s) intermédiaires.";
    intermediatesParameterDescription.required = "true";
    intermediatesParameterDescription.default = "false";
    intermediatesParameterDescription.schema = {};
    intermediatesParameterDescription.schema.type = "array";
    intermediatesParameterDescription.schema.items = {};
    intermediatesParameterDescription.schema.items.type = "string";
    intermediatesParameterDescription.explode = "false";
    intermediatesParameterDescription.style = "pipeDelimited";
    intermediatesParameterDescription.example = "48.852890,2.368776|48.842891,2.367976";
    routeDescription.parameters.push(intermediatesParameterDescription);

    // route.parameters.profile
    let profileParameterDescription = {};
    profileParameterDescription.name = "profile";
    profileParameterDescription.in = "query";
    profileParameterDescription.description = "Mode de déplacement utilisé pour le calcul.";
    profileParameterDescription.required = "false";
    profileParameterDescription.default = "true";
    profileParameterDescription.schema = {};
    profileParameterDescription.schema.type = "enumeration";
    profileParameterDescription.example = "car";
    routeDescription.parameters.push(profileParameterDescription);

    // route.parameters.optimization
    let optimizationParameterDescription = {};
    optimizationParameterDescription.name = "optimization";
    optimizationParameterDescription.in = "query";
    optimizationParameterDescription.description = "Optimisation utilisée pour le calcul.";
    optimizationParameterDescription.required = "false";
    optimizationParameterDescription.default = "true";
    optimizationParameterDescription.schema = {};
    optimizationParameterDescription.schema.type = "enumeration";
    optimizationParameterDescription.example = "fastest";
    routeDescription.parameters.push(optimizationParameterDescription);

    // route.parameters.getGeometry
    let getGeometryParameterDescription = {};
    getGeometryParameterDescription.name = "getGeometry";
    getGeometryParameterDescription.in = "query";
    getGeometryParameterDescription.description = "Présence de la géométrie détaillée dans la réponse.";
    getGeometryParameterDescription.required = "false";
    getGeometryParameterDescription.default = "true";
    getGeometryParameterDescription.schema = {};
    getGeometryParameterDescription.schema.type = "boolean";
    getGeometryParameterDescription.example = "true";
    routeDescription.parameters.push(getGeometryParameterDescription);

    // -- end route.parameters

    getCapabilities.operations.push(routeDescription);
    // --- end operations

    // --- resources
    getCapabilities.resources = new Array();
    let resources = service.resourceCatalog;

    for(let resourceId in resources) {

      let resourceDescription = {};
      let localResource = resources[resourceId];

      // resource.id
      resourceDescription.id = localResource.id;

      // en fonction de son type, la description d'une ressource pourra être différente
      if (localResource.type === "osrm") {

        // resource.description
        resourceDescription.description = localResource.configuration.description;

        // -- resource.availableOperations
        resourceDescription.availableOperations = new Array();

        // - route
        let routeAvailableOperation = {};
        routeAvailableOperation.id = "route";
        routeAvailableOperation.availableParameters = new Array();

        // récupération de la description
        let routeDescriptionFromResource = {};
        for (let i = 0; i < localResource.configuration.availableOperations.length; i++) {
          if (localResource.configuration.availableOperations[i].id === "route") {
            routeDescriptionFromResource = localResource.configuration.availableOperations[i];
          }
        }

        // route.resource
        let routeResource = {};
        routeResource.id = "resource";
        routeResource.values = localResource.id;
        routeAvailableOperation.availableParameters.push(routeResource);

        // route.start
        let routeStart = {};
        routeStart.id = "start";
        routeStart.values = {};
        routeStart.values.bbox = localResource.configuration.boundingBox;
        routeStart.values.projection = localResource.configuration.defaultProjection;
        routeAvailableOperation.availableParameters.push(routeStart);

        // route.end
        let routeEnd = {};
        routeEnd.id = "end";
        routeEnd.values = {};
        routeEnd.values.bbox = localResource.configuration.boundingBox;
        routeEnd.values.projection = localResource.configuration.defaultProjection;
        routeAvailableOperation.availableParameters.push(routeEnd);

        // route.intermediates
        let routeIntermediates = {};
        routeIntermediates.id = "intermediates";
        routeIntermediates.values = {};
        routeIntermediates.values.bbox = localResource.configuration.boundingBox;
        routeIntermediates.values.projection = localResource.configuration.defaultProjection;
        routeIntermediates.maxItems = routeDescriptionFromResource.maxIntermediatePoints;
        routeAvailableOperation.availableParameters.push(routeIntermediates);

        // route.profile
        let routeProfile = {};
        routeProfile.id = "profile";
        routeProfile.values = localResource.defaultProfile;
        routeAvailableOperation.availableParameters.push(routeProfile);

        // route.optimization
        let routeOptimization = {};
        routeOptimization.id = "optimization";
        routeOptimization.values = localResource.defaultOptimization;
        routeAvailableOperation.availableParameters.push(routeOptimization);

        // route.getGeometry
        let routeGetGeometry = {};
        routeGetGeometry.id = "getGeometry";
        for (let i= 0; i < routeDescriptionFromResource.defaultParameters.length; i++) {
          if (routeDescriptionFromResource.defaultParameters[i].id === "getGeometry") {
            routeGetGeometry.values = routeDescriptionFromResource.defaultParameters[i].default;
            break;
          }
        }
        routeAvailableOperation.availableParameters.push(routeGetGeometry);

        resourceDescription.availableOperations.push(routeAvailableOperation);
        // - end route

        // -- end resource.availableOperations

      }

      getCapabilities.resources.push(resourceDescription);

    } // end for(let resourceId in resources)

    // --- end resources

    // sauvegarde du getCapabilities
    app.set(uid + "-getcap", getCapabilities);

    return true;

  },

  /**
  *
  * @function
  * @name run
  * @description Fonction lancée avant la mise en service du serveur.
  * @param {object} app - App ExpressJS
  * @param {string} uid - uid de l'api. Il permet de stocker des objets dans app.
  * @return {boolean} True si tout s'est bien passé et False sinon
  *
  */

  run: function(app, uid) {
    try {
      // Création du GetCapabilities
      if (!this.createGetCapabilities(app, uid)) {
        LOGGER.error("Erreur lors de la creation du GetCapabilities.");
        return false;
      } else {
        // tout s'est bien passé
      }
      return true;

    } catch (err) {
      LOGGER.error("Erreur lors de la creation du GetCapabilities.", err);
      return false;
    }

  }

}
