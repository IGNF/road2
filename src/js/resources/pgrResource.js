'use strict';

const Resource = require('./resource');

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

    // stockage des attributs par défaut
    this._defaultAttributes = new Array();

    // stockage des attributs restants et disponibles
    this._otherAttributes = new Array();

    // Correspondance entre profile/optimization et sourceId
    this._linkedSource = {};

    // Instanciation de la correspondance entre profile/optimization et sourceId
    // et instanciation du profile et de l'optimisation par défaut
    for (let i=0; i < this._configuration.sources.length; i++) {

      const linkedId = this._configuration.sources[i].cost.profile + this._configuration.sources[i].cost.optimization;
      this._linkedSource[linkedId] = this._configuration.sources[i].id;

    }

    // Instanciation des attributs
    for (let i = 0; i < this._configuration.topology.attributes.length; i++) {
      let curAttribute = this._configuration.topology.attributes[i];

      if (curAttribute.default === "true") {
        this._defaultAttributes.push(curAttribute);
      } else if (curAttribute.default === "false") {
        this._otherAttributes.push(curAttribute);
      } else {
        // cela ne doit pas arriver
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
  * @name get defaultAttributes
  * @description Récupérer les attributs par défaut de la ressource
  *
  */
  get defaultAttributes () {
    return this._defaultAttributes;
  }

  /**
  *
  * @function
  * @name get otherAttributes
  * @description Récupérer les attributs facultatifs de la ressource
  *
  */
  get otherAttributes () {
    return this._otherAttributes;
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
