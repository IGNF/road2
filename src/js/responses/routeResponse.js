'use strict';

var Response = require('./response');

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
  *
  */
  constructor(resource, start, end, profile, optimization) {

    // Constructeur parent
    super(resource);

    // start
    this._start = start;

    // end
    this._end = end;

    // profile
    this._profile = profile;

    // optmization
    this._optimization = optimization;

  }

  /**
  *
  * @function
  * @name get start
  * @description Récupérer le point de départ de l'itinéraire de la réponse
  *
  */
  get start () {
    return this._start;
  }

  /**
  *
  * @function
  * @name set start
  * @description Attribuer le point de départ de l'itinéraire de la réponse
  *
  */
  set start (st) {
    this._start = st;
  }

  /**
  *
  * @function
  * @name get end
  * @description Récupérer le point d'arrivée de l'itinéraire de la réponse
  *
  */
  get end () {
    return this._end;
  }

  /**
  *
  * @function
  * @name set end
  * @description Attribuer le point d'arrivée de l'itinéraire de la réponse
  *
  */
  set end (st) {
    this._end = st;
  }

  /**
  *
  * @function
  * @name get profile
  * @description Récupérer le profile de l'itinéraire
  *
  */
  get profile () {
    return this._profile;
  }

  /**
  *
  * @function
  * @name set profile
  * @description Attribuer le profile de l'itinéraire
  *
  */
  set profile (st) {
    this._profile = st;
  }

  /**
  *
  * @function
  * @name get optimization
  * @description Récupérer l'optimisation de l'itinéraire
  *
  */
  get optimization () {
    return this._optimization;
  }

  /**
  *
  * @function
  * @name set optimization
  * @description Attribuer l'optimisation de l'itinéraire
  *
  */
  set optimization (st) {
    this._optimization = st;
  }



}
