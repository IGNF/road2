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
  * @param {string} geometry - Géométrie de l'étape
  *
  */
  constructor(geometry) {

    // geometry
    this._geometry = geometry;

    // name
    this._name = "";

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
  * @name get name
  * @description Récupérer le nom de l'étape
  *
  */
  get name () {
    return this._name;
  }

  /**
  *
  * @function
  * @name set name
  * @description Attribuer le nom de l'étape
  * @param {string} na - Nom de l'étape
  *
  */
  set name (na) {
    this._name = na;
  }


}
