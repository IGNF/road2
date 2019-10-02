'use strict';

const Response = require('./response');

/**
*
* @class
* @name isochroneResponse
* @description Classe modélisant une réponse pour un calcul d'iso.
*
*/

module.exports = class isochroneResponse extends Response {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe isochroneResponse
  * @param {string} resource - Nom de la ressource.
  * @param {Point} location - Point de départ/arrivée du calcul.
  * @param {Geometry} - Représentation de la géométrie.
  * @param {string} profile - Profile.
  * @param {string} optimization - Optimisation.
  *
  */
  constructor(resource, location, geometry, profile, optimization) {

    // Constructeur parent
    super(resource);

    // location
    this._location = location;

    // profile
    this._profile = profile;

    // optmization
    this._optimization = optimization;

    // Objet contenant la géométrie retrounée par le moteur.
    this._geometry = geometry;

  }

  /**
  *
  * @function
  * @name get location
  * @description Récupérer le point de départ/arrivée du calcul.
  *
  */
  get location () {
    return this._location;
  }

  /**
  *
  * @function
  * @name set location
  * @description Attribuer le point de départ/arrivée du calcul.
  * @param {Point} lct - Point de départ/arrivée du calcul.
  *
  */
  set location (lct) {
    this._location = lct;
  }

  /**
  *
  * @function
  * @name get geometry
  * @description Récupérer la géométrie de la zone de chalandise de l'iso.
  *
  */
  get geometry () {
    return this._geometry;
  }

  /**
  *
  * @function
  * @name set geometry
  * @description Attribuer la géométrie de la zone de chalandise de l'iso.
  * @param {object} gmtr - Géométrie de la zone de chalandise de l'iso.
  *
  */
  set geometry (gmtr) {
    this._geometry = gmtr;
  }

  /**
  *
  * @function
  * @name get profile
  * @description Récupérer le profile.
  *
  */
  get profile () {
    return this._profile;
  }

  /**
  *
  * @function
  * @name set profile
  * @description Attribuer le profile.
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
  * @description Récupérer l'optimisation.
  *
  */
  get optimization () {
    return this._optimization;
  }

  /**
  *
  * @function
  * @name set optimization
  * @description Attribuer l'optimisation.
  * @param {string} op - Optimisation
  *
  */
  set optimization (op) {
    this._optimization = op;
  }

}
