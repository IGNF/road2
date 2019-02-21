'use strict';

var Request = require('./request');

/**
*
* @class
* @name routeRequest
* @description Classe modélisant une requête d'itinéraire.
* Chaque requête reçue par le service doit être transformée en requête de cette forme
* pour le proxy
*/

module.exports = class routeRequest extends Request {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe routeRequest
  * @param {string} resource - Ressource concernée
  * @param {object} start - Point de départ concerné (ex. {lon: 8.732901, lat: 41.928821})
  * @param {object} end - Point d'arrivée concerné (ex. {lon: 8.732901, lat: 41.953932})
  * @param {string} profile - Profile concerné
  * @param {string} optimization - Optimisation concernée
  *
  */
  constructor(resource, start, end, profile, optimization) {

    // Constructeur parent
    super("route", resource, "routeRequest");

    // Point de départ
    // (ex. {lon: 8.732901, lat: 41.928821})
    this._start = start;

    // Point d'arrivée
    // (ex. {lon: 8.732901, lat: 41.953932})
    this._end = end;

    // Profile
    this._profile = profile;

    // Optimisation
    this._optimization = optimization;

    // Intermediates
    // (ex. [{lon: 8.732901, lat: 41.953932}, {lon: 8.732901, lat: 41.928821}])
    this._intermediates = new Array();

    // computeGeometry
    this._computeGeometry = true;

  }

  /**
  *
  * @function
  * @name get start
  * @description Récupérer le point de départ de la requête
  *
  */
  get start () {
    return this._start;
  }

  /**
  *
  * @function
  * @name set start
  * @description Attribuer le point de départ de la requête
  *
  */
  set start (st) {
    this._start = st;
  }

  /**
  *
  * @function
  * @name get end
  * @description Récupérer le point d'arrivée de la requête
  *
  */
  get end () {
    return this._end;
  }

  /**
  *
  * @function
  * @name set end
  * @description Attribuer le point d'arrivée de la requête
  *
  */
  set end (en) {
    this._end = en;
  }

  /**
  *
  * @function
  * @name get profile
  * @description Récupérer le profile de la requête
  *
  */
  get profile () {
    return this._profile;
  }

  /**
  *
  * @function
  * @name set profile
  * @description Attribuer le profile de la requête
  *
  */
  set profile (pr) {
    this._profile = pr;
  }

  /**
  *
  * @function
  * @name get optmization
  * @description Récupérer l'optmisation de la requête
  *
  */
  get optimization () {
    return this._optimization;
  }

  /**
  *
  * @function
  * @name set optmization
  * @description Attribuer l'optmisation de la requête
  *
  */
  set optimization (op) {
    this._optimization = op;
  }

  /**
  *
  * @function
  * @name get intermediates
  * @description Récupérer les points intermédiaires de la requête
  *
  */
  get intermediates () {
    return this._intermediates;
  }

  /**
  *
  * @function
  * @name set intermediates
  * @description Attribuer les points intermédiaires de la requête
  *
  */
  set intermediates (i) {
    this._intermediates = i;
  }

  /**
  *
  * @function
  * @name get computeGeometry
  * @description Récupérer le choix de l'affichage de la géoémtrie
  *
  */
  get computeGeometry () {
    return this._computeGeometry;
  }

  /**
  *
  * @function
  * @name set computeGeometry
  * @description Attribuer le choix de l'affichage de la géoémtrie
  *
  */
  set computeGeometry (i) {
    this._computeGeometry = i;
  }


}
