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
  * @param{topology} topology -  Instance de la classe Topology
  *
  */
  constructor(sourceJsonObject, topology) {

    // Constructeur parent
    super(sourceJsonObject.id,sourceJsonObject.type, topology);

    // Ajout des opérations possibles sur ce type de source
    this.availableOperations.push("route");
    this.availableOperations.push("isochrone");

    // Stockage de la configuration
    this._configuration = sourceJsonObject;

    // Opérateur pour les requêtes http
    this._httpQuery = new httpQuery({prefixUrl: this._configuration.storage.url});

    //projection de la topologie
    this._topologyProjection = "EPSG:4326";
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
  * Ce traitement est placé ici car c'est la source qui sait quel moteur est concernée par la requête.
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
          toll: "Toll"
        };
        if (request.constraints && Array.isArray(request.constraints) && request.constraints.length > 0) {
          let constraints = [];

          for (let i = 0; i < request.constraints.length; i++) {
            if (request.constraints[i].type === 'avoid' || request.constraints[i].type === 'prefer') {
              LOGGER.error("constraint " + request.constraints[i].type + " not allowed for this source");
            } else if (request.constraints[i].type === "banned") {
              constraints.push(mapConstraintValues[constraint.field]);
            } else {
              LOGGER.debug("constraint type is unknown");
            }
          }

          smartroutingRequest.exclusions = constraints.joint(";");
        } else {
          // il n'y rien à faire car pas de contraintes
          LOGGER.debug("no contraints");
        }

        // projection
        smartroutingRequest.srs = request.crs? request.crs : this._topologyProjection;

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
        };this._httpQuery
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
          toll: "Toll"
        };
        if (request.constraints && Array.isArray(request.constraints) && request.constraints.length > 0) {
          let constraints = [];

          for (let i = 0; i < request.constraints.length; i++) {
            if (request.constraints[i].type === 'avoid' || request.constraints[i].type === 'prefer') {
              LOGGER.error("constraint " + request.constraints[i].type + " not allowed for this source");
            } else if (request.constraints[i].type === "banned") {
              constraints.push(mapConstraintValues[constraint.field]);
            } else {
              LOGGER.debug("constraint type is unknown");
            }
          }

          smartroutingRequest.exclusions = constraints.joint(";");
        } else {
          // il n'y rien à faire car pas de contraintes
          LOGGER.debug("no contraints");
        }

        // projection
        smartroutingRequest.srs = request.crs? request.crs : this._topologyProjection;

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
    return this._httpQuery.get(query, this._requestOptions).then( (response) => {
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
  * Ce traitement est placé ici car c'est à la source de renvoyer une réponse adaptée au proxy.
  * C'est cette fonction qui doit vérifier le contenu de la réponse. Une fois la réponse envoyée
  * au proxy, on considère qu'elle est correcte.
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
    // ---

    // convertion de la geometry
    const wayGeojson = wkt.parse(smartroutingResponse.geometryWkt);
    let way = new Line(wayGeojson, 'geojson', this._topologyProjection);
    if (routeRequest.crs && routeRequest.crs !== this._topologyProjection && !way.transform(routeRequest.crs)) {
      throw errorManager.createError(" Error during reprojection of way geometry. ");
    } else {
      LOGGER.debug("way geometry in asked projection:");
      LOGGER.debug(way);
    }
    const wayGeom = way.getGeoJSON();

    // start et end
    start = new Point(wayGeom.coordinates[0][0], wayGeom.coordinates[0][1], wayGeom.projection);
    end = new Point(wayGeom.coordinates[wayGeom.coordinates.length-1][0], wayGeom.coordinates[wayGeom.coordinates.length-1][1], wayGeom.projection);

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
        let legStart = new Point(firstPoint[0], firstPoint[1], this._topologyProjection);
        if (routeRequest.crs && routeRequest.crs !== this._topologyProjection && !legStart.transform(routeRequest.crs)) {
          throw errorManager.createError(" Error during reprojection of leg start in SMART ROUTING response. ");
        } else {
          LOGGER.debug("portion start in asked projection:");
          LOGGER.debug(legStart);
        }
  
        const lastPoint = currentRouteLeg.steps[currentRouteLeg.steps.length-1].points[currentRouteLeg.steps[currentRouteLeg.steps.length-1].points.length-1];
        let legEnd = new Point( lastPoint[0], lasPoint[1], this._topologyProjection);
        if (routeRequest.crs && routeRequest.crs !== this._topologyProjection && !legEnd.transform(routeRequest.crs)) {
          throw errorManager.createError(" Error during reprojection of leg end in SMART ROUTING response. ");
        } else {
          LOGGER.debug("portion end in asked projection:");
          LOGGER.debug(legEnd);
        }
  
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
          steps[k] = new Step( new Line(stepGeometry, "geojson", this._topologyProjection) );
          if (routeRequest.crs && routeRequest.crs !== this._topologyProjection && !steps[k].geometry.transform(routeRequest.crs)) {
            throw errorManager.createError(" Error during reprojection of step's geometry in SMART ROUTING response. ");
          } else {
            LOGGER.debug("step geometry is converted");
          }
  
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
  * Ce traitement est placé ici car c'est à la source de renvoyer une réponse adaptée au proxy.
  * C'est cette fonction qui doit vérifier le contenu de la réponse. Une fois la réponse envoyée
  * au proxy, on considère qu'elle est correcte.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @param {smartroutingResponse} smartroutingResponse - Objet smartroutingResponse
  *
  */
   writeIsochroneResponse(isochroneRequest, smartroutingResponse) {

    let location = {};
    let geometry = {};

    // Location
    var locationCoords = JSON.parse("[" + smartroutingResponse.location + "]");
    location = new Point(locationCoords[0], locationCoords[1], this._topologyProjection);
    if (isochroneRequest.crs && isochroneRequest.crs !== this._topologyProjection && !location.transform(isochroneRequest.crs)) {
      throw errorManager.createError(" Error during reprojection of location in SMART ROUTING response. ");
    }

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
    geometry = new Polygon(rawGeometry, "geojson", this._topologyProjection);
    if (isochroneRequest.crs && isochroneRequest.crs !== this._topologyProjection && !geometry.transform(isochroneRequest.crs)) {
      throw errorManager.createError(" Error during reprojection of geometry in SMART ROUTING response. ");
    }

    /* Envoi de la réponse au proxy. */
    return new IsochroneResponse(
      location,
      isochroneRequest.resource,
      isochroneRequest.costType,
      isochroneRequest.costValue,
      geometry,
      isochroneRequest.profile,
      isochroneRequest.direction,
      isochroneRequest.crs || this._topologyProjection,
      isochroneRequest.timeUnit,
      isochroneRequest.distanceUnit
    );
  }
}
