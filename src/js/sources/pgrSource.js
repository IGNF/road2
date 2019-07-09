'use strict';

const Source = require('./source');
const { Client } = require('pg');
const fs = require('fs');
const RouteResponse = require('../responses/routeResponse');
const Route = require('../responses/route');
const Portion = require('../responses/portion');
const Geometry = require('../geometry/geometry');
const Step = require('../responses/step');
const errorManager = require('../utils/errorManager');
const gisManager = require('../utils/gisManager');
const log4js = require('log4js');
const simplify = require('../utils/simplify');

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
        coordinatesTable.push([request.start.lon, request.start.lat]);
        // intermediates
        if (request.intermediates.length !== 0) {
          for (let i = 0; i < request.intermediates.length; i++) {
            coordinatesTable.push([request.intermediates[i].lon, request.intermediates[i].lat]);
          }
        }
        // end
        coordinatesTable.push([request.end.lon, request.end.lat]);

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
      console.log(attributes);
      // ---
      const queryString = "SELECT * FROM shortest_path_with_algorithm(ARRAY " + JSON.stringify(coordinatesTable) +",$1,$2,$3,ARRAY [" + attributes + "])";

      const SQLParametersTable = [
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
              resolve(this.writeRouteResponse(request, result));
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
  writeRouteResponse (routeRequest, pgrResponse) {

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

    // TODO: Il n'y a qu'une route pour l'instant
    response.routes.push( {geometry: routeGeometry, legs: [] } );

    let row;
    for (let rowIdx = 0; rowIdx < pgrResponse.rows.length; rowIdx++) {
      row = pgrResponse.rows[rowIdx];
      if (row.geom_json) {
        let currentGeom = JSON.parse(row.geom_json);
        routeGeometry.coordinates.push( currentGeom.coordinates );
      }
      if (row.path_seq === 1 || (row.path_seq < 0 && row.path_seq != lastPathSeq)) {
        // TODO: Il n'y a qu'une route pour l'instant
        response.routes[0].legs.push( { steps: [] } );
      }
      if ( row.path_seq === 1 || rowIdx == pgrResponse.rows.length - 1 || (row.path_seq < 0 && row.path_seq != lastPathSeq) ) {
        response.waypoints.push( { location: [row.node_lon, row.node_lat] } );
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

      // TODO: Il n'y a qu'une route pour l'instant
      // TODO: à revoir pour la gestion des coûts : dernier step non pris en compte
      if (row.geom_json) {
        response.routes[0].legs.slice(-1)[0].steps.push( { geometry: JSON.parse(row.geom_json), finalAttributesObject} );
      }
      lastPathSeq = row.path_seq;

    }

    // Conversion en LineString
    const dissolvedCoords = gisManager.geoJsonMultiLineStringCoordsToSingleLineStringCoords(routeGeometry.coordinates);
    // Simplification de la géométrie, tolérance à environ 5m
    const simplifiedDissolvedCoords = simplify(dissolvedCoords, 0.00005);
    routeGeometry.coordinates = simplifiedDissolvedCoords;

    if (response.waypoints.length < 1) {
      throw errorManager.createError(" No PGR path found: the number of waypoints is lower than 2. ");
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
      routes[i] = new Route( new Geometry(currentPgrRoute.geometry, "LineString", "geojson") );

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

        if (routeRequest.computeGeometry) {
          let steps = new Array();

          // On va associer les étapes à la portion concernée
          for (let k=0; k < currentPgrRouteLeg.steps.length; k++) {

            let currentPgrRouteStep = currentPgrRouteLeg.steps[k];
            steps[k] = new Step( new Geometry(currentPgrRouteStep.geometry, "LineString", "geojson") );
            // ajout des attributs
            steps[k].attributes = currentPgrRouteStep.finalAttributesObject;

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
