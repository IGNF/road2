'use strict';

const Response = require('./response');

/**
*
* @class
* @name nearestResponse
* @description Classe modélisant une réponse de plus proche (nearest).
*
*/

module.exports = class nearestResponse extends Response {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe nearestResponse
  * @param {string} resource - Nom de la ressource
  * @param {Point} coordinates - Point demandé dans la requête
  *
  */
  constructor(resource, coordinates) {

    // Constructeur parent
    super(resource);

    // coordinates
    this._coordinates = coordinates;

    // Points
    //Tableau contenant l'ensemble des points renvoyés par le moteur
    this._points = new Array();

  }

  /**
  *
  * @function
  * @name get coordinates
  * @description Récupérer le point demandé
  *
  */
  get coordinates () {
    return this._coordinates;
  }

  /**
  *
  * @function
  * @name set coordinates
  * @description Attribuer le point demandé
  * @param {Point} cd - Point demandé
  *
  */
  set coordinates (cd) {
    this._coordinates = cd;
  }

  /**
  *
  * @function
  * @name get points
  * @description Récupérer les points les plus proches du point demandé
  *
  */
  get points () {
    return this._points;
  }

  /**
  *
  * @function
  * @name set points
  * @description Attribuer les itinéraires
  * @param {table} ps - Ensemble des points les plus proches du point demandé 
  *
  */
  set points (ps) {
    this._points = ps;
  }

}
