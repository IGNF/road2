'use strict';

/**
*
* @class
* @name Step
* @description Classe modélisant une étape dans un itinéraire.
*
*
*/

module.exports = class Step {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Step
  * @param {Line} geometry - Instance de la classe Line, Géométrie de l'étape
  *
  */
  constructor(geometry) {

    // geometry
    this._geometry = geometry;

    // Distance globale de l'étape
    this._distance = {};

    // Durée globale de l'étape
    this._duration = {};

    // attributes
    this._attributes = {};

  }

  /**
  *
  * @function
  * @name get geometry
  * @description Récupérer la géométrie de l'étape
  *
  */
  get geometry () {
    return this._geometry;
  }

  /**
  *
  * @function
  * @name set geometry
  * @description Attribuer la géométrie de l'étape
  * @param {Line} st - Géométrie de l'étape
  *
  */
  set geometry (st) {
    this._geometry = st;
  }

  /**
  *
  * @function
  * @name get attributes
  * @description Récupérer les attributs de l'étape
  *
  */
  get attributes () {
    return this._attributes;
  }

  /**
  *
  * @function
  * @name getAttributById
  * @description Récupérer la valeur d'un attribut par son id
  *
  */
  getAttributById (id) {

    if (this._attributes[id]) {
      return this._attributes[id];
    } else {
      return null;
    }

  }

  /**
  *
  * @function
  * @name setAttributById
  * @description Définir la valeur d'un attribut avec son id
  *
  */
  setAttributById (id, value) {

    this._attributes[id] = value;

  }

  /**
  *
  * @function
  * @name set attributes
  * @description Attribuer les attributs de l'étape
  * @param {string} at - Attributs de l'étape
  *
  */
  set attributes (at) {
    this._attributes = at;
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
