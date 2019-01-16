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


}
