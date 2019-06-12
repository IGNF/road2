'use strict';

const Resource = require('./resource');

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
    super(resourceJsonObject.resource.id,resourceJsonObject.resource.type, operations);

    // Stockage de la configuration
    this._configuration = resourceJsonObject.resource;

    // Correspondance entre profile/optimization et sourceId
    this._linkedSource = {};

    // Instanciation de la correspondance entre profile/optimization et sourceId
    // et instanciation du profile et de l'optimisation par défaut
    for (let i=0; i < this._configuration.sources.length; i++) {

      let linkedId = this._configuration.sources[i].cost.profile + this._configuration.sources[i].cost.optimization;
      this._linkedSource[linkedId] = this._configuration.sources[i].id;

    }

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

    if (this._linkedSource[request.profile+request.optimization]) {
      return this._linkedSource[request.profile+request.optimization];
    } else {
      return null;
    }

  }

}
