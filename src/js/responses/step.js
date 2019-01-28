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
  *
  */
  constructor(geometry) {

    // geometry
    this._geometry = geometry;

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
  *
  */
  set geometry (st) {
    this._geometry = st;
  }


}
