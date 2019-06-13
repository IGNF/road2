'use strict';

const Source = require('./source');
const { Client } = require('pg');
const fs = require('fs');
const RouteResponse = require('../responses/routeResponse');
const Route = require('../responses/route');
const Portion = require('../responses/portion');
const Step = require('../responses/step');
const errorManager = require('../utils/errorManager');
const log4js = require('log4js');

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
  *
  */
  constructor(sourceJsonObject) {
    // Constructeur parent
    super(sourceJsonObject.id,sourceJsonObject.type);
    // Ajout des opérations possibles sur ce type de source
    this.availableOperations.push("route");
    // Stockage de la configuration
    this._configuration = sourceJsonObject;
    // Client de base de données
    let db_config_path = this._configuration.storage.dbConfig;
    let raw_dbconfig = fs.readFileSync(db_config_path);
    this._dbConfig = JSON.parse(raw_dbconfig);

    this._client = new Client(this._dbConfig);
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
    // Connection à la base de données
    LOGGER.info("Connection à la base de données : " + this._dbConfig.database);
    try {
      await this._client.connect();
      LOGGER.info("Connecté à la base de données : " + this._dbConfig.database);
      super.connected = true;
    } catch (err) {
      LOGGER.error('connection error', err.stack)
      throw errorManager.createError("Cannot connect source");
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
    try {
      const err = await this._client.end();
      if (err) {
        LOGGER.error('deconnection error', err.stack)
        throw errorManager.createError("Cannot disconnect source");
      } else {
        LOGGER.info("Déonnecté à la base : " + this._dbConfig.database);
        super.connected = false;
      }
    } catch(err) {
      throw errorManager.createError("Cannot disconnect source");
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
      let sql_function;
      const coordinatesTable = new Array();

      if (request.type === "routeRequest") {
        // Coordonnées
        // start
        coordinatesTable.push(request.start.lon);
        coordinatesTable.push(request.start.lat);
        // intermediates
        if (request.intermediates.length !== 0) {
          for (let i = 0; i < request.intermediates.length; i++) {
            coordinatesTable.push(request.intermediates[i].lon);
            coordinatesTable.push(request.intermediates[i].lat);
          }
        }
        // end
        coordinatesTable.push(request.end.lon);
        coordinatesTable.push(request.end.lat);

        pgrRequest.coordinates = coordinatesTable;

        // steps
        if (request.computeGeometry) {
          sql_function = "coord_dijkstra";
        } else {
          sql_function = "coord_dijkstra_no_geom";
        }

      } else {
        // on va voir si c'est un autre type de requête
      }

      // ---
      const query_string = "SELECT * FROM " + sql_function +
        "($1::double precision, $2::double precision, $3::double precision, $4::double precision,'" +
        this._configuration.storage.costColumn +
        "','" +
        this._configuration.storage.rcostColumn +
        "')";

      return new Promise( (resolve, reject) => {
        this._client.query(query_string, coordinatesTable, (err, result) => {
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
    // TODO: refonte gestion géométrie
    const route_geometry = {
      type: "LineString",
      coordinates: []
    };

    // TODO: Il n'y a qu'une route pour l'instant
    response.routes.push( {geometry: route_geometry, legs: [] } );

    for (let row of pgrResponse.rows) {

      if (row.node_lon) {
        response.waypoints.push( { location: [row.node_lon, row.node_lat] } );
      }
      if (row.geom_json) {
        // TODO: refonte gestion géométrie
        let current_geom = JSON.parse(row.geom_json);
        route_geometry.coordinates.push( current_geom.coordinates );
      }
      if (row.path_seq === 1) {
        // TODO: Il n'y a qu'une route pour l'instant
        response.routes[0].legs.push( { steps: [] } );
      }

      // TODO: refonte gestion géométrie
      // TODO: Il n'y a qu'une route pour l'instant
      response.routes[0].legs.slice(-1)[0].steps.push( { geometry: JSON.parse(row.geom_json) } )
    }

    // Transformation des coordonnées en mode MultiLineString vers LineString
    const dissolved_coords = [];
    const first_line = route_geometry.coordinates[0];
    const second_line = route_geometry.coordinates[1];

    function arraysEquals(a, b) {
      // Pour tester l'égalité entre couple de coordonnées
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length != b.length) return false;

      // If you don't care about the order of the elements inside
      // the array, you should sort both arrays here.
      // Please note that calling sort on an array will modify that array.
      // you might want to clone your array first.

      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    function arrays_intersection(a, b) {
      // Pour tester l'intersection entre 2 suites de paires de coordonnées
      const result = [];
      for (let arr_a of a) {
        for (let arr_b of b) {
          if (arraysEquals(arr_a, arr_b)) {
            result.push(arr_a);
          }
        }
      }
      return result;
    }

    const common_point = arrays_intersection(first_line, second_line)[0];

    console.log(common_point);

    if (first_line.indexOf(common_point) == 0) {
      first_line.reverse();
    }
    dissolved_coords.push(...first_line);

    for (let i = 1; i < route_geometry.coordinates.length; i++) {
      let curr_line = route_geometry.coordinates[i];
      if (!arraysEquals(dissolved_coords[dissolved_coords.length - 1 ], curr_line[0])) {
        curr_line.reverse();
      }
      curr_line.splice(0, 1);
      dissolved_coords.push(...curr_line);
    }

    route_geometry.coordinates = dissolved_coords;

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
      routes[i] = new Route(currentPgrRoute.geometry);

      // On doit avoir une égalité entre ces deux valeurs pour la suite
      // Si ce n'est pas le cas, c'est que PGR n'a pas le comportement attendu...
      if (currentPgrRoute.legs.length !== response.waypoints.length-1) {
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
            steps[k] = new Step(currentPgrRouteStep.geometry);
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
    return routeResponse;

  }


}
