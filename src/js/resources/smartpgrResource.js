'use strict';

const Resource = require('./resource');
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
    this._distThreshold; // en metres
    this._timeThresholdCar; // en secondes
    this._timeThresholdPedestrian; // en secondes

    // Correspondance entre profile/optimization et sourceId
    this._linkedSource = {};

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
  * @name initResource
  * @description Créer les liens entre divers éléments d'une ressource et les sources associées
  * Ce traitement est placé ici car c'est la ressource qui sait quelle source est concernée par la requête.
  * @param {SourceManager} sourceManager - Manager des sources du service 
  * @return {boolean} 
  *
  */
   initResource (sourceManager) {

    // Seuils de switch entre les sources smartrouting et pgr 
    this._distThreshold = this._configuration.threshold; // en metres
    this._timeThresholdCar = (this._distThreshold / 130000) * 3600; // en secondes
    this._timeThresholdPedestrian = (this._distThreshold / 4000) * 3600; // en secondes
  
    // Instanciation de la correspondance entre profile/optimization et sourceId
    for (let i=0; i < this._configuration.sources.length; i++) {

      if (!sourceManager.isLoadedSourceAvailable(this._configuration.sources[i])) {

        LOGGER.error("La source n'a pas été chargée");
        return false;
        
      } else {

        LOGGER.debug("La source est bien disponible");

        let source = sourceManager.getSourceById(this._configuration.sources[i]);



        // on recupere l'id de l'unique source smartrouting
        if (source.type === 'smartrouting') {

          this._linkedSource['smartrouting'] = source.configuration.id;

        } else if (source.type === 'pgr') {

          for (let j = 0; j < source.configuration.costs.length; j++) {

            let linkedIdRoute = source.configuration.costs[j].profile + source.configuration.costs[j].optimization;
            let linkedIdIso = source.configuration.costs[j].profile + source.configuration.costs[j].costType;
            this._linkedSource[linkedIdRoute] = source.configuration.id;
            this._linkedSource[linkedIdIso] = source.configuration.id;

          }

        } else {

          // TODO : faire cette vérification aussi pendant le check de la ressource
          LOGGER.error("La source n'est pas de type 'pgr' ou 'smartrouting'");
          return false;

        }

      }

    }

    return true;
    
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

    let source = "";

    if (request.operation === "isochrone") {
      
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

    } else if (request.operation === "route") {

      // On décide de faire uniquement du PGR sur cette ressource dans le cas de l'iti
      source = request.profile + request.optimization;

    } else {
      return null;
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
  * @name checkSourceAvailibilityFromRequest
  * @description Savoir s'il y a une source disponible pour répondre à la requête. Par exemple, pour un itinéraire, il s'agira de savoir si un couple profile/optimization est disponible.
  * Ce traitement est placé ici car c'est la ressource qui sait quelle source est concernée par la requête.
  * @param {Request} request - Objet Request ou ou dérivant de la classe Request
  * @return {boolean} 
  *
  */
  checkSourceAvailibilityFromRequest (request) {

    let source = "";

    if (request.operation === "isochrone") {
      
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

    } else if (request.operation === "route") {

      // On décide de faire uniquement du PGR sur cette ressource dans le cas de l'iti
      source = request.profile + request.optimization;

    } else {
      return false;
    }

    if (this._linkedSource[source]) {
      return true;
    } else {
      return false;
    }

  }

}
