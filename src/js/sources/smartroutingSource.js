'use strict';

const Source = require('./source');
const RouteResponse = require('../responses/routeResponse');
const IsochroneResponse = require('../responses/isochroneResponse');
const Route = require('../responses/route');
const Portion = require('../responses/portion');
const Line = require('../geometry/line');
const Point = require('../geometry/point');
const Polygon = require('../geometry/polygon');
const Step = require('../responses/step');
const Distance = require('../geography/distance');
const Duration = require('../time/duration');
const errorManager = require('../utils/errorManager');
const log4js = require('log4js');
const wkt = require('wkt');
const httpQuery = require('../utils/httpQuery');


// Création du LOGGER
var LOGGER = log4js.getLogger("SMARTROUTINGSOURCE");


/**
*
* @class
* @name osrmSource
* @description Classe modélisant une source OSRM.
*
*/

module.exports = class smartroutingSource extends Source {

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
    super(sourceJsonObject.id,sourceJsonObject.type, undefined);

    // Ajout des opérations possibles sur ce type de source
    this.availableOperations.push("route");
    this.availableOperations.push("isochrone");

    // Stockage de la configuration
    this._configuration = sourceJsonObject;

    // Opérateur pour les requêtes http
    this._httpQuery = new httpQuery({prefixUrl: this._configuration.storage.url});
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
  * @name connect
  *
  */
  async connect() {
    this._connected = true;
  }

  /**
  *
  * @function
  * @name disconnect
  *
  */
  async disconnect() {
    this._connected = false;
  }

  /**
  *
  * @function
  * @name computeRequest
  * @description Traiter une requête.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @return {Promise}
  *
  */
  computeRequest (request) {
    LOGGER.debug("computeRequest()");

    let query = "";
    let smartroutingRequest = {};

    if (request.operation === "route") {
      LOGGER.debug("operation request is route");

      // Construction de l'objet pour la requête smart routing
      if (request.type === "routeRequest") {
        LOGGER.debug("type of request is routeRequest");
        
        // Coordonnées
        // start
        smartroutingRequest.origin = request.start.x + "," + request.start.y;
        // intermediates
        if (request.intermediates.length !== 0) {
          let waypoints = [];
          for (let i = 0; i < request.intermediates.length; i++) {
            waypoints.push(request.intermediates[i].x + "," + request.intermediates[i].y);
          }
          smartroutingRequest.waypoints = waypoints.join(";");
        }
        // end
        smartroutingRequest.destination = request.end.x + "," + request.end.y;

        // optimization
        const mapMethods = {
          shortest: "distance",
          fastest: "time"
        };
        smartroutingRequest.method = mapMethods[request.optimization];

        // profil
        const mapProfiles = {
          car: "Voiture",
          pedestrian: "Pieton"
        };
        smartroutingRequest.graphName = mapProfiles[request.profile];

        // constraints
        const mapConstraintValues = {
          tunnel: "Tunnel",
          autoroute: "Toll",
          pont: "Bridge"
        };
        if (request.constraints && Array.isArray(request.constraints) && request.constraints.length > 0) {
          let constraints = [];

          for (let i = 0; i < request.constraints.length; i++) {
            if (request.constraints[i].type === 'avoid' || request.constraints[i].type === 'prefer') {
              LOGGER.error("constraint type " + request.constraints[i].type + " not allowed for this source");
            } else if (request.constraints[i].type === "banned") {
              if (mapConstraintValues[request.constraints[i].value]) {
                constraints.push(mapConstraintValues[request.constraints[i].value]);
              } else {
                LOGGER.error("constraint value " + request.constraints[i].value + " not allowed for this source");
              }
            } else {
              LOGGER.debug("constraint type is unknown");
            }
          }

          smartroutingRequest.exclusions = constraints.join(";");
        } else {
          // il n'y rien à faire car pas de contraintes
          LOGGER.debug("no contraints");
        }

        // projection
        // projection demandée dans la requête
        smartroutingRequest.srs = request.start.projection;

        // query
        query = "itineraire/rest/route.json?"+Object.keys(smartroutingRequest).map(function (key) { return key + '=' + smartroutingRequest[key]}).join('&');

      } else {
        // TODO: qu'est-ce qui se passe si on arrive là, doit-on retourner une erreur ou une promesse
        LOGGER.error("type of request not found");
      }
      
    } else if (request.operation === "isochrone") {
      LOGGER.debug("operation request is isochrone");

      // Construction de l'objet pour la requête smart routing
      if (request.type === "isochroneRequest") {
        LOGGER.debug("type of request is isochroneRequest");
        
        // Coordonnées
        // location
        smartroutingRequest.location = request.point.lon + "," + request.point.lat;

        // optimization
        const mapMethods = {
          distance: "distance",
          time: "time"
        };
        smartroutingRequest.method = mapMethods[request.costType];

        // profil
        const mapProfiles = {
          car: "Voiture",
          pedestrian: "Pieton"
        };
        smartroutingRequest.graphName = mapProfiles[request.profile];

        // valeur du cout
        if ( smartroutingRequest.method === 'time') {
          // Note costValue est déjà en secondes
          smartroutingRequest.time = request.costValue;
        } else if ( smartroutingRequest.method === 'distance' ) {
          // Note costValue est déjà en metres
          smartroutingRequest.distance = request.costValue;
        }

        // sens de parcours
        smartroutingRequest.reverse = request.direction === 'arrival' ? true : false;

        // autres options
        smartroutingRequest.smoothing = false;
        smartroutingRequest.holes = false;

        // constraints
        const mapConstraintValues = {
          tunnel: "Tunnel",
          autoroute: "Toll",
          pont: "Bridge"
        };
        if (request.constraints && Array.isArray(request.constraints) && request.constraints.length > 0) {
          let constraints = [];

          for (let i = 0; i < request.constraints.length; i++) {
            if (request.constraints[i].type === 'avoid' || request.constraints[i].type === 'prefer') {
              LOGGER.error("constraint " + request.constraints[i].type + " not allowed for this source");
            } else if (request.constraints[i].type === "banned") {
              if (mapConstraintValues[request.constraints[i].value]) {
                constraints.push(mapConstraintValues[request.constraints[i].value]);
              } else {
                LOGGER.error("constraint value " + request.constraints[i].value + " not allowed for this source");
              }
            } else {
              LOGGER.debug("constraint type is unknown");
            }
          }

          smartroutingRequest.exclusions = constraints.join(";");
        } else {
          // il n'y rien à faire car pas de contraintes
          LOGGER.debug("no contraints");
        }

        // projection
        smartroutingRequest.srs = request.askedProjection;

        // query
        query = "isochrone/isochrone.json?"+Object.keys(smartroutingRequest).map(function (key) { return key + '=' + smartroutingRequest[key]}).join('&');

      } else {
        // TODO: qu'est-ce qui se passe si on arrive là, doit-on retourner une erreur ou une promesse ?
        LOGGER.error("type of request not found");
      }

    } else {
      // TODO: qu'est-ce qui se passe si on arrive là, doit-on retourner une erreur ou une promesse ?
      LOGGER.error("request operation not found");
    }

    LOGGER.debug("smartroutingRequest:");
    LOGGER.debug(smartroutingRequest);

    var self = this;
    LOGGER.debug("smartrouting query:");
    LOGGER.debug(query);
    return this._httpQuery.get(query).then( (response) => {
      const result = JSON.parse(response.body);
      if( request.operation === "route" ) {
        return self.writeRouteResponse(request, result);
      } else if ( request.operation === "isochrone" ) {
        return self.writeIsochroneResponse(request, result);
      } else {
        return Promise.reject("request operation not found");
      }
    }).catch( (error) => {
      LOGGER.error(error);
      return Promise.reject(errorManager.createError(error , 503));
    });
  }

  /**
  *
  * @function
  * @name writeRouteResponse
  * @description Pour traiter la réponse du moteur et la ré-écrire pour le proxy.
  * @param {Request} routeRequest - Objet Request ou dérivant de la classe Request
  * @param {smartroutingResponse} smartroutingResponse - Objet smartroutingResponse
  *
  */
  writeRouteResponse (routeRequest, smartroutingResponse) {

    LOGGER.debug("writeRouteResponse()");
    LOGGER.debug(smartroutingResponse);

    let resource;
    let start;
    let end;
    let profile;
    let optimization;
    let route;

    // Récupération des paramètres de la requête que l'on veut transmettre dans la réponse
    // ---
    // resource
    resource = routeRequest.resource;

    // profile
    profile = routeRequest.profile;

    // optimization
    optimization = routeRequest.optimization;

    // projection
    let askedProjection = routeRequest.start.projection;
    // pas de reprojections à faire: contrairement à ce qui est dit dans la doc, les géometries retournées par le service sont dans le système demandé
    // ---

    // convertion de la geometry
    const wayGeojson = wkt.parse(smartroutingResponse.geometryWkt);
    let way = new Line(wayGeojson, 'geojson', askedProjection);

    // start et end
    start = new Point(wayGeojson.coordinates[0][0], wayGeojson.coordinates[0][1], askedProjection);
    end = new Point(wayGeojson.coordinates[wayGeojson.coordinates.length-1][0], wayGeojson.coordinates[wayGeojson.coordinates.length-1][1], askedProjection);

    // construction objet reponse
    let routeResponse = new RouteResponse(resource, start, end, profile, optimization);

    // routes
    // Il ne peut y avoir qu'un seul itinéraire
    let portions = new Array();

    // On commence par créer l'itinéraire avec les attributs obligatoires
    route = new Route( way );

    // On récupère la distance et la durée
    route.distance = new Distance(smartroutingResponse.distance,"meter");
    route.duration = new Duration(smartroutingResponse.duration,"second");

    // On va gérer les portions qui sont des parties de l'itinéraire entre deux points intermédiaires
    let routeDistance = 0;
    let routeDuration = 0;
    for (let j = 0; j < smartroutingResponse.legs.length; j++) {
      LOGGER.debug("Portion (SMART ROUTING legs) number " + j);

      let currentRouteLeg = smartroutingResponse.legs[j];

      const firstPoint = currentRouteLeg.steps[0].points[0];

      if (currentRouteLeg.steps[0].points.length > 0) {
        let legStart = new Point(firstPoint[0], firstPoint[1], askedProjection);
  
        const lastPoint = currentRouteLeg.steps[currentRouteLeg.steps.length-1].points[currentRouteLeg.steps[currentRouteLeg.steps.length-1].points.length-1];
        let legEnd = new Point( lastPoint[0], lastPoint[1], askedProjection);
  
        portions[j] = new Portion(legStart, legEnd);
  
        // On récupère la distance et la durée
        // Note : distanceMeters et durationSeconds ne sont pas dans la doc
        portions[j].distance = new Distance(currentRouteLeg.distanceMeters, "meter");
        portions[j].duration = new Duration(currentRouteLeg.durationSeconds, "second");
  
        // Steps
        let steps = new Array();
  
        // On va associer les étapes à la portion concernée
        for (let k=0; k < currentRouteLeg.steps.length; k++) {
          LOGGER.debug("Step number " + k + " of portion number " + j);
  
          let currentRouteStep = currentRouteLeg.steps[k];
          const stepGeometry = {
            type: "linestring",
            coordinates: currentRouteStep.points
          }
          steps[k] = new Step( new Line(stepGeometry, "geojson", askedProjection) );
          
          // Ajout de l'attribut name
          steps[k].setAttributById("name", currentRouteStep.name);

          // instruction de navigation
          steps[k].instruction = currentRouteStep.navInstruction;
  
          // On récupère la distance et la durée
          steps[k].distance = new Distance(Math.round(currentRouteStep.distanceMeters * 10) / 10, "meter");
          steps[k].duration = new Duration(Math.round(currentRouteStep.durationSeconds * 10) / 10, "second");
        }
        portions[j].steps = steps;
      }
      // On récupère la distance et la durée
      routeDistance += parseFloat(currentRouteLeg.distanceMeters);
      routeDuration += parseFloat(currentRouteLeg.durationSeconds);
    }

    // On récupère la distance et la durée
    route.distance = new Distance(Math.round(routeDistance * 10) / 10, "meter");
    route.duration = new Duration(Math.round(routeDuration * 10) / 10, "second");

    route.portions = portions;
    routeResponse.routes = [route];

    return routeResponse;
  }

  /**
  *
  * @function
  * @name writeIsochroneResponse
  * @description Pour traiter la réponse du moteur et la ré-écrire pour le proxy.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @param {smartroutingResponse} smartroutingResponse - Objet smartroutingResponse
  *
  */
   writeIsochroneResponse(isochroneRequest, smartroutingResponse) {

    let location = {};
    let geometry = {};

    // projection
    const projection = smartroutingResponse.srs;
    // pas de reprojection à faire. Le service répond dans le système demandé.

    // Location
    var locationCoords = JSON.parse("[" + smartroutingResponse.location + "]");
    location = new Point(locationCoords[0], locationCoords[1], projection);

    // Geometrie
    const rawGeometry = wkt.parse(smartroutingResponse.wktGeometry);

    // Cas où il n'y a pas d'isochrone car costValue trop faible
    if (rawGeometry === null) {
      rawGeometry = {
        type: 'Point',
        coordinates: locationCoords
      };
    }

    // Création d'un objet Polygon à partir du GeoJSON reçu.
    geometry = new Polygon(rawGeometry, "geojson", projection);

    /* Envoi de la réponse au proxy. */
    return new IsochroneResponse(
      location,
      isochroneRequest.resource,
      isochroneRequest.costType,
      isochroneRequest.costValue,
      geometry,
      isochroneRequest.profile,
      isochroneRequest.direction,
      projection,
      isochroneRequest.timeUnit,
      isochroneRequest.distanceUnit
    );
  }
}
