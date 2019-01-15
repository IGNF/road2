'use strict';

/**
*
* @class
* @name Source
* @description Classe modélisant une source.
*
*/

module.exports = class Source {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe source
  *
  */
    constructor(id,type) {
      // Id d'une source. Il doit être unique.
      this.id = id;

      // Type de la source
      this.type = type;

    }

    /**
    *
    * @function
    * @name getId
    * @description Récupérer l'id de la source
    *
    */
      getId() {
        return this.id;
      }

      /**
      *
      * @function
      * @name getType
      * @description Récupérer le type de la source
      *
      */
        getType() {
          return this.type;
        }


}
