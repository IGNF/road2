'use strict';

const Request = require('./request');

/**
*
* @class
* @name nearestRequest
* @description Classe modélisant une requête de recherche de point le plus proche.
* Chaque requête reçue par le service doit être transformée en requête de cette forme
* pour le proxy
*
*/

module.exports = class nearestRequest extends Request {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe nearestRequest
  * @param {string} resource - Ressource.
  * @param {Point} coordinates - Point de départ.
  * @param {integer} number - Type du coût.
  *
  */

  constructor(resource, coordinates) {

    // Constructeur parent
    super("nearest", "nearestRequest");

    // Ressource concernée
    this._resource = resource;

    // Coordonnées du point fourni
    this._coordinates = coordinates;

    // Nombre de points attendus en retour 
    this._number = 1;

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
  * @param {string} res - Id de la ressource
  *
  */
  set resource (res) {
    this._resource = res;
  }

  /**
  *
  * @function
  * @name get coordinates
  * @description Récupérer le point de la requête
  *
  */
  get coordinates() {
    return this._coordinates;
  }

  /**
  *
  * @function
  * @name set coordinates
  * @description Attribuer le point de la requête.
  * @param {Point} cd - Point
  *
  */
  set coordinates(cd) {
    this._coordinates = cd;
  }

  /**
  *
  * @function
  * @name get number
  * @description Récupérer le nombre de la requête.
  *
  */
  get number() {
    return this._number;
  }

  /**
  *
  * @function
  * @name set number
  * @description Attribuer le nombre de la requête.
  * @param {integer} nb - Type du coût.
  *
  */
  set number(nb) {
    this._number = nb;
  }


}
