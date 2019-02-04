'use strict';

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
  *
  */
  constructor(id,type) {
    // Id d'une ressource. Il doit être unique.
    this._id = id;

    // Type de la ressource
    this._type = type;

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
  * @name getSourceFromRequest
  * @description Récupérer l'id de la source concernée par la requête.
  * Ce traitement est placé ici car c'est la ressource qui sait quelle source est concernée par la requête.
  * Dans la classe actuelle, ce n'est que pour indiquer qu'il faut implémenter la fonction
  * dans chacune des classes filles.
  * @param {Request} request - Objet Request ou ou dérivant de la classe Request
  * @return {string} Id de la source concernée par la requête 
  *
  */
  getSourceIdFromRequest (request) {
    var sourceId = "";
    return sourceId;
  }


}
