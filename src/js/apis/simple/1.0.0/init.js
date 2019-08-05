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

    // On vérifie que l'opération route est disponible et on l'intégre seulement si elle est
    if (service.verifyAvailabilityOperation("route")) {

      // récupération de l'opération route du service
      let serviceOpRoute = service.getOperationById("route");

      let routeDescription = {};
      // route.id
      routeDescription.id = "route";
      // route.description
      routeDescription.description = serviceOpRoute.description;
      // route.url
      routeDescription.url = "/route?";
      // route.methods
      routeDescription.methods = new Array();
      routeDescription.methods.push("GET");

      // -- route.parameters
      routeDescription.parameters = new Array();

      // route.parameters.resource
      let resourceServiceParameter = serviceOpRoute.getParameterById("resource");
      let resourceParameterDescription = {};
      resourceParameterDescription.name = "resource";
      resourceParameterDescription.in = "query";
      resourceParameterDescription.description = resourceServiceParameter.description;
      resourceParameterDescription.required = resourceServiceParameter.required;
      resourceParameterDescription.default = resourceServiceParameter.defaultValue;
      resourceParameterDescription.schema = {};
      resourceParameterDescription.schema.type = "string";
      resourceParameterDescription.example = "bduni";
      routeDescription.parameters.push(resourceParameterDescription);

      // route.parameters.start
      let startServiceParameter = serviceOpRoute.getParameterById("start");
      let startParameterDescription = {};
      startParameterDescription.name = "start";
      startParameterDescription.in = "query";
      startParameterDescription.description = startServiceParameter.description;
      startParameterDescription.required = startServiceParameter.required;
      startParameterDescription.default = startServiceParameter.defaultValue;
      startParameterDescription.schema = {};
      startParameterDescription.schema.type = "string";
      startParameterDescription.example = "48.849319,2.337306";
      routeDescription.parameters.push(startParameterDescription);

      // route.parameters.end
      let endServiceParameter = serviceOpRoute.getParameterById("end");
      let endParameterDescription = {};
      endParameterDescription.name = "end";
      endParameterDescription.in = "query";
      endParameterDescription.description = endServiceParameter.description;
      endParameterDescription.required = endServiceParameter.required;
      endParameterDescription.default = endServiceParameter.defaultValue;
      endParameterDescription.schema = {};
      endParameterDescription.schema.type = "string";
      endParameterDescription.example = "48.852891,2.367776";
      routeDescription.parameters.push(endParameterDescription);

      // route.parameters.intermediates
      let intermediatesServiceParameter = serviceOpRoute.getParameterById("intermediates");
      let intermediatesParameterDescription = {};
      intermediatesParameterDescription.name = "intermediates";
      intermediatesParameterDescription.in = "query";
      intermediatesParameterDescription.description = intermediatesServiceParameter.description;
      intermediatesParameterDescription.required = intermediatesServiceParameter.required;
      intermediatesParameterDescription.default = intermediatesServiceParameter.defaultValue;
      intermediatesParameterDescription.schema = {};
      intermediatesParameterDescription.schema.type = "array";
      intermediatesParameterDescription.schema.items = {};
      intermediatesParameterDescription.schema.items.type = "string";
      intermediatesParameterDescription.explode = "false";
      intermediatesParameterDescription.style = "pipeDelimited";
      intermediatesParameterDescription.example = "48.852890,2.368776|48.842891,2.367976";
      routeDescription.parameters.push(intermediatesParameterDescription);

      // route.parameters.profile
      let profilesServiceParameter = serviceOpRoute.getParameterById("profile");
      let profileParameterDescription = {};
      profileParameterDescription.name = "profile";
      profileParameterDescription.in = "query";
      profileParameterDescription.description = profilesServiceParameter.description;
      profileParameterDescription.required = profilesServiceParameter.required;
      profileParameterDescription.default = profilesServiceParameter.defaultValue;
      profileParameterDescription.schema = {};
      profileParameterDescription.schema.type = "enumeration";
      profileParameterDescription.example = "car";
      routeDescription.parameters.push(profileParameterDescription);

      // route.parameters.optimization
      let optimizationServiceParameter = serviceOpRoute.getParameterById("optimization");
      let optimizationParameterDescription = {};
      optimizationParameterDescription.name = "optimization";
      optimizationParameterDescription.in = "query";
      optimizationParameterDescription.description = optimizationServiceParameter.description;
      optimizationParameterDescription.required = optimizationServiceParameter.required;
      optimizationParameterDescription.default = optimizationServiceParameter.defaultValue;
      optimizationParameterDescription.schema = {};
      optimizationParameterDescription.schema.type = "enumeration";
      optimizationParameterDescription.example = "fastest";
      routeDescription.parameters.push(optimizationParameterDescription);

      // route.parameters.getGeometry
      let getGeometryServiceParameter = serviceOpRoute.getParameterById("stepsGeometry");
      let getGeometryParameterDescription = {};
      getGeometryParameterDescription.name = "getGeometry";
      getGeometryParameterDescription.in = "query";
      getGeometryParameterDescription.description = getGeometryServiceParameter.description;
      getGeometryParameterDescription.required = getGeometryServiceParameter.required;
      getGeometryParameterDescription.default = getGeometryServiceParameter.defaultValue;
      getGeometryParameterDescription.schema = {};
      getGeometryParameterDescription.schema.type = "boolean";
      getGeometryParameterDescription.example = "true";
      routeDescription.parameters.push(getGeometryParameterDescription);

      // route.parameters.waysAttributes
      let waysAttributesServiceParameter = serviceOpRoute.getParameterById("waysAttributes");
      let waysAttributesParameterDescription = {};
      waysAttributesParameterDescription.name = "waysAttributes";
      waysAttributesParameterDescription.in = "query";
      waysAttributesParameterDescription.description = waysAttributesServiceParameter.description;
      waysAttributesParameterDescription.required = waysAttributesServiceParameter.required;
      waysAttributesParameterDescription.default = waysAttributesServiceParameter.defaultValue;
      waysAttributesParameterDescription.schema = {};
      waysAttributesParameterDescription.schema.type = "array";
      waysAttributesParameterDescription.schema.items = {};
      waysAttributesParameterDescription.schema.items.type = "string";
      waysAttributesParameterDescription.explode = "false";
      waysAttributesParameterDescription.style = "pipeDelimited";
      waysAttributesParameterDescription.example = "name|type";
      routeDescription.parameters.push(waysAttributesParameterDescription);

      // route.parameters.geometryFormat
      let geometryFormatServiceParameter = serviceOpRoute.getParameterById("geometryFormat");
      let geometryFormatParameterDescription = {};
      geometryFormatParameterDescription.name = "geometryFormat";
      geometryFormatParameterDescription.in = "query";
      geometryFormatParameterDescription.description = geometryFormatServiceParameter.description;
      geometryFormatParameterDescription.required = geometryFormatServiceParameter.required;
      geometryFormatParameterDescription.default = geometryFormatServiceParameter.defaultValue;
      geometryFormatParameterDescription.schema = {};
      geometryFormatParameterDescription.schema.type = "enumeration";
      geometryFormatParameterDescription.example = "geojson";
      routeDescription.parameters.push(geometryFormatParameterDescription);

      // route.parameters.algorithm
      let algorithmServiceParameter = serviceOpRoute.getParameterById("algorithm");
      let algorithmParameterDescription = {};
      algorithmParameterDescription.name = "algorithm";
      algorithmParameterDescription.in = "query";
      algorithmParameterDescription.description = algorithmServiceParameter.description;
      algorithmParameterDescription.required = algorithmServiceParameter.required;
      algorithmParameterDescription.default = algorithmServiceParameter.defaultValue;
      algorithmParameterDescription.schema = {};
      algorithmParameterDescription.schema.type = "enumeration";
      algorithmParameterDescription.example = "ch";
      routeDescription.parameters.push(algorithmParameterDescription);

      // route.parameters.getBbox
      let getBboxServiceParameter = serviceOpRoute.getParameterById("bbox");
      let getBboxParameterDescription = {};
      getBboxParameterDescription.name = "getBbox";
      getBboxParameterDescription.in = "query";
      getBboxParameterDescription.description = getBboxServiceParameter.description;
      getBboxParameterDescription.required = getBboxServiceParameter.required;
      getBboxParameterDescription.default = getBboxServiceParameter.defaultValue;
      getBboxParameterDescription.schema = {};
      getBboxParameterDescription.schema.type = "boolean";
      getBboxParameterDescription.example = "true";
      routeDescription.parameters.push(getBboxParameterDescription);

      // route.parameters.crs
      let projectionServiceParameter = serviceOpRoute.getParameterById("projection");
      let crsParameterDescription = {};
      crsParameterDescription.name = "crs";
      crsParameterDescription.in = "query";
      crsParameterDescription.description = projectionServiceParameter.description;
      crsParameterDescription.required = projectionServiceParameter.required;
      crsParameterDescription.default = projectionServiceParameter.defaultValue;
      crsParameterDescription.schema = {};
      crsParameterDescription.schema.type = "enumeration";
      crsParameterDescription.example = "EPSG:4326";
      routeDescription.parameters.push(crsParameterDescription);

      // -- end route.parameters

      getCapabilities.operations.push(routeDescription);

    }
    // --- end route

    // --- end operations

    // --- resources
    getCapabilities.resources = new Array();
    let resources = service.resourceCatalog;

    for(let resourceId in resources) {

      let resourceDescription = {};
      let localResource = resources[resourceId];

      // resource.id
      resourceDescription.id = localResource.id;

      // resource.description
      resourceDescription.description = localResource.configuration.description;

      // -- resource.availableOperations
      resourceDescription.availableOperations = new Array();

      // - route

      // On vérifie que l'opération route est disponible et on l'intégre seulement si elle est
      if (service.verifyAvailabilityOperation("route")) {

        // on récupère l'opération de ressource
        let resourceOperation = localResource.getOperationById("route");

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
        let resourceParameter = resourceOperation.getParameterById("resource");
        let routeResource = {};
        routeResource.id = "resource";
        routeResource.values = resourceParameter.values;
        routeAvailableOperation.availableParameters.push(routeResource);

        // route.start
        let startParameter = resourceOperation.getParameterById("start");
        let routeStart = {};
        routeStart.id = "start";
        routeStart.values = startParameter.values;
        routeAvailableOperation.availableParameters.push(routeStart);

        // route.end
        let endParameter = resourceOperation.getParameterById("end");
        let routeEnd = {};
        routeEnd.id = "end";
        routeEnd.values = endParameter.values;
        routeAvailableOperation.availableParameters.push(routeEnd);

        // route.intermediates
        let intermediatesParameter = resourceOperation.getParameterById("intermediates");
        let routeIntermediates = {};
        routeIntermediates.id = "intermediates";
        routeIntermediates.values = intermediatesParameter.values;
        routeAvailableOperation.availableParameters.push(routeIntermediates);

        // route.profile
        let profileParameter = resourceOperation.getParameterById("profile");
        let routeProfile = {};
        routeProfile.id = "profile";
        routeProfile.values = profileParameter.values;
        routeAvailableOperation.availableParameters.push(routeProfile);

        // route.optimization
        let optmizationParameter = resourceOperation.getParameterById("optimization");
        let routeOptimization = {};
        routeOptimization.id = "optimization";
        routeOptimization.values = optmizationParameter.values;
        routeAvailableOperation.availableParameters.push(routeOptimization);

        // route.getGeometry
        let getGeometryParameter = resourceOperation.getParameterById("stepsGeometry");
        let routeGetGeometry = {};
        routeGetGeometry.id = "getGeometry";
        routeGetGeometry.values = getGeometryParameter.values;
        routeAvailableOperation.availableParameters.push(routeGetGeometry);

        // route.waysAttributes
        let waysAttributesParameter = resourceOperation.getParameterById("waysAttributes");
        let routeWaysAttributes = {};
        routeWaysAttributes.id = "waysAttributes";
        routeWaysAttributes.values = waysAttributesParameter.values;
        routeAvailableOperation.availableParameters.push(routeWaysAttributes);

        // route.geometryFormat
        let geometryFormatParameter = resourceOperation.getParameterById("geometryFormat");
        let routeGeometriesFormat = {};
        routeGeometriesFormat.id = "geometryFormat";
        routeGeometriesFormat.values = geometryFormatParameter.values;
        routeAvailableOperation.availableParameters.push(routeGeometriesFormat);

        // route.algorithm
        let algorithmParameter = resourceOperation.getParameterById("algorithm");
        let routeAlgorithm = {};
        routeAlgorithm.id = "algorithm";
        routeAlgorithm.values = algorithmParameter.values;
        routeAvailableOperation.availableParameters.push(routeAlgorithm);

        // route.getBbox
        let bboxParameter = resourceOperation.getParameterById("bbox");
        let routeGetBbox = {};
        routeGetBbox.id = "getBbox";
        routeGetBbox.values = bboxParameter.values;
        routeAvailableOperation.availableParameters.push(routeGetBbox);

        // route.crs
        let projectionParameter = resourceOperation.getParameterById("projection");
        let routeCrs = {};
        routeCrs.id = "crs";
        routeCrs.values = projectionParameter.values;
        routeAvailableOperation.availableParameters.push(routeCrs);

        resourceDescription.availableOperations.push(routeAvailableOperation);

      }
      // - end route

      // -- end resource.availableOperations



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

      // TODO: vérification que l'ensemble des opérations et paramètres soient disponibles
      // ils sont utilisés dans l'api mais leur existence n'est pas vérifiée

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
