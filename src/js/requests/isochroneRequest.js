'use strict';

const Request = require('./request');

/**
*
* @class
* @name isochroneRequest
* @description Classe modélisant une requête d'isochrone.
* Chaque requête reçue par le service doit être transformée en requête de cette forme
* pour le proxy
*/

module.exports = class isochroneRequest extends Request {
  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe isochroneRequest
  * @param {string} resource - Ressource concernée
  *
  */
  constructor(resource) {

    // Constructeur parent
    super("isochrone", resource, "isochroneRequest");
  }

  /**
  *
  * @function
  * @name isAttributeRequested
  * @description Permet de savoir si un attribut est demandé dans cette requête.
  * @param {string} attr - Attribut
  *
  */
  isAttributeRequested (attr) {
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
}
