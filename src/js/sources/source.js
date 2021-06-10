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
  * @param {string} id - Identifiant de la source
  * @param {string} type - Type de la source
  * @param {Topology} topology - Topologie dont dérive la source (classe fille de topology)
  *
  */
  constructor(id, type, topology) {

    // Id d'une source. Il doit être unique.
    this._id = id;

    // Type de la source
    this._type = type;

    // État de la connexion de la source
    this._connected = false;

    // Liste d'opérations possibles sur la source
    this._availableOperations = new Array();

    // Topologie dont dérive la source
    this._topology = topology;

    // État de la source (même si connectée, elle peut être disfonctionnelle)
    // Peut être : "green" si la dernière requête a fonctionnée, "orange" si la source est connectée mais injoignable, "red" à l'initialisation ou si plus gros problème
    // Ajouter la gestion de ce paramètre dans chaque classe fille
    this._state = "red";

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
  * @param {boolean} conn - État de la connexion
  *
  */
  set connected (conn) {
    this._connected = conn;
  }

  /**
  *
  * @function
  * @name get state
  * @description Récupérer l'état de connexion de la source
  *
  */
   get state() {
    return this._state;
  }

  /**
  *
  * @function
  * @name set state
  * @description Attribuer l'état de connexion de la source
  * @param {string} st - État de la connexion
  *
  */
  set state (st) {
    this._state = st;
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
  * @name get topology
  * @description Récupérer la topologie de la source
  *
  */
  get topology () {
    return this._topology;
  }

  /**
  *
  * @function
  * @name isOperationAvailable
  * @description Savoir si une opération est disponible sur la source
  * @param {string} operationId - Id de l'opération
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
  *
  */
  async connect() {
    try {
      this.connected = true;
    } catch (err) {
      throw errorManager.createError("Cannot connect source");
    }
  }

  /**
  *
  * @function
  * @name isAvailable
  * @description Fonction utilisée pour tester l'état de la connexion d'une source. Elle peut être ré-écrite dans chaque classe fille si besoin.
  *
  */
  async isAvailable() {
    if (!this.connected) {
      return false;
    } else {
      return this.state;
    }
  }

  /**
  *
  * @function
  * @name disconnect
  * @description Fonction pour utiliser pour déconnecter une source. Elle doit être ré-écrite dans chaque classe fille.
  *
  */
  async disconnect() {
    this.connected = false;
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
