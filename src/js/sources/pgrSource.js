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
const gisManager = require('../utils/gisManager');
const simplify = require('../utils/simplify');
const copyManager = require('../utils/copyManager');
const turf = require('@turf/turf');
const LooseConstraint = require('../constraint/looseConstraint');

// Création du LOGGER
const log4js = require('log4js');
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
  * @param{Base} base - Instance de Base pour permettre les requêtes vers le serveur PGRouting
  *
  */
  constructor(sourceJsonObject, base) {

    // Constructeur parent
    super(sourceJsonObject.id, "pgr", sourceJsonObject.description, sourceJsonObject.projection, sourceJsonObject.bbox);

    // Stockage de la configuration
    this._configuration = sourceJsonObject;

    // Base de données PGRouting
    this._base = base;

    // Schéma contenant les données dans la base
    this._schema = sourceJsonObject.storage.base.schema;

    // Attributs par défaut sur les voies dans la base
    this._defaultAttributes = new Array();

    // Attributs disponibles sur les voies dans la base
    this._otherAttributes = new Array();

    // Coûts disponibles
    this._costs = {};

    // TODO : à l'exemple des ressources, faire une fonction init() pour chaque source appelée dans le sourceManager
    // --
    if (sourceJsonObject.storage.base.attributes) {

      // Création des tableaux d'attributs
      for (let i = 0; i < sourceJsonObject.storage.base.attributes.length; i++) {
        let curAttribute = sourceJsonObject.storage.base.attributes[i];
        if (curAttribute.default === "true") {
          this._defaultAttributes.push(curAttribute);
        } else if (curAttribute.default === "false") {
          this._otherAttributes.push(curAttribute);
        } else {
          // cela ne doit pas arriver
        }
      }

      // stockage des attributs dans des tableaux pour le traitement des requêtes
      this._defaultAttributesTable = new Array();
      this._defaultAttributesKeyTable = new Array();
      for (let i = 0; i < this._defaultAttributes.length; i++) {
        this._defaultAttributesTable.push("'" + this._defaultAttributes[i].column + "'");
        this._defaultAttributesKeyTable.push(this._defaultAttributes[i].key);
      }

      // stockage des attributs par défaut en une chaîne de caractères pour le traitement des requêtes
      this._defaultAttributesString = this._defaultAttributesTable.join(",");

    }

    // Initialisation des coûts disponibles
    for (let i = 0; i < sourceJsonObject.costs.length; i++) {
      if (!this._costs[sourceJsonObject.costs[i].profile]) {
        Object.defineProperty(this._costs, sourceJsonObject.costs[i].profile, { value: new Object(), configurable: true, enumerable: true, writable: true });
      }
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile], sourceJsonObject.costs[i].optimization, { value: new Object(), configurable: true, enumerable: true, writable: true });
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile], sourceJsonObject.costs[i].costType, { value: new Object(), configurable: true, enumerable: true, writable: true });
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile][sourceJsonObject.costs[i].optimization], "costColumn", { value: sourceJsonObject.costs[i].costColumn, configurable: true, enumerable: true, writable: true });
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile][sourceJsonObject.costs[i].optimization], "rcostColumn", { value: sourceJsonObject.costs[i].rcostColumn, configurable: true, enumerable: true, writable: true });
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile][sourceJsonObject.costs[i].costType], "costColumn", { value: sourceJsonObject.costs[i].costColumn, configurable: true, enumerable: true, writable: true });
      Object.defineProperty(this._costs[sourceJsonObject.costs[i].profile][sourceJsonObject.costs[i].costType], "rcostColumn", { value: sourceJsonObject.costs[i].rcostColumn, configurable: true, enumerable: true, writable: true });
    }

    // --

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

    LOGGER.debug("Connexion to the base asked from a pgrSource...");

    if (!this._base.connected) {

      LOGGER.debug("pgrSource need to connect itself to the base");
      // Connection à la base de données
      try {

        await this._base.connect();
        this._connected = true;

      } catch (err) {

        LOGGER.error('connection error', err.stack)
        throw errorManager.createError("Cannot connect to source database");

      }

    } else {
      // Road2 est déjà connecté à la base
      LOGGER.debug("pgrSource's already connected to the base");
      this._connected = true;
    }


  }

  /**
  *
  * @function
  * @name disconnect
  * @description Déconnexion à la base pgRouting
  *
  */
  async disconnect() {

    LOGGER.info("Tentative de déconnexion de la base...");

    if (this._base.connected) {

      try {

        await this._base.disconnect();
        LOGGER.info("Déconnexion de la base effectuee");
        this._connected = false;

      } catch(err) {

        LOGGER.error('disconnection error', err.stack);
        throw errorManager.createError("Cannot disconnect to source database");

      }

    } else {
      // Road2 est déjà déconnecté de la base
      LOGGER.info("Deja deconnectee");
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

    LOGGER.debug("computeRequest()");

    let pgrRequest = {};

    if (request.operation === "route") {

      LOGGER.debug("operation request is route");

      // Construction de l'objet pour la requête pgr
      // Cette construction dépend du type de la requête fournie
      // ---
      const coordinatesTable = new Array();
      let attributes = "";
      let constraints = "";
      const looseConstraintsArray = [];

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

        pgrRequest.coordinates = coordinatesTable;

        // --- waysAttributes
        // attributes est déjà vide, on met les attributs par défaut s'il y en a
        if (this._defaultAttributes.length !== 0) {
          attributes = this._defaultAttributesString;
          LOGGER.debug("default attributes: " + attributes);
        } else {
          LOGGER.debug("no default attributes available");
        }


        // S'il existe des attributs disponibles mais non par défaut, on complète avec les attributs demandés
        if (this._otherAttributes.length !== 0 ) {

          // TODO : refaire cette partie, et donc la manière dont l'info est stockée dans la classe
          if (request.waysAttributes.length !== 0) {
            let requestedAttributes = new Array();

            for (let i = 0; i < request.waysAttributes.length; i++) {
              // on récupère le nom de la colonne en fonction de l'id de l'attribut demandé
              let isDefault = false;

              for (let j = 0; j < this._defaultAttributes.length; j++) {
                if (request.waysAttributes[i] === this._defaultAttributes[j].key) {
                  isDefault = true;
                  break;
                }
              }

              if (!isDefault) {
                for (let j = 0; j < this._otherAttributes.length; j++) {
                  if (request.waysAttributes[i] === this._otherAttributes[j].key) {
                    requestedAttributes.push("'" + this._otherAttributes[j].column + "'");
                    break;
                  }
                }
              } else {
                // on passe au suivant
              }

            }

            if (requestedAttributes.length !== 0) {

              if (attributes !== "") {
                attributes = attributes + "," + requestedAttributes.join(",");
              } else {
                attributes = requestedAttributes.join(",");
              }
              LOGGER.debug("final attributes: " + attributes);

            } else {
              LOGGER.debug("no more attributes to add");
            }

          } else {

            // on ne fait rien
            LOGGER.debug("no more attributes were required");

          }

        } else {
          LOGGER.debug("no other attributes available");
        }

        // --- waysAttributes

        if (request.constraints.length !== 0) {

          LOGGER.debug("constraints are asked");

          let requestedConstraints = new Array();
          for (let i = 0; i < request.constraints.length; i++) {
            if (request.constraints[i].type === 'avoid' || request.constraints[i].type === 'prefer') {
              looseConstraintsArray.push(request.constraints[i]);
            } else if (request.constraints[i].type === 'banned') {
              requestedConstraints.push( request.constraints[i].toSqlString() );
            } else {
              //TODO: que fait-on ? throw error ?
              LOGGER.error("constraint type is unknown");
            }
          }

          if (requestedConstraints.length > 0){
            constraints = constraints + requestedConstraints.join(' AND ');
            LOGGER.debug("final constraints: " + constraints);
          } else {
            //TODO: que fait-on ? throw error ?
            LOGGER.debug("no final constraints");
          }

        } else {

          // pas de contraintes à ajouter
          LOGGER.debug("no constraints asked");

        }


      } else {

        // TODO: qu'est-ce qui se passe si on arrive là, doit-on retourner une erreur ou une promesse
        LOGGER.error("type of request not found");

      }
      // ---

      const queryString = `SELECT * FROM ${this._schema}.shortest_path_pgrouting(ARRAY ${JSON.stringify(coordinatesTable)},$1,$2,$3,ARRAY [${attributes}]::text[],$4)`;

      let SQLParametersTable;
      if (looseConstraintsArray.length === 0) {
        SQLParametersTable = [
          request.profile,
          this._costs[request.profile][request.optimization].costColumn,
          this._costs[request.profile][request.optimization].rcostColumn,
          constraints
        ];
      } else {
        let onTheFlyCosts = LooseConstraint.looseConstraintsToSQL(looseConstraintsArray, this._costs[request.profile][request.optimization].costColumn, this._costs[request.profile][request.optimization].rcostColumn);
        SQLParametersTable = [
          request.profile,
          onTheFlyCosts[0],
          onTheFlyCosts[1],
          constraints
        ];
      }


      return new Promise( (resolve, reject) => {

        LOGGER.debug("queryString: " + queryString);
        LOGGER.debug("SQLParametersTable:");
        LOGGER.debug(SQLParametersTable);

        if (this._base.pool) {

          try {

            this._base.pool.query(queryString, SQLParametersTable, (err, result) => {

              this.state = "green";

              if (err) {

                LOGGER.error("pgr error:");
                LOGGER.error(err);

                // Traitement spécifique de certains codes pour dire au client qu'on n'a pas trouvé de routes
                if (err.code === "38001") {
                  reject(errorManager.createError(" No path found ", 404));
                } else if (err.code === "42703") {
                  // cette erreur remonte quand il n'y a pas de données dans PGR
                  this.state = "red";
                  reject(errorManager.createError(" No data found ", 503));
                } else {
                  reject(err);
                }

              } else {

                LOGGER.debug("pgr response:");
                LOGGER.debug(result);

                try {
                  resolve(this.writeRouteResponse(request, pgrRequest, result));
                } catch (error) {
                  reject(error);
                }

              }

            });

          } catch (error) {
            // Pour une raison que l'on ignore, la source n'est plus joignable
            this.state = "orange";
            LOGGER.error(error);
            reject("Internal PGR error");
          }



        } else {
          this.state = "red";
          reject(errorManager.createError(" PG is not available. "));
        }

      });

    } else if (request.operation === "isochrone") {

      LOGGER.debug("operation request is isochrone");

      if (request.type === "isochroneRequest") {

        LOGGER.debug("type of request is isochroneRequest");

        let point = "";
        try {
          point = JSON.stringify(request.point.getCoordinatesIn(super.projection));
        } catch(error) {
          LOGGER.error(error);
          throw errorManager.createError("Impossible de récupérer les coordonnées du point");
        }

        let constraints = "";

        if (request.constraints.length !== 0) {

          LOGGER.debug("constraints are asked");

          let requestedConstraints = new Array();
          for (let i = 0; i < request.constraints.length; i++) {
            requestedConstraints.push( request.constraints[i].toSqlString() );
          }
          constraints = constraints + requestedConstraints.join(' AND ');
          LOGGER.debug("constraints: " + constraints);

        } else {
          // on ne fait rien
          LOGGER.debug("no constraints asked");
        }

        const queryString = `SELECT * FROM ${this._schema}.generateIsochrone(ARRAY ${point}, $1, $2, $3, $4, $5)`;

        const SQLParametersTable = [
          request.costValue,
          request.direction,
          this._costs[request.profile][request.costType].costColumn,
          this._costs[request.profile][request.costType].rcostColumn,
          constraints
        ];

        return new Promise( (resolve, reject) => {

          LOGGER.debug("queryString: " + queryString);
          LOGGER.debug("SQLParametersTable:");
          LOGGER.debug(SQLParametersTable);

          if (this._base.pool) {

            try {

              this._base.pool.query(queryString, SQLParametersTable, (err, result) => {

                this.state = "green";

                if (err) {

                  // Traitement spécifique de certains codes pour dire au client qu'on n'a pas trouvé d'iso
                  if (err.code === "XX000") {
                    // Cette erreur remonte souvent quand PGR n'a pas assez de données pour créer ou calculer une iso (ex. costValue trop petit)
                    reject(errorManager.createError(" No iso found ", 404));
                  }  else {
                    LOGGER.error("pgr error:");
                    LOGGER.error(err);
                    reject(err);
                  }

                } else {

                  LOGGER.debug("pgr response:");
                  LOGGER.debug(result);

                  try {
                    resolve(this.writeIsochroneResponse(request, result));
                  } catch (error) {
                    reject(error);
                  }

                }

              });

            } catch (error) {
              // Pour une raison que l'on ignore, la source n'est plus joignable
              this.state = "orange";
              LOGGER.error(error);
              reject("Internal PGR error");
            }

          } else {
            this.state = "red";
            reject(errorManager.createError(" PG is not available. "));
          }

        });

      } else {

        throw errorManager.createError("type of request not found");

      }

    } else {

      throw errorManager.createError("request operation not found");

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

    LOGGER.debug("writeRouteResponse()");

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

    // Si pgrResponse est vide
    if (pgrResponse.rowCount === 0) {
      throw errorManager.createError(" No data found ", 404);
    } else if (pgrResponse.rowCount === 1) {
      if (pgrResponse.rows[0].edge === null) {
        throw errorManager.createError(" No data found ", 404);
      } else {
        // on continue
      }
    } else {
      LOGGER.debug("pgr response has data");
    }

    LOGGER.debug("attributes management");
    // On fait la liste des attributs par défaut
    if (this._defaultAttributes.length !== 0) {
      for (let i = 0; i < this._defaultAttributesKeyTable.length; i++) {
        finalAttributesKey.push(this._defaultAttributesKeyTable[i]);
        LOGGER.debug(this._defaultAttributesKeyTable[i] + " added");
      }
    } else {
      // il n'y a aucun attribut par défaut
      LOGGER.debug("no default attributes");
    }

    // On ajoute la liste des attributs demandés
    if (this._otherAttributes.length !== 0) {
      if (routeRequest.waysAttributes.length !== 0) {
        for (let i = 0; i < routeRequest.waysAttributes.length; i++) {
          // on récupère le nom de la colonne en fonction de l'id de l'attribut demandé
          let isDefault = false;

          for (let j = 0; j < this._defaultAttributes.length; j++) {
            if (routeRequest.waysAttributes[i] === this._defaultAttributes[j].key) {
              isDefault = true;
              break;
            }
          }

          if (!isDefault) {
            for (let j = 0; j < this._otherAttributes.length; j++) {
              if (routeRequest.waysAttributes[i] === this._otherAttributes[j].key) {
                finalAttributesKey.push(this._otherAttributes[j].key);
                LOGGER.debug(this._otherAttributes[j].key + " added");
                break;
              }
            }
          } else {
            // on passe au suivant
          }

        }
      } else {
        // il n'y a aucun attribut demandé par l'utilisateur
        LOGGER.debug("no attributes requested");
      }
    } else {
      LOGGER.debug("no other attributes");
    }

    // TODO: Il n'y a qu'une route pour l'instant: à changer pour plusieurs routes
    response.routes.push( {geometry: routeGeometry, duration: 0, distance: 0, legs: [] } );

    // Ajout des waypoints
    for (let i = 0; i < pgrRequest.coordinates.length; i++ ) {
      response.waypoints.push( { location: [] } );
    }

    let row;
    let currentGeom;
    let rowDuration;
    let rowDistance;
    let finalAttributesObject;

    LOGGER.debug("reading rows of pgr response...");

    for (let rowIdx = 0; rowIdx < pgrResponse.rows.length; rowIdx++) {
      row = pgrResponse.rows[rowIdx];

      if (row.path_seq !== lastPathSeq) {
        // TODO: Il n'y a qu'une route pour l'instant: à changer pour plusieurs routes
        response.routes[0].legs.push( { steps: [], geometry: {type: "LineString", coordinates: [] }, duration: 0, distance: 0 } );
        // Si ce n'est pas la première leg, il faut ajouter la dernière géométrie parcourue (pour faire le lien)
        // La géométrie précédente aura été parcourue en partie par la leg précédente, il faut la rajouter pour parcourir le reste.
        if (response.routes[0].legs.length > 1 && currentGeom) {
          // Si le tronçon doit être repris dans l'autre sens, il faut reverse l'ordre des coordonnées: voir #36883
          if (!gisManager.arraysEquals(currentGeom.coordinates[currentGeom.coordinates.length - 1 ], JSON.parse(row.geom_json).coordinates[0])) {
            currentGeom.coordinates = currentGeom.coordinates.reverse();
          }
          response.routes[0].legs.slice(-1)[0].geometry.coordinates.push( [...currentGeom.coordinates] );
          response.routes[0].legs.slice(-1)[0].steps.push(
            {
              geometry: currentGeom,
              finalAttributesObject,
              duration: rowDuration,
              distance: rowDistance
            }
          );
        }
      }

      finalAttributesObject = {};
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
        currentGeom = JSON.parse(row.geom_json);

        rowDuration = row.duration;
        rowDistance = row.distance;

        response.routes[0].legs.slice(-1)[0].duration += rowDuration;
        response.routes[0].legs.slice(-1)[0].distance += rowDistance;

        response.routes[0].duration += rowDuration;
        response.routes[0].distance += rowDistance;

        response.routes[0].legs.slice(-1)[0].geometry.coordinates.push( [...currentGeom.coordinates] );
        response.routes[0].legs.slice(-1)[0].steps.push(
          {
            geometry: currentGeom,
            finalAttributesObject,
            duration: rowDuration,
            distance: rowDistance
          }
        );
      }

      // Gestion des derniers points intermédiaires sur le même tronçon que le point final (ticket #34962)
      if (rowIdx === pgrResponse.rows.length - 1) {
        while (response.routes[0].legs.length < response.waypoints.length - 1) {
          response.routes[0].legs.push( { steps: [], geometry: {type: "LineString", coordinates: [] }, duration: 0, distance: 0 } );
          // Cas possible de problème dans les données : le tronçon n'a pas de géométrie
          if (currentGeom) {
            response.routes[0].legs.slice(-1)[0].geometry.coordinates.push( [...currentGeom.coordinates] );
            response.routes[0].legs.slice(-1)[0].steps.push(
              {
                geometry: currentGeom,
                finalAttributesObject,
                duration: rowDuration,
                distance: rowDistance
              }
            );
          }
        }
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
      // Reverse geometry order if end point closer to start of geometry than end
      if (turf.distance(legStart, turf.point(leg.geometry.coordinates[0])) > turf.distance(legStop, turf.point(leg.geometry.coordinates[0]))) {
        leg.geometry.coordinates.reverse();
      }

      routeGeometry.coordinates.push(...leg.geometry.coordinates);
    }

    // Simplification de la géométrie, tolérance à environ 1m
    routeGeometry.coordinates = simplify(routeGeometry.coordinates, 0.00001);

    for (let i = 0; i < pgrRequest.coordinates.length; i++){
      // Récupération des points projetés dans les waypoints
      response.waypoints[i].location = turf.truncate(
        turf.nearestPointOnLine(routeGeometry, turf.point(pgrRequest.coordinates[i])),
        {precision: 6}
      ).geometry.coordinates ;
    }

    // projection demandée dans la requête
    let askedProjection = routeRequest.start.projection;

    // start
    start = new Point(response.waypoints[0].location[0], response.waypoints[0].location[1], super.projection);
    if (!start.transform(askedProjection)) {
      throw errorManager.createError(" Error during reprojection of start in PGR response. ");
    } else {
      LOGGER.debug("start in asked projection:");
      LOGGER.debug(start);
    }

    // end
    end = new Point(response.waypoints[response.waypoints.length-1].location[0], response.waypoints[response.waypoints.length-1].location[1], super.projection);
    if (!end.transform(askedProjection)) {
      throw errorManager.createError(" Error during reprojection of end in PGR response. ");
    } else {
      LOGGER.debug("end in asked projection:");
      LOGGER.debug(end);
    }

    let routeResponse = new RouteResponse(resource, start, end, profile, optimization);

    if (response.routes.length === 0) {
      throw errorManager.createError(" No route found ", 404);
    } else {
      LOGGER.debug("intermediates response (after pgr response analysis) has data");
    }

    let routeDistance = 0;
    let routeDuration = 0;
    // routes
    // Il peut y avoir plusieurs itinéraires
    for (let i = 0; i < response.routes.length; i++) {

      LOGGER.debug("route number " + i);

      let portions = new Array();
      let currentPgrRoute = response.routes[i];

      // On commence par créer l'itinéraire avec les attributs obligatoires
      routes[i] = new Route( new Line(currentPgrRoute.geometry, "geojson", super.projection) );
      if (!routes[i].geometry.transform(askedProjection)) {
        throw errorManager.createError(" Error during reprojection of geometry in PGR response. ");
      } else {
        LOGGER.debug("route geometry is converted");
      }

      // On va gérer les portions qui sont des parties de l'itinéraire entre deux points intermédiaires
      let newRouteGeomCoords = [];

      for (let j = 0; j < currentPgrRoute.legs.length; j++) {

        LOGGER.debug("Portion number " + j + " for route number " + i);

        let newPortionGeomCoords = [];
        let portionDistance = 0;
        let portionDuration = 0;
        let currentPgrRouteLeg = currentPgrRoute.legs[j];

        let legStart = new Point(response.waypoints[j].location[0], response.waypoints[j].location[1], super.projection);
        if (!legStart.transform(askedProjection)) {
          throw errorManager.createError(" Error during reprojection of leg start in OSRM response. ");
        } else {
          LOGGER.debug("portion start in asked projection:");
          LOGGER.debug(legStart);
        }


        let legEnd = new Point(response.waypoints[j+1].location[0], response.waypoints[j+1].location[1], super.projection);
        if (!legEnd.transform(askedProjection)) {
          throw errorManager.createError(" Error during reprojection of leg end in OSRM response. ");
        } else {
          LOGGER.debug("portion end in asked projection:");
          LOGGER.debug(legEnd);
        }


        portions[j] = new Portion(legStart, legEnd);

        let steps = new Array();

        // On va associer les étapes à la portion concernée
        for (let k = 0; k < currentPgrRouteLeg.steps.length; k++) {

          LOGGER.debug("Step number " + k + " of portion number " + j + " for route number " + i);

          let currentPgrRouteStep = copyManager.deepCopy(currentPgrRouteLeg.steps[k]);

          // Pour le calcul de la portion véritablement parcourue (fin et début de leg)
          let currentPgrRouteStepDistance = turf.length(currentPgrRouteStep.geometry);

          // Troncature de la géométrie : cas où il n'y a qu'un step
          if (k === 0 && currentPgrRouteLeg.steps.length === 1){
            let stepStart = turf.point(response.waypoints[j].location);
            let stepEnd = turf.point(response.waypoints[j + 1].location);

            currentPgrRouteStep.geometry.coordinates = turf.truncate(
              turf.lineSlice(
                stepStart,
                stepEnd,
                currentPgrRouteStep.geometry
              ),
              {precision: 6}
            ).geometry.coordinates;

            // Reverse geometry order if end point closer to start of geometry than end
            if (
              turf.distance(stepStart, turf.point(currentPgrRouteStep.geometry.coordinates[0])) >
              turf.distance(stepEnd, turf.point(currentPgrRouteStep.geometry.coordinates[0]))
              ) {
              currentPgrRouteStep.geometry.coordinates.reverse();
            }

            // On n'enlève les valeurs dupliquées que si la linestring est plus longue que 2 points
            if (currentPgrRouteStep.geometry.coordinates.length > 2) {
              currentPgrRouteStep.geometry.coordinates = turf.cleanCoords(currentPgrRouteStep.geometry).coordinates
            }
          }

          // Troncature de la géométrie : cas de début de leg
          else if (k === 0){
            let stepStart = turf.point(response.waypoints[j].location);
            let stepEnd = turf.point(gisManager.arraysIntersection(
              currentPgrRouteLeg.steps[k + 1].geometry.coordinates,
              currentPgrRouteStep.geometry.coordinates
            )[0]);
            currentPgrRouteStep.geometry.coordinates = turf.truncate(
              turf.lineSlice(
                stepStart,
                stepEnd,
                currentPgrRouteStep.geometry
              ),
              {precision: 6}
            ).geometry.coordinates;
            // Reverse geometry order if end point closer to start of geometry than end
            if (
              turf.distance(stepStart, turf.point(currentPgrRouteStep.geometry.coordinates[0])) >
              turf.distance(stepEnd, turf.point(currentPgrRouteStep.geometry.coordinates[0]))
              ) {
              currentPgrRouteStep.geometry.coordinates.reverse();
            }

            // On n'enlève les valeurs dupliquées que si la linestring est plus longue que 2 points
            if (currentPgrRouteStep.geometry.coordinates.length > 2) {
              currentPgrRouteStep.geometry.coordinates = turf.cleanCoords(currentPgrRouteStep.geometry).coordinates
            }
          }

          // Troncature de la géométrie : cas de fin de leg
          else if (k === currentPgrRouteLeg.steps.length - 1) {
            let stepEnd = turf.point(response.waypoints[j+1].location);

            // Pour le cas des boucles, il faut tester si l'intersection entre le dernier tronçon
            // et l'avant dernier tronçon est supérieure à 1 point
            const lastLine = currentPgrRouteStep.geometry.coordinates;
            const secondToLastLine = currentPgrRouteLeg.steps[k - 1].geometry.coordinates;
            let common_point;

            const lastSecIntersection = gisManager.arraysIntersection(lastLine, secondToLastLine);
            // S'il n'y a qu'une intersection, on la prend
            if (lastSecIntersection.length === 1){
              common_point = lastSecIntersection[0];
            // S'il y en a plusieurs et que la multilinestring a une longueur de 2, prendre l'intersection qui
            // entraîne le plus court chemin.
            // TODO: vraiment ????????????
            } else if (currentPgrRouteLeg.steps.length === 2) {
              // TODO: do something else
              common_point = lastSecIntersection[0];
            // S'il y en a plusieurs et que la multilinestring a une longueur d'au moins trois, prendre le
            // point qui n'intersecte pas l'antépenultième tronçon (sinon ce dernier serait le penultième)
            } else {
              const thirdToLastLine = currentPgrRouteLeg.steps[k - 2].geometry.coordinates;
              // Soit l'array suivant n'a qu'une seule valeur (sauf cas imaginaires), soit lastLine
              // et thirdToLastLine sont le même tronçon.
              let last_common_point;
              const lastThirdIntersection = gisManager.arraysIntersection(lastLine, thirdToLastLine);
              // Premier cas, on prend l'unique valeur.
              if (lastThirdIntersection.length === 1) {
                last_common_point = lastThirdIntersection[0];
                if (gisManager.arraysEquals(last_common_point, lastSecIntersection[0])) {
                  common_point = lastSecIntersection[1];
                } else {
                  common_point = lastSecIntersection[0];
                }
              // Second cas, last et thirdToLast sont identiques
              // Hypothèse : n'arrive que dans une configuration à 2 tronçons à sens unique
              // Si l'hypothèse est vraie, alors il faut prendre l'autre point que pour le
              // début de leg.
              } else {
                common_point = lastSecIntersection[0];
              }
            }

            currentPgrRouteStep.geometry.coordinates = turf.truncate(
              turf.lineSlice(
                common_point,
                stepEnd,
                currentPgrRouteStep.geometry
              ),
              {precision: 6}
            ).geometry.coordinates;
            // Reverse geometry order if end point closer to start of geometry than end
            if (
              turf.distance(common_point, turf.point(currentPgrRouteStep.geometry.coordinates[0])) >
              turf.distance(stepEnd, turf.point(currentPgrRouteStep.geometry.coordinates[0]))
              ) {
              currentPgrRouteStep.geometry.coordinates.reverse();
            }

            // On n'enlève les valeurs dupliquées que si la linestring est plus longue que 2 points
            if (currentPgrRouteStep.geometry.coordinates.length > 2) {
              currentPgrRouteStep.geometry.coordinates = turf.cleanCoords(currentPgrRouteStep.geometry).coordinates
            }
          }

          // Pour le calcul de la portion véritablement parcourue (fin et début de leg)
          // vaut currentPgrRouteStepDistance lorsque le step actuel n'est pas début ni fin de leg
          let currentPgrRouteStepPortionDistance = turf.length(currentPgrRouteStep.geometry);
          // Calcul de la portion véritablement parcourue (fin et début de leg) pour la distance et duration
          // vaut 1 lorsque le step actuel n'est pas début ni fin de leg
          let currentDistanceRatio = currentPgrRouteStepPortionDistance / currentPgrRouteStepDistance;

          newPortionGeomCoords.push(currentPgrRouteStep.geometry.coordinates);

          steps[k] = new Step( new Line(currentPgrRouteStep.geometry, "geojson", super.projection) );
          if (!steps[k].geometry.transform(askedProjection)) {
            throw errorManager.createError(" Error during reprojection of step's geometry in PGR response. ");
          } else {
            LOGGER.debug("step geometry is converted");
          }
          // ajout des attributs
          steps[k].attributes = currentPgrRouteStep.finalAttributesObject;

          // On récupère la distance et la durée
          steps[k].distance = new Distance(Math.round(currentDistanceRatio * currentPgrRouteStep.distance * 10) / 10,"meter");
          steps[k].duration = new Duration(Math.round(currentDistanceRatio * currentPgrRouteStep.duration * 10) / 10,"second");

          portionDistance += currentDistanceRatio * currentPgrRouteStep.distance;
          portionDuration += currentDistanceRatio * currentPgrRouteStep.duration;
        }

        // On récupère la distance et la durée
        portions[j].distance = new Distance(Math.round(portionDistance * 10) / 10,"meter");
        portions[j].duration = new Duration(Math.round(portionDuration * 10) / 10,"second");

        routeDistance += portionDistance;
        routeDuration += portionDuration;

        let newLegDissolvedCoords = gisManager.geoJsonMultiLineStringCoordsToSingleLineStringCoords(newPortionGeomCoords);
        newRouteGeomCoords.push(...newLegDissolvedCoords);

        if (routeRequest.computeSteps) {
          portions[j].steps = steps;
        } else {

          // Comme les steps ne sont pas demandées, on ne les donne pas
          LOGGER.debug("no steps asked by user");

        }

      }

      // On récupère la distance et la durée
      routes[i].distance = new Distance(Math.round(routeDistance * 10) / 10,"meter");
      routes[i].duration = new Duration(Math.round(routeDuration * 10) / 10,"second");

      currentPgrRoute.geometry.coordinates = newRouteGeomCoords;
      routes[i].geometry = new Line(currentPgrRoute.geometry, "geojson", super.projection);
      if (!routes[i].geometry.transform(askedProjection)) {
        throw errorManager.createError(" Error during reprojection of step's geometry in PGR response. ");
      } else {
        LOGGER.debug("step geometry is converted");
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
  * @param {pgrResponse} pgrResponse - Objet pgrResponse
  *
  */
  writeIsochroneResponse(isochroneRequest, pgrResponse) {

    let point = {};
    let geometry = {};

    // Si pgrResponse est vide
    if (pgrResponse.rowCount === 0) {
      throw errorManager.createError(" No data found ", 404);
    }

    // Projection demandée dans la requête
    let askedProjection = isochroneRequest.point.projection;
    LOGGER.debug("asked projection: " + askedProjection);

    LOGGER.debug("data projection: " + super.projection);


    // Création d'un objet Point
    point = isochroneRequest.point;
    if (!point.transform(askedProjection)) {
      throw errorManager.createError(" Error during reprojection of point in PGRouting response");
    } else {
      LOGGER.debug("point in asked projection:");
      LOGGER.debug(point);
    }

    let rawGeometry = null;

    try {
      rawGeometry = JSON.parse(pgrResponse.rows[0].geometry);
    } catch(error) {
      LOGGER.debug(error);
      throw errorManager.createError("Impossible de parser la réponse de PGRouting");
    }

    // Création d'un objet Polygon à partir de la géométrie brute
    if (rawGeometry === null) {
      // Potentiellement le cas où il n'y a pas d'isochrone car costValue trop faible
      geometry = new Polygon({type: 'Point',coordinates: [point.x,point.y]}, "geojson", askedProjection);
    } else {

      geometry = new Polygon(rawGeometry, "geojson", super.projection);

      if (!geometry.transform(askedProjection)) {
        throw errorManager.createError(" Error during reprojection of point in PGRouting response");
      } else {
        LOGGER.debug("point in asked projection:");
        LOGGER.debug(point);
      }

    }

    // Création d'un objet Polygon à partir du GeoJSON reçu.
    geometry = new Polygon(rawGeometry, "geojson", super.projection);

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
