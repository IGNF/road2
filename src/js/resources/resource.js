'use strict';

const log4js = require('log4js');

var LOGGER = log4js.getLogger("RESOURCE");

/**
*
* @class
* @name Resource
* @description Classe modélisant une ressource.
*
*/

module.exports = class Resource {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Resource
  * @param {string} id - Id de la ressource
  * @param {string} type - Type de la ressource
  * @param {string} version - Version de la ressource
  * @param {object} operations - Objet contenant les opérations disponibles sur la ressource (classes ResourceOperation)
  *
  */
  constructor(id, type, version, operations) {
    // Id d'une ressource. Il doit être unique.
    this._id = id;

    // Type de la ressource
    this._type = type;

    // Version de la ressource 
    this._version = version;

    // Opérations disponibles sur la ressource
    this._operations = operations;

  }

  /**
  *
  * @function
  * @name get id
  * @description Récupérer l'id de la resource
  *
  */
  get id () {
    return this._id;
  }

  /**
  *
  * @function
  * @name get type
  * @description Récupérer le type de la resource
  *
  */
  get type () {
    return this._type;
  }

  /**
  *
  * @function
  * @name get version
  * @description Récupérer la version de la resource
  *
  */
  get version () {
    return this._version;
  }

  /**
  *
  * @function
  * @name get operation
  * @description Récupérer les opérations de la resource
  *
  */
  get operations () {
    return this._operations;
  }

  /**
  *
  * @function
  * @name getSourceIdFromRequest
  * @description Récupérer l'id de la source concernée par la requête.
  * Ce traitement est placé ici car c'est la ressource qui sait quelle source est concernée par la requête.
  * Dans la classe actuelle, ce n'est que pour indiquer qu'il faut implémenter la fonction
  * dans chacune des classes filles.
  * @param {Request} request - Objet Request ou ou dérivant de la classe Request
  * @return {string} Id de la source concernée par la requête
  *
  */
  getSourceIdFromRequest (request) {
    let sourceId = "";
    LOGGER.debug(request.toString());
    return sourceId;
  }

  /**
  *
  * @function
  * @name checkSourceAvailibilityFromRequest
  * @description Savoir s'il y a une source disponible pour répondre à la requête. Par exemple, pour un itinéraire, il s'agira de savoir si un couple profile/optimization est disponible.
  * Ce traitement est placé ici car c'est la ressource qui sait quelle source est concernée par la requête.
  * Dans la classe actuelle, ce n'est que pour indiquer qu'il faut implémenter la fonction
  * dans chacune des classes filles.
  * @param {Request} request - Objet Request ou ou dérivant de la classe Request
  * @return {boolean} 
  *
  */
   checkSourceAvailibilityFromRequest (request) {
    LOGGER.debug(request.toString());
    return false;
  }

  /**
  *
  * @function
  * @name initResource
  * @description Créer les liens entre divers éléments d'une ressource et les sources associées
  * Ce traitement est placé ici car c'est la ressource qui sait quelle source est concernée par la requête.
  * Dans la classe actuelle, ce n'est que pour indiquer qu'il faut implémenter la fonction
  * dans chacune des classes filles.
  * @param {SourceManager} sourceManager - Manager des sources du service 
  * @return {boolean} 
  *
  */
   initResource (sourceManager) {
    LOGGER.debug(sourceManager.toString());
    return false;
  }

  /**
  *
  * @function
  * @name verifyAvailabilityOperation
  * @description Savoir si une opération est disponible sur la ressource
  * @param {string} id - Id de l'opération
  * @return {boolean}
  *
  */
  verifyAvailabilityOperation(operationId) {
    if (this._operations[operationId]) {
      return true;
    } else {
      return false;
    }
  }

  /**
  *
  * @function
  * @name getOperationById
  * @description Récupérer une opération si elle est disponible sur la ressource
  * @param {string} id - Id de l'opération
  * @return {object} Instance de l'opération de ressource (ResourceOperation)
  *
  */
  getOperationById(operationId) {
    if (this._operations[operationId]) {
      return this._operations[operationId];
    } else {
      return {};
    }
  }


}
