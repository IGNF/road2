'use strict';

const Resource = require('./resource');
const Duration = require('../time/duration');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("SMARTPGRRESOURCE");

/**
*
* @class
* @name pgrResource
* @description Classe modélisant une ressource pgRouting.
*
*/

module.exports = class smartpgrResource extends Resource {


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
    super(resourceJsonObject.resource.id,resourceJsonObject.resource.type, resourceJsonObject.resource.resourceVersion, operations);

    // Stockage de la configuration
    this._configuration = resourceJsonObject.resource;

    // Seuils de switch entre les sources smartrouting et pgr 
    this._distThreshold = this._configuration.threshold; // en metres
    this._timeThresholdCar = (this._distThreshold / 130000) * 3600; // en secondes
    this._timeThresholdPedestrian = (this._distThreshold / 4000) * 3600; // en secondes

    // Correspondance entre profile/optimization et sourceId
    this._linkedSource = {};

    // Instanciation de la correspondance entre profile/optimization et sourceId
    // et instanciation du profile et de l'optimisation par défaut
    for (let i=0; i < this._configuration.sources.length; i++) {

      // on recupere l'id de l'unique source smartrouting
      if (this._configuration.sources[i].type === 'smartrouting') {
        this._linkedSource['smartrouting'] = this._configuration.sources[i].id;
        continue;
      }

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
      }
      if (operations["route"]) {
        linkedId = this._configuration.sources[i].cost.profile + this._configuration.sources[i].cost.optimization;

        this._linkedSource[linkedId] = this._configuration.sources[i].id;
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

    /*TODO: Pour le moment, c'est un contrôle en dur sur le type de l'opération. Il serait mieux de revoir cette façon de voir (avoir peut-être un catalogue de correspondance ? Maybe..). */
    if (currentOperation === "isochrone") {
      
      let useSmartrouting = false;
      if (request.costType === 'distance') {
        // Note costValue est déjà en metres
        useSmartrouting = request.costValue > this._distThreshold;
      } else if (request.costType === 'time') {
        // Note costValue est déjà en secondes
        if (request.profile === 'car') {
          useSmartrouting = request.costValue > this._timeThresholdCar
        } else if (request.profile === 'pedestrian') {
          useSmartrouting = request.costValue > this._timeThresholdPedestrian
        }
      }
      
      if (useSmartrouting) {
        source = 'smartrouting';
      } else {
        source = request.profile + request.costType;
      }
    } else {
      source = request.profile + request.optimization;
    }

    if (this._linkedSource[source]) {
      return this._linkedSource[source];
    } else {
      return null;
    }

  }

  /**
  *
  * @function
  * @name removeSource
  * @description Supprimer les references à une source au sein de la ressource
  * @param {string} sourceId - Id de la source 
  * @return {boolean} 
  *
  */
  removeSource (sourceId) {

    let keysToDelete = new Array();
    for (const key in this._linkedSource) {
      if (this._linkedSource[key] === sourceId) {
        keysToDelete.push(key);
      }
    }
    if(keysToDelete.length !== 0) {
      for (let i = 0; i < keysToDelete.length; i++) {
        delete this._linkedSource[keysToDelete[i]];
      }
    }
    
    return true;
  }

}
