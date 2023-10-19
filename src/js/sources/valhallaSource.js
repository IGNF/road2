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
const { exec } = require('child_process');

// Création du LOGGER
const log4js = require('log4js');
const LOGGER = log4js.getLogger("VALHALLASOURCE");

/**
*
* @class
* @name valhallaSource
* @description Classe modélisant une source Valhalla.
*
*/
module.exports = class valhallaSource extends Source {
  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe valhallaSource
  * @param{json} sourceJsonObject - Description de la source
  *
  */
  constructor(sourceJsonObject) {

    // Constructeur parent
    super(sourceJsonObject.id, "valhalla", sourceJsonObject.description, sourceJsonObject.projection, sourceJsonObject.bbox);

    // Stockage de la configuration
    this._configuration = sourceJsonObject;

    // Gestions des coûts disponibles
    this._costs = {};

    // Initialisation des coûts
    for (let i = 0; i < sourceJsonObject.costs.length; i++) {
      if (!this._costs[sourceJsonObject.costs[i].profile]) {
        Object.defineProperty(this._costs, sourceJsonObject.costs[i].profile, { value: new Object(), configurable: true, enumerable: true, writable: true });
      }
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile], sourceJsonObject.costs[i].optimization, { value: new Object(), configurable: true, enumerable: true, writable: true });
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile], sourceJsonObject.costs[i].costType, { value: new Object(), configurable: true, enumerable: true, writable: true });
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile][sourceJsonObject.costs[i].optimization], "costing", { value: sourceJsonObject.costs[i].costing, configurable: true, enumerable: true, writable: true });
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile][sourceJsonObject.costs[i].costType], "costing", { value: sourceJsonObject.costs[i].costing, configurable: true, enumerable: true, writable: true });
    }

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
  * @description Connection
  *
  */
  async connect() {
      this._connected = true;
  }

  /**
  *
  * @function
  * @name disconnect
  * @description Déconnexion
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

    let valhallaRequest = {};

    if (request.operation === "route") {

      LOGGER.debug("operation request is route");

      const coordinatesTable = new Array();
      let constraints = new Array();

      if (request.type === "routeRequest") {

        LOGGER.debug("type of request is routeRequest");

        // Coordonnées
        // start
        coordinatesTable.push(request.start.getCoordinatesIn(super.projection));
        // intermediates
        if (request.intermediates.length !== 0) {
          for (let i = 0; i < request.intermediates.length; i++) {
            coordinatesTable.push(request.intermediates[i].getCoordinatesIn(super.projection));
          }
        }
        // end
        coordinatesTable.push(request.end.getCoordinatesIn(super.projection));

        LOGGER.debug("coordinates:");
        LOGGER.debug(coordinatesTable);

        valhallaRequest.coordinates = coordinatesTable;

        // Gestion des contraintes d'exclusion.
        if (request.constraints && Array.isArray(request.constraints) && request.constraints.length > 0) {

          valhallaRequest.exclude = [];
          for (let i = 0; i < request.constraints.length; i++) {
            let constraint = request.constraints[i];

            if (constraint.type === "banned") {
              constraints.push(constraint.field);
            } else {
              // ce sont des contraintes non gérées donc il n'y a rien à faire
              LOGGER.debug("no banned contraints");
            }

          }

        } else {
          // il n'y rien à faire car pas de contraintes
          LOGGER.debug("no contraints");
        }

      } else {

        // TODO: qu'est-ce qui se passe si on arrive là, doit-on retourner une erreur ou une promesse
        LOGGER.error("type of request not found");

      }
      // ---
      let locationsString = `"locations":[`;
      valhallaRequest.coordinates.forEach(location => {
        locationsString += `{"lat": ${location[1]}, "lon": ${location[0]}},`;
      });
      locationsString = locationsString.slice(0, -1);
      locationsString += "]";

      const costingString = `"costing":"${this._costs[request.profile][request.optimization].costing}"`;
      // Permet de grandement se simplifier le parsing !!
      const optionsString = `"directions_options":{"format":"osrm"}`;
      const commandString = `valhalla_service ${this._configuration.storage.config} route '{${locationsString},${costingString},${optionsString}}' `;
      LOGGER.info(commandString);

      return new Promise( (resolve, reject) => {

        try {
          exec(commandString, (err, stdout, stderr) => {

            // Du moment qu'OSRM a répondu, on considère que la source est joignable
            this.state = "green";

            if (err) {
              // mais on ne renvoie pas l'erreur à l'utilisateur
              reject(errorManager.createError(" No path found ", 404));
              LOGGER.error("valhalla error for route :");
              LOGGER.error(err);

            } else {

              LOGGER.debug("valhalla response for route :");
              LOGGER.debug(stdout);

              try {
                resolve(this.writeRouteResponse(request, stdout));
              } catch (error) {
                reject(error);
              }

            }

          });

        } catch (error) {
          // Pour une raison que l'on ignore, la source n'est plus joignable
          this.state = "red";
          LOGGER.error(error);
          reject("Internal VALHALLA error");
        }
      });

    } else if (request.operation === "isochrone") {

      LOGGER.debug("operation request is isochrone");

      if (request.type === "isochroneRequest") {

        LOGGER.debug("type of request is isochroneRequest");
        let constraints = new Array();

        // Gestion des contraintes d'exclusion.
        if (request.constraints && Array.isArray(request.constraints) && request.constraints.length > 0) {

          valhallaRequest.exclude = [];
          for (let i = 0; i < request.constraints.length; i++) {
            let constraint = request.constraints[i];

            if (constraint.type === "banned") {
              constraints.push(constraint.field);
            } else {
              // ce sont des contraintes non gérées donc il n'y a rien à faire
              LOGGER.debug("no banned contraints");
            }

          }

        } else {
          // il n'y rien à faire car pas de contraintes
          LOGGER.debug("no contraints");
        }

        // ---
        // Conversion en unités valhalla : minutes et kilomètres...
        let costValue;
        if (request.costType === "time") {
          costValue = request.costValue / 60;
        }
        if (request.costType === "distance") {
          costValue = request.costValue / 1000;
        }

        let reverse = "false";
        if (request.direction === "arrival") {
          reverse = "true";
        }

        // Reprojection du point si nécessaire
        let tmpPoint = request.point.getCoordinatesIn(super.projection);

        const locationsString = `"locations":[{"lat":${tmpPoint[1]},"lon":${tmpPoint[0]}}]`;
        const costingString = `"costing":"${this._costs[request.profile][request.costType].costing}"`;
        let costingOptionsString = `"costing_options":{"${this._costs[request.profile][request.costType].costing}":{`;
        for (let i = 0; i < constraints.length; i++) {
          costingOptionsString += `"${constraints[i]}": "1"`
          if (i != constraints.length - 1) {
            costingOptionsString += ","
          }
        }
        costingOptionsString += "}}"
        const contoursString = `"contours":[{"${request.costType}":${costValue}}]`;
        const reverseString = `"reverse":${reverse}`;
        const polygonsString = `"polygons":true`;
        const commandString = `valhalla_service ${this._configuration.storage.config} isochrone '{${locationsString},${costingString},${costingOptionsString},${contoursString},${reverseString},${polygonsString}}' `;
        LOGGER.info(commandString);

        return new Promise( (resolve, reject) => {

          try {
            exec(commandString, (err, stdout, stderr) => {

            // Du moment qu'OSRM a répondu, on considère que la source est joignable
            this.state = "green";

            if (err) {
              // mais on ne renvoie pas l'erreur à l'utilisateur
              LOGGER.error("valhalla error for route :");
              LOGGER.error(err);
              reject(errorManager.createError(" No path found ", 404));

            } else {

              LOGGER.debug("valhalla response for iso :");
              LOGGER.debug(stdout);

              try {
                resolve(this.writeIsochroneResponse(request, stdout));
              } catch (error) {
                reject(error);
              }

            }

          });

          } catch (error) {
            // Pour une raison que l'on ignore, la source n'est plus joignable
            this.state = "red";
            LOGGER.error(error);
            reject("Internal VALHALLA error");
          }
        });

      } else {
        // TODO: qu'est-ce qui se passe si on arrive là, doit-on retourner une erreur ou une promesse
        LOGGER.error("type of request not found");
      }

    } else {

      // TODO: qu'est-ce qui se passe si on arrive là, doit-on retourner une erreur ou une promesse ?
      LOGGER.error("request operation not found");

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
  * @param {string} valhallaResponseStr - Réponse de valhalla
  *
  */
  writeRouteResponse (routeRequest, valhallaResponseStr) {

    LOGGER.debug("writeRouteResponse()");

    let resource;
    let start;
    let end;
    let profile;
    let optimization;
    let valhallaResponse;
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

    // Lecture de la réponse Valhalla
    // ---
    try {
      valhallaResponse = JSON.parse(valhallaResponseStr);
    } catch (error) {
      LOGGER.error("unable to parse valhalla response")
      LOGGER.error(valhallaResponseStr)
      LOGGER.error(error)
    }

    if (valhallaResponse.waypoints.length < 2) {
      // Cela veut dire que l'on n'a pas un start et un end dans la réponse OSRM
      throw errorManager.createError(" OSRM response is invalid: the number of waypoints is lower than 2. ");
    } else {
      LOGGER.debug("osrm response has 2 or more waypoints");
    }

    // projection demandée dans la requête
    let askedProjection = routeRequest.start.projection;
    LOGGER.debug("asked projection: " + askedProjection);

    LOGGER.debug("source projection: " + super.projection);

    // start
    start = new Point(valhallaResponse.waypoints[0].location[0], valhallaResponse.waypoints[0].location[1], super.projection);
    if (!start.transform(askedProjection)) {
      throw errorManager.createError(" Error during reprojection of start in OSRM response. ");
    } else {
      LOGGER.debug("start in asked projection:");
      LOGGER.debug(start);
    }

    // end
    end = new Point(valhallaResponse.waypoints[valhallaResponse.waypoints.length-1].location[0], valhallaResponse.waypoints[valhallaResponse.waypoints.length-1].location[1], super.projection);
    if (!end.transform(askedProjection)) {
      throw errorManager.createError(" Error during reprojection of end in OSRM response. ");
    } else {
      LOGGER.debug("end in asked projection:");
      LOGGER.debug(end);
    }

    let routeResponse = new RouteResponse(resource, start, end, profile, optimization);

    if (valhallaResponse.routes.length === 0) {
      // Cela veut dire que l'on n'a pas un start et un end dans la réponse OSRM
      throw errorManager.createError(" No route found ", 404);
    } else {
      LOGGER.debug("osrm response has 1 or more routes");
    }

    // routes
    // Il peut y avoir plusieurs itinéraires
    for (let i = 0; i < valhallaResponse.routes.length; i++) {

      LOGGER.debug("osrm route number " + i);

      let portions = new Array();
      let currentOsrmRoute = valhallaResponse.routes[i];

      // On commence par créer l'itinéraire avec les attributs obligatoires
      routes[i] = new Route( new Line(currentOsrmRoute.geometry, "polyline", super.projection, 6) );
      if (!routes[i].geometry.transform(askedProjection)) {
        throw errorManager.createError(" Error during reprojection of geometry in OSRM response. ");
      } else {
        LOGGER.debug("route geometry is converted");
      }

      // On récupère la distance et la durée
      routes[i].distance = new Distance(currentOsrmRoute.distance,"meter");
      routes[i].duration = new Duration(currentOsrmRoute.duration,"second");

      // On doit avoir une égalité entre ces deux valeurs pour la suite
      // Si ce n'est pas le cas, c'est qu'OSRM n'a pas le comportement attendu...
      if (currentOsrmRoute.legs.length !== valhallaResponse.waypoints.length-1) {
        throw errorManager.createError(" OSRM response is invalid: the number of legs is not proportionnal to the number of waypoints. ");
      } else {
        LOGGER.debug("number of osrm legs et asked waypoints are compatible");
      }

      // On va gérer les portions qui sont des parties de l'itinéraire entre deux points intermédiaires
      for (let j = 0; j < currentOsrmRoute.legs.length; j++) {

        LOGGER.debug("Portion (osrm legs) number " + j + " for route number " + i);

        let currentOsrmRouteLeg = currentOsrmRoute.legs[j];

        let legStart = new Point(valhallaResponse.waypoints[j].location[0], valhallaResponse.waypoints[j].location[1], super.projection);
        if (!legStart.transform(askedProjection)) {
          throw errorManager.createError(" Error during reprojection of leg start in OSRM response. ");
        } else {
          LOGGER.debug("portion start in asked projection:");
          LOGGER.debug(legStart);
        }

        let legEnd = new Point(valhallaResponse.waypoints[j+1].location[0], valhallaResponse.waypoints[j+1].location[1], super.projection);
        if (!legEnd.transform(askedProjection)) {
        throw errorManager.createError(" Error during reprojection of leg end in OSRM response. ");
        } else {
          LOGGER.debug("portion end in asked projection:");
          LOGGER.debug(legEnd);
        }

        portions[j] = new Portion(legStart, legEnd);

        // On récupère la distance et la durée
        portions[j].distance = new Distance(currentOsrmRouteLeg.distance,"meter");
        portions[j].duration = new Duration(currentOsrmRouteLeg.duration,"second");

        // Steps
        let steps = new Array();

        // On va associer les étapes à la portion concernée
        for (let k=0; k < currentOsrmRouteLeg.steps.length; k++) {

          LOGGER.debug("Step number " + k + " of portion number " + j + " for route number " + i);

          let currentOsrmRouteStep = currentOsrmRouteLeg.steps[k];
          steps[k] = new Step( new Line(currentOsrmRouteStep.geometry, "polyline", super.projection, 6) );
          if (!steps[k].geometry.transform(askedProjection)) {
            throw errorManager.createError(" Error during reprojection of step's geometry in OSRM response. ");
          } else {
            LOGGER.debug("step geometry is converted");
          }

          // Ajout de l'attribut name
          let nameAttributs;
          try {
            nameAttributs = JSON.parse(currentOsrmRouteStep.name);
          } catch(error) {
            // Ce doit être une chaîne de caractère
            nameAttributs = currentOsrmRouteStep.name;
          }
          steps[k].setAttributById("name", nameAttributs);

          // On récupère la distance et la durée
          steps[k].distance = new Distance(currentOsrmRouteStep.distance,"meter");
          steps[k].duration = new Duration(currentOsrmRouteStep.duration,"second");

          steps[k].instruction = {};
          steps[k].instruction.type = currentOsrmRouteStep.maneuver.type;
          if (currentOsrmRouteStep.maneuver.modifier) {
            steps[k].instruction.modifier = currentOsrmRouteStep.maneuver.modifier;
          }
          if (currentOsrmRouteStep.maneuver.exit) {
            steps[k].instruction.exit = currentOsrmRouteStep.maneuver.exit;
          }
        }

        portions[j].steps = steps;

      }

      routes[i].portions = portions;

    }

    routeResponse.routes = routes;

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
  * @param {string} valhallaResponseStr - Réponse de valhalla
  *
  */
  writeIsochroneResponse(isochroneRequest, valhallaResponseStr) {

    let point = {};
    let geometry = {};
    let valhallaResponse;

    // Lecture de la réponse Valhalla
    // ---
    try {
      valhallaResponse = JSON.parse(valhallaResponseStr);
    } catch (error) {
      LOGGER.error("unable to parse valhalla response")
      LOGGER.error(valhallaResponseStr)
      LOGGER.error(error)
    }

    // Si pgrResponse est vide
    if (valhallaResponse.features.length === 0) {
      throw errorManager.createError(" No data found ", 404);
    }

    // Projection demandée dans la requête
    let askedProjection = isochroneRequest.point.projection;
    LOGGER.debug("asked projection: " + askedProjection);

    LOGGER.debug("data projection: " + super.projection);

    // Création d'un objet Point
    point = isochroneRequest.point;
    if (!point.transform(askedProjection)) {
      throw errorManager.createError(" Error during reprojection of point in Valhalla response");
    } else {
      LOGGER.debug("point in asked projection:");
      LOGGER.debug(point);
    }

    let rawGeometry = valhallaResponse.features[0].geometry;

    // Création d'un objet Polygon à partir de la géométrie brute
    if (rawGeometry === null) {
      // Potentiellement le cas où il n'y a pas d'isochrone car costValue trop faible
      geometry = new Polygon({type: 'Point',coordinates: [point.x,point.y]}, "geojson", askedProjection);
    } else {

      geometry = new Polygon(rawGeometry, "geojson", super.projection);

      if (!geometry.transform(askedProjection)) {
        throw errorManager.createError(" Error during reprojection of point in Valhalla response");
      } else {
        LOGGER.debug("point in asked projection:");
        LOGGER.debug(point);
      }

    }

    /* Envoi de la réponse au proxy. */
    return new IsochroneResponse(
      point,
      isochroneRequest.resource,
      isochroneRequest.costType,
      isochroneRequest.costValue,
      geometry,
      isochroneRequest.profile,
      isochroneRequest.direction,
      isochroneRequest.askedProjection,
      isochroneRequest.timeUnit,
      isochroneRequest.distanceUnit
    );
  }
}
