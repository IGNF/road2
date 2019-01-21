'use strict';

/**
*
* @class
* @name routeRequest
* @description Classe modélisant une requête d'itinéraire.
* Chaque requête reçue par le service doit être transformée en requête de cette forme
* pour le proxy
*/

module.exports = class routeRequest {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe routeRequest
  *
  */
  constructor(resource, start, end) {

    // Ressource concernée
    this._resource = resource;

    // Point de départ
    this._start = start;

    // Point d'arrivée
    this._end = end;

  }

  /**
  *
  * @function
  * @name get resource
  * @description Récupérer la ressource de la requête
  *
  */
  get resource () {
    return this._resource;
  }

  /**
  *
  * @function
  * @name set resource
  * @description Attribuer la ressource de la requête
  *
  */
  set resource (res) {
    this._resource = res;
  }

  /**
  *
  * @function
  * @name get start
  * @description Récupérer le point de départ de la requête
  *
  */
  get start () {
    return this._start;
  }

  /**
  *
  * @function
  * @name set start
  * @description Attribuer le point de départ de la requête
  *
  */
  set start (st) {
    this._start = st;
  }

  /**
  *
  * @function
  * @name get end
  * @description Récupérer le poitn d'arrivée de la requête
  *
  */
  get end () {
    return this._end;
  }

  /**
  *
  * @function
  * @name set end
  * @description Attribuer le poitn d'arrivée de la requête
  *
  */
  set end (en) {
    this._end = end;
  }


}
