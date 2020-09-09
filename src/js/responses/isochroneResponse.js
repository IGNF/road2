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
  * @param {Point} point - Point de départ/arrivée du calcul.
  * @param {string} resource - Nom de la ressource.
  * @param {string} costType - Type du coût.
  * @param {string} costValue - Valeur du coût.
  * @param {Geometry} geometry - Représentation de la géométrie.
  * @param {string} profile - Profile.
  * @param {string} direction - Sens du parcours.
  * @param {string} askedProjection - Projection souhaitée.
  *
  */
  constructor(point, resource, costType, costValue, geometry, profile, direction, askedProjection) {

    // Constructeur parent
    super(resource);

    // point
    this._point = point;

    // costType
    this._costType = costType;

    // costValue
    this._costValue = costValue;

    // Objet contenant la géométrie retrounée par le moteur.
    this._geometry = geometry;

    // profile
    this._profile = profile;

    // direction
    this._direction = direction;

    // direction
    this._askedProjection = askedProjection;

  }

  /**
  *
  * @function
  * @name get point
  * @description Récupérer le point de départ/arrivée du calcul.
  *
  */
  get point () {
    return this._point;
  }

  /**
  *
  * @function
  * @name set point
  * @description Attribuer le point de départ/arrivée du calcul.
  * @param {Point} pt - Point de départ/arrivée du calcul.
  *
  */
  set point (pt) {
    this._point = pt;
  }

  /**
  *
  * @function
  * @name get costType
  * @description Récupérer le type du coût.
  *
  */
  get costType () {
    return this._costType;
  }

  /**
  *
  * @function
  * @name set costType
  * @description Attribuer le type du coût.
  * @param {string} ct - Type du coût.
  *
  */
  set costType (ct) {
    this._costType = ct;
  }

  /**
  *
  * @function
  * @name get costValue
  * @description Récupérer la valeur du coût.
  *
  */
  get costValue () {
    return this._costValue;
  }

  /**
  *
  * @function
  * @name set costValue
  * @description Attribuer la valeur du coût.
  * @param {string} ct - Valeur du coût.
  *
  */
  set costValue (cv) {
    this._costValue = cv;
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
  * @name get direction
  * @description Récupérer le sens du parcours.
  *
  */
  get direction () {
    return this._direction;
  }

  /**
  *
  * @function
  * @name set direction
  * @description Attribuer le sens du parcours.
  * @param {string} drct - Sens du parcours
  *
  */
  set direction (drct) {
    this._direction = drct;
  }

  /**
  *
  * @function
  * @name get askedProjection
  * @description Récupérer la projection souhaitée.
  *
  */
  get askedProjection () {
    return this._askedProjection;
  }

  /**
  *
  * @function
  * @name set askedProjection
  * @description Attribuer la projection souhaitée.
  * @param {string} prjct - Projection souhaitée.
  *
  */
  set askedProjection (prjct) {
    this._askedProjection = prjct;
  }

}
