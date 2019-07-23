'use strict';

const Source = require('./source');
const { Client } = require('pg');
const fs = require('fs');
const RouteResponse = require('../responses/routeResponse');
const Route = require('../responses/route');
const Portion = require('../responses/portion');
const Line = require('../geometry/line');
const Step = require('../responses/step');
const Distance = require('../geography/distance');
const Duration = require('../time/duration');
const errorManager = require('../utils/errorManager');
const gisManager = require('../utils/gisManager');
const log4js = require('log4js');
const simplify = require('../utils/simplify');
const turf = require('@turf/turf');

// Création du LOGGER
const LOGGER = log4js.getLogger("PGRSOURCE");

/**
*
* @class
* @name pgrSource
* @description Classe modélisant une source pgRouting.
*
*/
module.exports = class pgrSource extends Source {
  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe pgrSource
  * @param{json} sourceJsonObject - Description de la source
  * @param{topology} topology -  Instance de la classe Topology
  *
  */
  constructor(sourceJsonObject, topology) {

    // Constructeur parent
    super(sourceJsonObject.id, "pgr", topology);

    // Ajout des opérations possibles sur ce type de source
    this.availableOperations.push("route");

    // Stockage de la configuration
    this._configuration = sourceJsonObject;

    // Coût
    this._cost = sourceJsonObject.storage.costColumn;

    // Coût inverse
    this._reverseCost = sourceJsonObject.storage.rcostColumn;

    // Profil
    this._profile = sourceJsonObject.cost.profile;

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
  * @description Connection à la base pgRouting
  *
  */
  async connect() {

    if (!this._topology.base.connected) {

      // Connection à la base de données
      try {

        await this._topology.base.connect();
        this._connected = true;

      } catch (err) {

        LOGGER.error('connection error', err.stack)
        throw errorManager.createError("Cannot connect to source database");

      }

    } else {
      // Road2 est déjà connecté à la base
      this._connected = true;
    }


  }

  /**
  *
  * @function
  * @name disconnect
  * @description Déconnection à la base pgRouting
  *
  */
  async disconnect() {

    if (!this._topology.base.connected) {

      try {

        await this._topology.base.disconnect();
        this._connected = false;

      } catch(err) {

        LOGGER.error('deconnection error', err.stack);
        throw errorManager.createError("Cannot disconnect to source database");

      }

    } else {
      // Road2 est déjà déconnecté à la base
      this._connected = false;
    }

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

      // Construction de l'objet pour la requête pgr
      // Cette construction dépend du type de la requête fournie
      // ---
      let pgrRequest = {};
      const coordinatesTable = new Array();
      let attributes = "";

      if (request.type === "routeRequest") {
        // Coordonnées
        // start
        coordinatesTable.push([request.start.x, request.start.y]);
        // intermediates
        if (request.intermediates.length !== 0) {
          for (let i = 0; i < request.intermediates.length; i++) {
            coordinatesTable.push([request.intermediates[i].x, request.intermediates[i].y]);
          }
        }
        // end
        coordinatesTable.push([request.end.x, request.end.y]);

        pgrRequest.coordinates = coordinatesTable;

        // --- waysAttributes
        // attributes est déjà vide, on met les attributs par défaut
        attributes = this._topology.defaultAttributesString;

        // on complète avec les attributs demandés
        if (request.waysAttributes.length !== 0) {
          let requestedAttributes = new Array();

          for (let i = 0; i < request.waysAttributes.length; i++) {
            // on récupère le nom de la colonne en fonction de l'id de l'attribut demandé
            let isDefault = false;

            for (let j = 0; j < this._topology.defaultAttributes.length; j++) {
              if (request.waysAttributes[i] === this._topology.defaultAttributes[j].key) {
                isDefault = true;
                break;
              }
            }

            if (!isDefault) {
              for (let j = 0; j < this._topology.otherAttributes.length; j++) {
                if (request.waysAttributes[i] === this._topology.otherAttributes[j].key) {
                  requestedAttributes.push("'" + this._topology.otherAttributes[j].column + "'");
                  break;
                }
              }
            } else {
              // on passe au suivant
            }

          }

          if (requestedAttributes.length !== 0) {
            if (attributes !== "") {
              attributes = attributes + ",";
            }
            attributes = attributes + requestedAttributes.join(",");
          }

          // --- waysAttributes

        } else {
          // on ne fait rien
        }

      } else {
        // on va voir si c'est un autre type de requête
      }
      // ---
      const queryString = "SELECT * FROM shortest_path_with_algorithm(ARRAY " + JSON.stringify(coordinatesTable) +",$1,$2,$3,$4,ARRAY [" + attributes + "]::text[])";

      const SQLParametersTable = [
        this._profile,
        this._cost,
        this._reverseCost,
        request.algorithm
      ];

      return new Promise( (resolve, reject) => {
        this._topology.base.pool.query(queryString, SQLParametersTable, (err, result) => {
          if (err) {
            LOGGER.error(err);
            reject(err);
          } else {
            try {
              resolve(this.writeRouteResponse(request, pgrRequest, result));
            } catch (err) {
              reject(err);
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
  * @param {pgrResponse} pgrResponse - Objet pgrResponse
  *
  */
  writeRouteResponse (routeRequest, pgrRequest, pgrResponse) {

    let resource;
    let start;
    let end;
    let profile;
    let optimization;
    let lastPathSeq = 0;
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

    // Traitement de la réponse PGR
    // ---
    const response = {
      waypoints: [],
      routes: []
    };
    const routeGeometry = {
      type: "LineString",
      coordinates: []
    };

    // Gestion des attributs
    let finalAttributesKey = new Array();

    // On fait la liste des attributs par défaut
    if (this._topology.defaultAttributesKeyTable.length !== 0) {
      for (let i = 0; i < this._topology.defaultAttributesKeyTable.length; i++) {
        finalAttributesKey.push(this._topology.defaultAttributesKeyTable[i]);
      }
    } else {
      // il n'y a aucun attribut par défaut
    }

    // On ajoute la liste des attributs demandés
    if (routeRequest.waysAttributes.length !== 0) {
      for (let i = 0; i < routeRequest.waysAttributes.length; i++) {
        // on récupère le nom de la colonne en fonction de l'id de l'attribut demandé
        let isDefault = false;

        for (let j = 0; j < this._topology.defaultAttributes.length; j++) {
          if (routeRequest.waysAttributes[i] === this._topology.defaultAttributes[j].key) {
            isDefault = true;
            break;
          }
        }

        if (!isDefault) {
          for (let j = 0; j < this._topology.otherAttributes.length; j++) {
            if (routeRequest.waysAttributes[i] === this._topology.otherAttributes[j].key) {
              finalAttributesKey.push(this._topology.otherAttributes[j].key);
              break;
            }
          }
        } else {
          // on passe au suivant
        }

      }
    } else {
      // il n'y a aucun attribut demandé par l'utilisateur
    }

    // TODO: Il n'y a qu'une route pour l'instant: à changer pour plusieurs routes
    response.routes.push( {geometry: routeGeometry, duration: 0, distance: 0, legs: [] } );

    let row;
    for (let rowIdx = 0; rowIdx < pgrResponse.rows.length; rowIdx++) {
      row = pgrResponse.rows[rowIdx];

      if (row.path_seq === 1 || (row.path_seq < 0 && row.path_seq != lastPathSeq)) {
        // TODO: Il n'y a qu'une route pour l'instant: à changer pour plusieurs routes
        response.routes[0].legs.push( { steps: [], geometry: {type: "LineString", coordinates: [] }, duration: 0, distance: 0 } );
      }
      if ( row.path_seq === 1 || rowIdx == pgrResponse.rows.length - 1 || (row.path_seq < 0 && row.path_seq != lastPathSeq) ) {
        response.waypoints.push( { location: [] } );
      }

      let finalAttributesObject = {};
      // S'il y a donc bien des attributs à renvoyer, on lit la réponse
      if (finalAttributesKey.length !== 0) {

        if (row.edge_attributes) {

          // lecture des attributs
          let attributesResults = row.edge_attributes.split("§§");

          if (attributesResults.length !== finalAttributesKey.length || attributesResults.length === 0) {
            throw errorManager.createError(" PGR internal server error: attributes number is invalid");
          }

          for (let j = 0; j < finalAttributesKey.length; j++) {
            finalAttributesObject[finalAttributesKey[j]] = attributesResults[j];
          }

        } else {
          // il n'y a aucun attribut à lire
        }

      } else {
        // il n'y a aucun attribut demandé
      }

      // TODO: Il n'y a qu'une route pour l'instant: à changer pour plusieurs routes
      if (row.geom_json) {
        let currentGeom = JSON.parse(row.geom_json);

        let rowDuration = row.duration;
        let rowDistance = row.distance;

        response.routes[0].legs.slice(-1)[0].duration += rowDuration;
        response.routes[0].legs.slice(-1)[0].distance += rowDistance;

        response.routes[0].duration += rowDuration;
        response.routes[0].distance += rowDistance;

        response.routes[0].legs.slice(-1)[0].geometry.coordinates.push( currentGeom.coordinates );
        response.routes[0].legs.slice(-1)[0].steps.push(
          {
            geometry: JSON.parse(row.geom_json),
            finalAttributesObject,
            duration: rowDuration,
            distance: rowDistance}
          );
      }
      lastPathSeq = row.path_seq;

    }

    // Troncature des géométries sur les portions (legs)
    let legStart;
    let legStop;
    let leg;
    let legDissolvedCoords;

    // TODO: Il n'y a qu'une route pour l'instant: à changer pour plusieurs routes
    for (let i = 0; i < response.routes[0].legs.length; i++){
      leg = response.routes[0].legs[i];

      legDissolvedCoords = gisManager.geoJsonMultiLineStringCoordsToSingleLineStringCoords(leg.geometry.coordinates);
      leg.geometry.coordinates = legDissolvedCoords;

      legStart = turf.point(pgrRequest.coordinates[i]);
      legStop = turf.point(pgrRequest.coordinates[i+1]);

      // Récupération de la géométrie entre le départ et l'arrivée
      leg.geometry.coordinates = turf.truncate(
        turf.lineSlice(legStart, legStop, leg.geometry),
        {precision: 6}
      ).geometry.coordinates;

      routeGeometry.coordinates.push(...leg.geometry.coordinates);
    }

    // Simplification de la géométrie, tolérance à environ 5m
    routeGeometry.coordinates = simplify(routeGeometry.coordinates, 0.00005);
    if (response.waypoints.length < 1) {
      throw errorManager.createError(" No PGR path found: the number of waypoints is lower than 2. ");
    }

    if (response.waypoints.length != pgrRequest.coordinates.length) {
      throw errorManager.createError(" No PGR path found: the number of waypoints is different from input waypoints ");
    }

    for (let i = 0; i < pgrRequest.coordinates.length; i++){
      // Récupération des points projetés dans les waypoints
      response.waypoints[i].location = turf.truncate(
        turf.nearestPointOnLine(routeGeometry, turf.point(pgrRequest.coordinates[i])),
        {precision: 6}
      ).geometry.coordinates ;
    }

    // start
    start = response.waypoints[0].location[0] +","+ response.waypoints[0].location[1];

    // end
    end = response.waypoints[response.waypoints.length-1].location[0] +","+ response.waypoints[response.waypoints.length-1].location[1];

    let routeResponse = new RouteResponse(resource, start, end, profile, optimization);

    if (response.routes.length === 0) {
      throw errorManager.createError(" No PGR path found: the number of routes is equal to 0. ");
    }

    // routes
    // Il peut y avoir plusieurs itinéraires
    for (let i = 0; i < response.routes.length; i++) {

      let portions = new Array();
      let currentPgrRoute = response.routes[i];

      // On commence par créer l'itinéraire avec les attributs obligatoires
      routes[i] = new Route( new Line(currentPgrRoute.geometry, "geojson", this._topology.projection) );

      // On récupère la distance et la durée
      routes[i].distance = new Distance(Math.round(currentPgrRoute.distance*10)/10,"m");
      routes[i].duration = new Duration(Math.round(currentPgrRoute.duration*10)/10,"s");

      // On doit avoir une égalité entre ces deux valeurs pour la suite
      // Si ce n'est pas le cas, c'est que PGR n'a pas le comportement attendu...
      if (currentPgrRoute.legs.length !== response.waypoints.length - 1) {
        throw errorManager.createError(" PGR response is invalid: the number of legs is not proportionnal to the number of waypoints. ");
      }

      // On va gérer les portions qui sont des parties de l'itinéraire entre deux points intermédiaires
      for (let j = 0; j < currentPgrRoute.legs.length; j++) {

        let currentPgrRouteLeg = currentPgrRoute.legs[j];
        let legStart = response.waypoints[j].location[0] +","+ response.waypoints[j].location[1];
        let legEnd = response.waypoints[j+1].location[0] +","+ response.waypoints[j+1].location[1];

        portions[j] = new Portion(legStart, legEnd);
        // On récupère la distance et la durée
        portions[j].distance = new Distance(Math.round(currentPgrRouteLeg.distance*10)/10,"m");
        portions[j].duration = new Duration(Math.round(currentPgrRouteLeg.duration*10)/10,"s");

        if (routeRequest.computeGeometry) {
          let steps = new Array();

          // On va associer les étapes à la portion concernée
          for (let k=0; k < currentPgrRouteLeg.steps.length; k++) {
            let currentPgrRouteStep = currentPgrRouteLeg.steps[k];
            // Troncature de la géométrie : cas de début de step
            if (k == 0){
              const stepStart = turf.point(response.waypoints[j].location);

              currentPgrRouteStep.geometry.coordinates = turf.truncate(
                turf.lineSlice(
                  stepStart,
                  currentPgrRouteStep.geometry.coordinates[currentPgrRouteStep.geometry.coordinates.length - 1],
                  currentPgrRouteStep.geometry
                ),
                {precision: 6}
              ).geometry.coordinates;
            }
            // Troncature de la géométrie : cas de fin de step
            if (k == currentPgrRouteLeg.steps.length - 1) {
              const stepEnd = turf.point(response.waypoints[j+1].location);

              currentPgrRouteStep.geometry.coordinates = turf.truncate(
                turf.lineSlice(
                  currentPgrRouteStep.geometry.coordinates[0],
                  stepEnd,
                  currentPgrRouteStep.geometry
                ),
                {precision: 6}
              ).geometry.coordinates;
            }

            steps[k] = new Step( new Line(currentPgrRouteStep.geometry, "geojson", this._topology.projection) );
            // ajout des attributs
            steps[k].attributes = currentPgrRouteStep.finalAttributesObject;

            // On récupère la distance et la durée
            steps[k].distance = new Distance(Math.round(currentPgrRouteStep.distance*10)/10,"m");
            steps[k].duration = new Duration(Math.round(currentPgrRouteStep.duration*10)/10,"s");

          }

          portions[j].steps = steps;

        } else {
          // Comme la géométrie des steps n'est pas demandée, on ne la donne pas
        }

      }

      routes[i].portions = portions;

    }

    routeResponse.routes = routes;

    return routeResponse;

  }


}
