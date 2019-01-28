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
  *
  */
  constructor(geometry) {

    // geometry
    this._geometry = geometry;

    // portions
    // s'il y a des points intermédiaires, il y a des portions pour les relier
    this._portions = [];

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
  *
  */
  set portions (st) {
    this._portions = st;
  }


}
