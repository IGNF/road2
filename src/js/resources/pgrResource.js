'use strict';

const Resource = require('./resource');

// Création du LOGGER
const log4js = require('log4js');
var LOGGER = log4js.getLogger("SERVICE");

/**
*
* @class
* @name pgrResource
* @description Classe modélisant une ressource pgRouting.
*
*/

module.exports = class pgrResource extends Resource {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe pgrResource
  * @param {json} resourceJsonObject - Description JSON de la ressource
  * @param {object} operations - Objet contenant des instances de classes filles de ResourceOperation
  *
  */
  constructor(resourceJsonObject, operations) {

    // Constructeur parent
    super(resourceJsonObject.resource.id,resourceJsonObject.resource.type, operations);

    // Stockage de la configuration
    this._configuration = resourceJsonObject.resource;

    // Correspondance entre profile/optimization et sourceId
    this._linkedSource = {};

    // Instanciation de la correspondance entre profile/optimization et sourceId
    // et instanciation du profile et de l'optimisation par défaut
    for (let i=0; i < this._configuration.sources.length; i++) {

      /* TODO: Il serait mieux, dans le futur, d'avoir un nouveau type de ressource, dédiée à l'isochrone. */
      const currentSourceOptimization = this._configuration.sources[i].cost.optimization;

      let linkedId = '';
      if (operations["isochrone"]) {
        if (currentSourceOptimization === "fastest") {
          linkedId = this._configuration.sources[i].cost.profile + "time";
        } else if (currentSourceOptimization === "shortest") {
          linkedId = this._configuration.sources[i].cost.profile + "distance";
        } else {
          /* TODO: À repenser. */
        }

        this._linkedSource[linkedId] = this._configuration.sources[i].id;
      } else if (operations["route"]) {
        linkedId = this._configuration.sources[i].cost.profile + this._configuration.sources[i].cost.optimization;

        this._linkedSource[linkedId] = this._configuration.sources[i].id;
      } else {
        /* TODO: À repenser. */
      }

    }

  }

  /**
  *
  * @function
  * @name get configuration
  * @description Récupérer la configuration de la ressource
  *
  */
  get configuration () {
    return this._configuration;
  }

  /**
  *
  * @function
  * @name get linkedSource
  * @description Récupérer la correspondance entre profile/optimization et sourceId de la ressource
  *
  */
  get linkedSource () {
    return this._linkedSource;
  }

  /**
  *
  * @function
  * @name set linkedSource
  * @description Attribuer la correspondance entre profile/optimization et sourceId de la ressource
  *
  */
  set linkedSource (ls) {
    this._linkedSource = ls;
  }

  /**
  *
  * @function
  * @name getSourceIdFromRequest
  * @description Récupérer l'id de la source concernée par la requête.
  * Ce traitement est placé ici car c'est la ressource qui sait quelle source est concernée par la requête.
  * @param {Request} request - Objet Request ou ou dérivant de la classe Request
  * @return {string} Id de la source concernée par la requête
  *
  */
  getSourceIdFromRequest (request) {

    const currentOperation = request.operation;
    let source = "";

    /* TODO: Pour le moment, c'est un contrôle en dur sur le type de l'opération. Il serait mieux de revoir cette façon de voir (avoir peut-être un catalogue de correspondance ? Maybe..). */
    if (currentOperation === "isochrone") {
      source = request.profile + request.costType;
    } else {
      source = request.profile + request.optimization;
    }

    if (this._linkedSource[source]) {
      return this._linkedSource[source];
    } else {
      return null;
    }

  }

}
