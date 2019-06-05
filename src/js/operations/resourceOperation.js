'use strict';

/**
*
* @class
* @name ResourceOperation
* @description Classe modélisant une opération pour une ressource.
*
*/

module.exports = class ResourceOperation  {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe ResourceOperation
  * @param {string} id - id de l'opération, unique au service
  * @param {object} resourceParameters - Objet de paramètres de l'opération
  *
  */
  constructor(id, resourceParameters) {

    // id
    this._serviceOperationId = id;

    // Paramètres de l'opération
    this._resourceParameters = resourceParameters;

  }

  /**
  *
  * @function
  * @name get serviceOperationId
  * @description Récupérer l'id de l'opération
  *
  */
  get serviceOperationId () {
    return this._serviceOperationId;
  }

  /**
  *
  * @function
  * @name get resourceParameters
  * @description Récupérer les paramètres de l'opération
  *
  */
  get resourceParameters () {
    return this._resourceParameters;
  }

  /**
  *
  * @function
  * @name getParameterById
  * @description Récupérer un paramètre si il est disponible sur la ressource
  *
  */
  getParameterById(parameterId) {
    if (this._resourceParameters[parameterId]) {
      return this._resourceParameters[parameterId];
    } else {
      return {};
    }
  }


}
