'use strict';

const Response = require('./response');

/**
*
* @class
* @name routeResponse
* @description Classe modélisant une réponse d'itinéraire.
*
*/

module.exports = class routeResponse extends Response {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe routeResponse
  * @param {string} resource - Nom de la ressource
  * @param {Point} start - Point de départ
  * @param {Point} end - Point d'arrivée
  * @param {string} profile - Profile
  * @param {string} optimization - Optimisation
  *
  */
  constructor(resource, start, end, profile, optimization) {

    // Constructeur parent
    super("routeResponse");

    // Ressource 
    this._resource = resource;

    // start
    this._start = start;

    // end
    this._end = end;

    // profile
    this._profile = profile;

    // optimization
    this._optimization = optimization;

    // Itinéraires
    //Tableau contenant l'ensemble des itinéraires calculés par le moteur
    this._routes = new Array();

    // Informations spécifiques à un moteur et son API native
    this._engineExtras = {};

  }

  /**
  *
  * @function
  * @name get resource
  * @description Récupérer la ressource de la réponse
  *
  */
   get resource () {
    return this._resource;
  }

  /**
  *
  * @function
  * @name set resource
  * @description Attribuer la ressource de la réponse
  * @param {Point} res - Ressource
  *
  */
  set resource (res) {
    this._resource = res;
  }

  /**
  *
  * @function
  * @name get start
  * @description Récupérer le point de départ des itinéraires
  *
  */
  get start () {
    return this._start;
  }

  /**
  *
  * @function
  * @name set start
  * @description Attribuer le point de départ des itinéraires
  * @param {Point} st - Point de départ
  *
  */
  set start (st) {
    this._start = st;
  }

  /**
  *
  * @function
  * @name get end
  * @description Récupérer le point d'arrivée des itinéraires
  *
  */
  get end () {
    return this._end;
  }

  /**
  *
  * @function
  * @name set end
  * @description Attribuer le point d'arrivée des itinéraires
  * @param {Point} en - Point d'arrivée
  *
  */
  set end (en) {
    this._end = en;
  }

  /**
  *
  * @function
  * @name get profile
  * @description Récupérer le profile des itinéraires
  *
  */
  get profile () {
    return this._profile;
  }

  /**
  *
  * @function
  * @name set profile
  * @description Attribuer le profile des itinéraires
  * @param {string} pr - Profile
  *
  */
  set profile (pr) {
    this._profile = pr;
  }

  /**
  *
  * @function
  * @name get optimization
  * @description Récupérer l'optimisation des itinéraires
  *
  */
  get optimization () {
    return this._optimization;
  }

  /**
  *
  * @function
  * @name set optimization
  * @description Attribuer l'optimisation des itinéraires
  * @param {string} op - Optimisation
  *
  */
  set optimization (op) {
    this._optimization = op;
  }

  /**
  *
  * @function
  * @name get routes
  * @description Récupérer les itinéraires
  *
  */
  get routes () {
    return this._routes;
  }

  /**
  *
  * @function
  * @name set routes
  * @description Attribuer les itinéraires
  * @param {table} st - Ensemble des itinéraires (tableau d'objets Route)
  *
  */
  set routes (st) {
    this._routes = st;
  }

    /**
  *
  * @function
  * @name get engineExtras
  * @description Récupérer les propriétés non génériques, spécifiques au moteur et à son API
  *
  */
  get engineExtras () {
    return this._engineExtras;
  }

  /**
  *
  * @function
  * @name set engineExtras
  * @description Attribuer les propriétés non génériques, spécifiques au moteur et à son API
  * @param {object} ee - Dictionnaire de propriétés spécifiques au moteur et à son API
  *
  */
  set engineExtras (ee) {
    this._engineExtras = ee;
  }

}
