'use strict';

/**
*
* @class
* @name Portion
* @description Classe modélisant une portion dans un itinéraire.
* Une portion représente la partie de l'itinéraire contenue entre deux points intermédiaires.
* S'il n'y a pas de points intermédiaires alors la portion représente l'ensemble de l'itinéraire.
*
*/

module.exports = class Portion {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Portion
  * @param {string} start - Point de départ
  * @param {string} end - Point d'arrivée
  *
  */
  constructor(start, end) {

    // start
    this._start = start;

    // end
    this._end = end;

    // Distance globale de la portion
    this._distance = {};

    // Durée globale de la portion
    this._duration = {};

    // steps
    // C'est l'ensemble des étapes de la portion de l'itinéraire
    this._steps = new Array();

  }

  /**
  *
  * @function
  * @name get start
  * @description Récupérer le point de départ de la portion
  *
  */
  get start () {
    return this._start;
  }

  /**
  *
  * @function
  * @name set start
  * @description Attribuer le point de départ de la portion
  * @param {string} start - Point de départ
  *
  */
  set start (st) {
    this._start = st;
  }

  /**
  *
  * @function
  * @name get end
  * @description Récupérer le point d'arrivée de la portion
  *
  */
  get end () {
    return this._end;
  }

  /**
  *
  * @function
  * @name set end
  * @description Attribuer le point d'arrivée de la portion
  * @param {string} end - Point d'arrivée
  *
  */
  set end (en) {
    this._end = en;
  }

  /**
  *
  * @function
  * @name get steps
  * @description Récupérer les étapes de la portion
  *
  */
  get steps () {
    return this._steps;
  }

  /**
  *
  * @function
  * @name set steps
  * @description Attribuer les étapes de la portion
  * @param {table} st - Ensemble des étapes (tableau d'objets Step)
  *
  */
  set steps (st) {
    this._steps = st;
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
