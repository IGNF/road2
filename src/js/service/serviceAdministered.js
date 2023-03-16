'use strict';

/**
*
* @class
* @name ServiceAdministered
* @description Classe modélisant une service administré par l'administrateur. C'est une classe mère dérivée par serviceProcess
* @param {string} id - Identifiant du service administré
* @param {string} type - Type de service administré
*
*/

module.exports = class ServiceAdministered {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe ServiceAdministered
  * @param {string} id - id du service
  * @param {string} type - Type du service, parmi 'newProcess' pour le moment
  * 
  */
  constructor(id, type) {

    // Id d'une ressource. Il doit être unique.
    this._id = id;

    // Type de la ressource
    this._type = type;

  }

  /**
  *
  * @function
  * @name get id
  * @description Récupérer l'id du service administré
  *
  */
  get id () {
    return this._id;
  }

  /**
  *
  * @function
  * @name get type
  * @description Récupérer le type du service administré
  *
  */
  get type () {
    return this._type;
  }

  /**
  *
  * @function
  * @name loadService
  * @description Fonction pour utiliser pour charger un service selon le mode adaptée à la classe fille. Elle doit être ré-écrite dans chaque classe fille.
  *
  */
  loadService() {
    
  }

    /**
  *
  * @function
  * @name stopService
  * @description Fonction pour arrêter un service selon le mode adaptée à la classe fille. Elle doit être ré-écrite dans chaque classe fille.
  *
  */
  stopService() {
    
  }

  /**
  *
  * @function
  * @name computeRequest
  * @description Fonction pour utiliser pour envoyer une requête à un service selon le mode adaptée à la classe fille. Elle doit être ré-écrite dans chaque classe fille.
  *
  */
   computeRequest() {
    
  }


}
