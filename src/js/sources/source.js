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
  constructor(id, type) {

    // Id d'une source. Il doit être unique.
    this._id = id;

    // Type de la source
    this._type = type;

    // État de la connexion de la source
    this._connected = false;

    // Liste d'opérations possibles sur la source
    this._availableOperations = new Array();

  }

  /**
  *
  * @function
  * @name get id
  * @description Récupérer l'id de la source
  *
  */
  get id () {
    return this._id;
  }

  /**
  *
  * @function
  * @name getType
  * @description Récupérer le type de la source
  *
  */
  get type () {
    return this._type;
  }

  /**
  *
  * @function
  * @name getConnected
  * @description Récupérer l'état de connexion de la source
  *
  */
  get connected() {
    return this._connected;
  }

  /**
  *
  * @function
  * @name setConnected
  * @description Attribuer l'état de connexion de la source
  *
  */
  set connected (c) {
    this._connected = c;
  }

  /**
  *
  * @function
  * @name get availableOperations
  * @description Récupérer la liste des opérations possibles sur la source
  *
  */
  get availableOperations () {
    return this._availableOperations;
  }

  /**
  *
  * @function
  * @name isOperationAvailable
  * @description Savoir si une opération est disponible sur la source
  *
  */
  isOperationAvailable (operationId) {
    for (let i = 0; i < this._availableOperations.length; i++ ) {
      if (this._availableOperations[i] === operationId) {
        return true;
      }
    }
    return false;
  }

  /**
  *
  * @function
  * @name connect
  * @description Fonction pour utiliser pour connecter une source. Elle doit être ré-écrite dans chaque classe fille.
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */
  async connect() {
    this.connected = true;
    return true;
  }

  /**
  *
  * @function
  * @name disconnect
  * @description Fonction pour utiliser pour déconnecter une source. Elle doit être ré-écrite dans chaque classe fille.
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */
  async disconnect() {
    this.connected = false;
    return true;
  }

  /**
  *
  * @function
  * @name computeRequest
  * @description Traiter une requête.
  * Ce traitement est placé ici car c'est la source qui sait quel moteur est concernée par la requête.
  * Dans la classe actuelle, ce n'est que pour indiquer qu'il faut implémenter la fonction
  * dans chacune des classes filles.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @return {Promise}
  *
  */
  computeRequest (request) {

  }

}
