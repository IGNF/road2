'use strict';

/**
*
* @class
* @name Route
* @description Classe modélisant un itinéraire.
*
*
*/

module.exports = class Route {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Route
  * @param {object} geometry - Instance de la classe Geometry, Géométrie de l'itinéraire
  *
  */
  constructor(geometry) {

    // geometry
    this._geometry = geometry;

    // portions
    // s'il y a des points intermédiaires, il y a des portions pour les relier
    this._portions = new Array();

    // Distance globale de l'itinéraire
    this._distance = {};

    // Durée globale de l'itinéraire
    this._duration = {};

  }

  /**
  *
  * @function
  * @name get geometry
  * @description Récupérer la géométrie de l'itinéraire
  *
  */
  get geometry () {
    return this._geometry;
  }

  /**
  *
  * @function
  * @name set geometry
  * @description Attribuer la géométrie de l'itinéraire
  * @param {string} st - Géométrie de l'étape
  *
  */
  set geometry (st) {
    this._geometry = st;
  }

  /**
  *
  * @function
  * @name get portions
  * @description Récupérer les portions de l'itinéraire
  *
  */
  get portions () {
    return this._portions;
  }

  /**
  *
  * @function
  * @name set portions
  * @description Attribuer les portions de l'itinéraire
  * @param {table} st - Ensemble des portions (tableau d'objets Portion)
  *
  */
  set portions (st) {
    this._portions = st;
  }
  /**
  *
  * @function
  * @name get duration
  * @description Récupérer la durée
  *
  */
  get duration () {
    return this._duration;
  }

  /**
  *
  * @function
  * @name set duration
  * @description Attribuer la durée
  * @param {float} du - Durée
  *
  */
  set duration (du) {
    this._duration = du;
  }

  /**
  *
  * @function
  * @name get distance
  * @description Récupérer la distance
  *
  */
  get distance () {
    return this._distance;
  }

  /**
  *
  * @function
  * @name set distance
  * @description Attribuer la distance
  * @param {float} di - Distance
  *
  */
  set distance (di) {
    this._distance = di;
  }


}
