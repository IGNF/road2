'use strict';

const Source = require('./source');
const OSRM = require("osrm");
const RouteResponse = require('../responses/routeResponse');
const Route = require('../responses/route');
const Portion = require('../responses/portion');
const Geometry = require('../geometry/geometry');
const Step = require('../responses/step');
const errorManager = require('../utils/errorManager');
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
  * @param {json} sourceJsonObject - Description de la source en json
  *
  */
  constructor(sourceJsonObject) {

    // Constructeur parent
    super(sourceJsonObject.id,sourceJsonObject.type);

    // Ajout des opérations possibles sur ce type de source
    this.availableOperations.push("route");

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
  * @param {json} conf - Description de la source en json
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
  * @param {object} osrmObject - Objet OSRM
  *
  */
  set osrm (osrmObject) {
    this._osrm = osrmObject;
  }

  /**
  *
  * @function
  * @name connect
  * @description Chargement de la source OSRM, donc du fichier osrm
  *
  */
  async connect() {
    try {
      // Récupération de l'emplacement du fichier OSRM
      let osrmFile = this._configuration.storage.file;
      LOGGER.info("Chargement du fichier OSRM: " + osrmFile);

      // Chargement du fichier OSRM
      this._osrm = new OSRM(osrmFile);
      super.connected = true;
    } catch (err) {
      throw errorManager.createError("Cannot connect source");
    }

  }

  /**
  *
  * @function
  * @name disconnect
  * @description Déchargement de la source OSRM, donc du fichier osrm
  *
  */
  async disconnect() {
    super.connected = false;
  }

  /**
  *
  * @function
  * @name computeRequest
  * @description Traiter une requête.
  * Ce traitement est placé ici car c'est la source qui sait quel moteur est concernée par la requête.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @return {Promise}
  *
  */
  computeRequest (request) {

    if (request.operation === "route") {

      // Construction de l'objet pour la requête OSRM
      // Cette construction dépend du type de la requête fournie
      // ---
      let osrmRequest = {};

      // Types de géométries : GeoJSON
      osrmRequest.geometries = "geojson";

      if (request.type === "routeRequest") {
        // Coordonnées
        let coordinatesTable = new Array();
        // start
        coordinatesTable.push([request.start.lon, request.start.lat]);
        // intermediates
        if (request.intermediates.length !== 0) {
          for (let i = 0; i < request.intermediates.length; i++) {
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

      } else {
        // on va voir si c'est un autre type de requête
      }

      // ---

      return new Promise ( (resolve, reject) => {
        this.osrm.route(osrmRequest, (err, result) => {
          if (err) {
            // on ne renvoie pas l'erreur d'OSRM
            reject(errorManager.createError(" Internal OSRM error. "));
          } else {
            try {
              resolve(this.writeRouteResponse(request, result));
            } catch (error) {
              reject(error);
            }
          }
        });
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
  * C'est cette fonction qui doit vérifier le contenu de la réponse. Une fois la réponse envoyée
  * au proxy, on considère qu'elle est correcte.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @param {osrmResponse} osrmResponse - Objet osrmResponse
  *
  */
  writeRouteResponse (routeRequest, osrmResponse) {

    let resource;
    let start;
    let end;
    let profile;
    let optimization;
    let routes = new Array();

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

    if (osrmResponse.waypoints.length < 2) {
      // Cela veut dire que l'on n'a pas un start et un end dans la réponse OSRM
      throw errorManager.createError(" OSRM response is invalid: the number of waypoints is lower than 2. ");
    }

    // start
    start = osrmResponse.waypoints[0].location[0] +","+ osrmResponse.waypoints[0].location[1];

    // end
    end = osrmResponse.waypoints[osrmResponse.waypoints.length-1].location[0] +","+ osrmResponse.waypoints[osrmResponse.waypoints.length-1].location[1];

    let routeResponse = new RouteResponse(resource, start, end, profile, optimization);

    if (osrmResponse.routes.length === 0) {
      // Cela veut dire que l'on n'a pas un start et un end dans la réponse OSRM
      throw errorManager.createError(" OSRM response is invalid: the number of routes is equal to 0. ");
    }

    // routes
    // Il peut y avoir plusieurs itinéraires
    for (let i = 0; i < osrmResponse.routes.length; i++) {

      let portions = new Array();
      let currentOsrmRoute = osrmResponse.routes[i];

      // On commence par créer l'itinéraire avec les attributs obligatoires
      routes[i] = new Route( new Geometry(currentOsrmRoute.geometry, "LineString", "geojson") );

      // On doit avoir une égalité entre ces deux valeurs pour la suite
      // Si ce n'est pas le cas, c'est qu'OSRM n'a pas le comportement attendu...
      if (currentOsrmRoute.legs.length !== osrmResponse.waypoints.length-1) {
        throw errorManager.createError(" OSRM response is invalid: the number of legs is not proportionnal to the number of waypoints. ");
      }

      // On va gérer les portions qui sont des parties de l'itinéraire entre deux points intermédiaires
      for (let j = 0; j < currentOsrmRoute.legs.length; j++) {

        let currentOsrmRouteLeg = currentOsrmRoute.legs[j];
        let legStart = osrmResponse.waypoints[j].location[0] +","+ osrmResponse.waypoints[j].location[1];
        let legEnd = osrmResponse.waypoints[j+1].location[0] +","+ osrmResponse.waypoints[j+1].location[1];

        portions[j] = new Portion(legStart, legEnd);

        // Steps
        let steps = new Array();

        // On va associer les étapes à la portion concernée
        for (let k=0; k < currentOsrmRouteLeg.steps.length; k++) {

          let currentOsrmRouteStep = currentOsrmRouteLeg.steps[k];
          steps[k] = new Step( new Geometry(currentOsrmRouteStep.geometry, "LineString", "geojson") );
          steps[k].name = currentOsrmRouteStep.name;
        }

        portions[j].steps = steps;

      }

      routes[i].portions = portions;

    }

    routeResponse.routes = routes;

    return routeResponse;

  }


}
