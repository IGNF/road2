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

    getCapabilities.operations.push(routeDescription);
    // --- operations

    // --- resources
    // getCapabilities.resources = new Array();
    //
    // for(let i = 0; i < ; i++) {
    //   let resourceDescription = {};
    //
    //
    //   getCapabilities.resources.push(resourceDescription);
    // }

    // --- resources

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

    // Création du GetCapabilities
    if (!this.createGetCapabilities(app, uid)) {
      LOGGER.error("Erreur lors de la creation du GetCapabilities.");
      return false;
    } else {
      // tout s'est bien passé
    }

    return true;

  }

}
