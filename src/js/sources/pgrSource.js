'use strict';

var Source = require('./source');
const { Client } = require('pg');
var RouteResponse = require('../responses/routeResponse');
var Route = require('../responses/route');
var Portion = require('../responses/portion');
var Step = require('../responses/step');
var errorManager = require('../utils/errorManager');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("PGRSOURCE");


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

    // Stockage de la configuration
    this._configuration = sourceJsonObject;

    // Connection à la base de données
    this._client = {};

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
  * @name connect
  * @description Connection à la base pgRouting
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */
  connect() {

    // Connection à la base de données
    let db_config = this._configuration.storage.file; // objet similaire à config de https://node-postgres.com/api/client

    LOGGER.info("Connection à la base : " + db_config.database);
    this._client = new Client(db_config);
    this._client.connect((err) => {
      if (err) {
        LOGGER.error('erreur de connection : ', err.stack)
      } else {
        LOGGER.info('connection réussie')
      }
    });
    super.connected = true;
    return true;

  }

  /**
  *
  * @function
  * @name disconnect
  * @description Déconnection à la base pgRouting
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */
  disconnect() {
    await this._client.end((err) => {
      LOGGER.info('client déconecté')
      if (err) {
        LOGGER.error('error pendant la deconnection : ', err.stack)
      }
    });
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
      // Cette construction dépend du type de la requête fournie
      // ---
      var pgrRequest = {};

      if (request.type === "routeRequest") {
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

        pgrRequest.coordinates = coordinatesTable;

        let sql_function;
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
      let query_string = "SELECT " + sql_function + "($1::double precision, $2::double precision, $3::double precision, $4::double precision,'" +
        this._configuration.storage.costColumn +
        "','" +
        this._configuration.storage.reverseCostColumn +
        "')";

      this._client.query(query_string, pgrRequest, (err, result) => {
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
  * C'est cette fonction qui doit vérifier le contenu de la réponse. Une fois la réponse envoyée
  * au proxy, on considère qu'elle est correcte.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @param {osrmResponse} osrmResponse - Objet osrmResponse
  * @param {function} callback - Callback de succès (Objet Response ou dérivant de la classe Response) et d'erreur
  *
  */
  writeRouteResponse (routeRequest, pgrResponse, callback) {

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

    if (pgrResponse.length < 1) {
      // Cela veut dire que l'on n'a pas un start et un end dans la réponse OSRM
      callback(errorManager.createError(" pgr response is invalid: the number of steps is lower than 1. "));
    }

    let vertex_table = "ways_vertices_pgr";
    let start_id = pgrResponse[0].node;
    let end_id = pgrResponse[pgrResponse.length - 1].node;
    let start_request_result = await this._client.query("SELECT * FROM " + vertex_table + " WHERE id=" + start_id);

    // start
    start = start_request_result.lon +","+ start_request_result.lat;

    let end_request_result = await this._client.query("SELECT * FROM " + vertex_table + " WHERE id=" + end_id);

    // end
    end = end_request_result.lon +","+ end_request_result.lat;

    var routeResponse = new RouteResponse(resource, start, end, profile, optimization);

    // routes
    // Il peut y avoir plusieurs itinéraires
    for (var i = 0; i < 1; i++) {

      var portions = new Array();

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
