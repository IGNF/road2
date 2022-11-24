'use strict';

const Resource = require('./resource');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("OSRMRESOURCE");

/**
*
* @class
* @name osrmResource
* @description Classe modélisant une ressource OSRM.
*
*/

module.exports = class osrmResource extends Resource {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe osrmResource
  * @param {json} resourceJsonObject - Description JSON de la ressource
  * @param {object} operations - Objet contenant des instances de classes filles de ResourceOperation
  *
  */
  constructor(resourceJsonObject, operations) {

    // Constructeur parent
    super(resourceJsonObject.resource.id,resourceJsonObject.resource.type, resourceJsonObject.resource.resourceVersion, operations);

    // Stockage de la configuration
    this._configuration = resourceJsonObject.resource;

    // Correspondance entre profile/optimization et sourceId
    this._linkedSource = {};

    // Correspondance pour l'opération nearest
    // Il s'agit de l'id de la source utilisée pour l'opération nearest
    this._nearestSource = "";

    // Attribut des voies
    // Par défaut, OSRM ne renvoit que le nom des voies empruntées.
    this._waysAttributes = new Array();
    this._waysAttributes.push("name");

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
  * @name get waysAttributes
  * @description Récupérer la liste des attributs disponibles pour les voies empruntées.
  *
  */
  get waysAttributes () {
    return this._waysAttributes;
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

    // Instanciation de la correspondance entre profile/optimization et sourceId
    for (let i=0; i < this._configuration.sources.length; i++) {

      if (!sourceManager.isLoadedSourceAvailable(this._configuration.sources[i])) {
        LOGGER.error("La source n'a pas été chargée");
        return false;
      } else {

        LOGGER.debug("La source est bien disponible");

        let source = sourceManager.getSourceById(this._configuration.sources[i]);

        // TODO : faire cette vérification aussi pendant le check de la ressource
        if (source.type !== "osrm") {
          LOGGER.error("La source n'est pas de type 'osrm'");
          return false;
        }

        let linkedId = source.configuration.cost.profile + source.configuration.cost.optimization;
        this._linkedSource[linkedId] = source.configuration.id;

        if (i === 0) {
          // Gestion de nearest
          // on prend la première de la configuration 
          // TODO : à voir si on rend cela plus configurable
          this._nearestSource = source.configuration.id;
        }

      }

    }

    return true;

  }

  /**
  *
  * @function
  * @name isWayAttributeAvailable
  * @description Permet de savoir si un attribut est disponible pour cette ressource.
  * @param {string} attr - Attribut à vérifier
  *
  */
  isWayAttributeAvailable (attr) {

    if (this._waysAttributes.length !== 0) {
      for (let i=0; i < this._waysAttributes.length; i++) {
        if (this._waysAttributes[i] === attr) {
          return true;
        } else {
          // on continue
        }
      }
    } else {
      return false;
    }

    return false;
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

    if (request.operation === "nearest") {
      return this._nearestSource;
    } else {
      if (this._linkedSource[request.profile+request.optimization]) {
        return this._linkedSource[request.profile+request.optimization];
      } else {
        return null;
      }
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
    
    if (request.operation === "nearest") {
      // On utilise toujours la première source. Il y en a forcément une. 
      return true;
    } else if (request.operation === "route") {
      if (this._linkedSource[request.profile+request.optimization]) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

}
