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
    * @param {object} geometry - Instance de la classe Geometry, Géométrie de l'étape
  *
  */
  constructor(geometry) {

    // geometry
    this._geometry = geometry;

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
  * @param {string} st - Géométrie de l'étape
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


}
