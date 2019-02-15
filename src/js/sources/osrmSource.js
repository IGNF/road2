'use strict';

var Source = require('./source');
const OSRM = require("osrm");
var RouteResponse = require('../responses/routeResponse');
var Route = require('../responses/route');
var Portion = require('../responses/portion');
var Step = require('../responses/step');
var errorManager = require('../utils/errorManager');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("OSRMSOURCE");


/**
*
* @class
* @name osrmSource
* @description Classe modélisant une source OSRM.
*
*/

module.exports = class osrmSource extends Source {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe osrmSource
  *
  */
  constructor(sourceJsonObject) {

    // Constructeur parent
    super(sourceJsonObject.id,sourceJsonObject.type);

    // Stockage de la configuration
    this._configuration = sourceJsonObject;

    // Objet OSRM qui permet de faire les calculs
    this._osrm = {};

  }

  /**
  *
  * @function
  * @name get configuration
  * @description Récupérer la configuration de la source
  *
  */
  get configuration () {
    return this._configuration;
  }

  /**
  *
  * @function
  * @name set configuration
  * @description Attribuer la configuration de la source
  *
  */
  set configuration (conf) {
    this._configuration = conf;
  }

  /**
  *
  * @function
  * @name get osrm
  * @description Récupérer l'objet osrm de la source
  *
  */
  get osrm () {
    return this._osrm;
  }

  /**
  *
  * @function
  * @name set osrm
  * @description Attribuer l'objet osrm de la source
  *
  */
  set osrm (o) {
    this._osrm = o;
  }

  /**
  *
  * @function
  * @name connect
  * @description Chargement de la source OSRM, donc du fichier osrm
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */
  connect() {

    // Récupération de l'emplacement du fichier OSRM
    var osrmFile = this._configuration.storage.file;
    LOGGER.info("Chargement du fichier OSRM: " + osrmFile);

    // Chargement du fichier OSRM
    this._osrm = new OSRM(osrmFile);
    super.connected = true;
    return true;

  }

  /**
  *
  * @function
  * @name disconnect
  * @description Déchargement de la source OSRM, donc du fichier osrm
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */
  disconnect() {
    super.connected = false;
    return true;
  }

  /**
  *
  * @function
  * @name computeRequest
  * @description Traiter une requête.
  * Ce traitement est placé ici car c'est la source qui sait quel moteur est concernée par la requête.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @param {function} callback - Callback de succès (Objet Response ou dérivant de la classe Response) et d'erreur
  *
  */
  computeRequest (request, callback) {

    if (request.operation === "route") {

      // Construction de l'objet pour la requête OSRM
      // ---
      var osrmRequest = {};

      // Coordonnées
      var coordinatesTable = new Array();
      // start
      coordinatesTable.push([request.start.lon, request.start.lat]);
      // intermediates
      if (request.intermediates.length !== 0) {
        for (var i = 0; i < request.intermediates.length; i++) {
          coordinatesTable.push([request.intermediates[i].lon, request.intermediates[i].lat]);
        }
      }
      // end
      coordinatesTable.push([request.end.lon, request.end.lat]);

      osrmRequest.coordinates = coordinatesTable;

      // steps
      if (request.computeGeometry) {
        osrmRequest.steps = true;
      } else {
        osrmRequest.steps = false;
      }

      // ---

      this.osrm.route(osrmRequest, (err, result) => {
        if (err) {
          callback(err);
        } else {
          this.writeRouteResponse(request, result, callback);
        }
      });

    } else {
      // on va voir si c'est une autre opération
    }

  }

  /**
  *
  * @function
  * @name writeRouteResponse
  * @description Pour traiter la réponse du moteur et la ré-écrire pour le proxy.
  * Ce traitement est placé ici car c'est à la source de renvoyer une réponse adaptée au proxy.
  * TODO: c'est cette fonction qui doit vérifier le contenu de la réponse. Une fois la réponse envoyée
  * au proxy, on considère qu'elle est correcte.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @param {osrmResponse} osrmResponse - Objet osrmResponse
  * @param {function} callback - Callback de succès (Objet Response ou dérivant de la classe Response) et d'erreur
  *
  */
  writeRouteResponse (routeRequest, osrmResponse, callback) {

    var resource;
    var start;
    var end;
    var profile;
    var optimization;
    var routes = new Array();

    // Récupération des paramètres de la requête que l'on veut transmettre dans la réponse
    // ---
    // resource
    resource = routeRequest.resource;

    // profile
    profile = routeRequest.profile;

    // optimization
    optimization = routeRequest.optimization;
    // ---

    // Lecture de la réponse OSRM
    // ---

    // start
    start = osrmResponse.waypoints[0].location[0] +","+ osrmResponse.waypoints[0].location[1];

    // end
    end = osrmResponse.waypoints[osrmResponse.waypoints.length-1].location[0] +","+ osrmResponse.waypoints[osrmResponse.waypoints.length-1].location[1];

    var routeResponse = new RouteResponse(resource, start, end, profile, optimization);

    // routes
    // Il peut y avoir plusieurs itinéraires
    for (var i = 0; i < osrmResponse.routes.length; i++) {

      var portions = new Array();
      var currentOsrmRoute = osrmResponse.routes[i];

      // On commence par créer l'itinéraire avec les attributs obligatoires
      routes[i] = new Route(currentOsrmRoute.geometry);

      // On doit avoir une égalité entre ces deux valeurs pour la suite
      // Si ce n'est pas le cas, c'est qu'OSRM n'a pas le comportement attendu...
      if (currentOsrmRoute.legs.length !== osrmResponse.waypoints.length-1) {
        callback(errorManager.createError(" OSRM response is invalid: the number of legs is not proportionnal to the number of waypoints. "));
      }

      // On va gérer les portions qui sont des parties de l'itinéraire entre deux points intermédiaires
      for (var j = 0; j < currentOsrmRoute.legs.length; j++) {

        var currentOsrmRouteLeg = currentOsrmRoute.legs[j];
        var legStart = osrmResponse.waypoints[j].location[0] +","+ osrmResponse.waypoints[j].location[1];
        var legEnd = osrmResponse.waypoints[j+1].location[0] +","+ osrmResponse.waypoints[j+1].location[1];

        portions[j] = new Portion(legStart, legEnd);

        if (routeRequest.computeGeometry) {
          var steps = new Array();

          // On va associer les étapes à la portion concernée
          for (var k=0; k < currentOsrmRouteLeg.steps.length; k++) {

            var currentOsrmRouteStep = currentOsrmRouteLeg.steps[k];
            steps[k] = new Step(currentOsrmRouteStep.geometry);
          }

          portions[j].steps = steps;

        } else {
          // Comme la géométrie des steps n'est pas demandée, on ne l'a donne pas
        }

      }

      routes[i].portions = portions;

    }

    routeResponse.routes = routes;

    // ---

    callback(null, routeResponse);

  }


}
