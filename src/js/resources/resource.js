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
      this.id = id;

      // Type de la ressource
      this.type = type;

    }

    /**
    *
    * @function
    * @name getId
    * @description Récupérer l'id de la resource
    *
    */
      getId() {
        return this.id;
      }

      /**
      *
      * @function
      * @name getType
      * @description Récupérer le type de la resource
      *
      */
        getType() {
          return this.type;
        }


}
