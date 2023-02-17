'use strict';

/**
*
* @class
* @name healthResponse
* @description Classe modélisant une réponse de l'état du serveur (health).
*
*/

module.exports = class healthResponse {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe healthResponse
  *
  */
  constructor() {

    // État global 
    this._globalState = "unknown";

    // État de l'administrateur
    this._adminState = "unknown";

    // États des services 
    // Un administrateur peut n'avoir aucun service 
    this._serviceStates = [];

  }

  /**
  *
  * @function
  * @name get globalState
  * @description Récupérer le globalState 
  *
  */
   get globalState () {
    return this._globalState;
  }

  /**
  *
  * @function
  * @name set globalState
  * @description Attribuer le globalState
  * @param {string} st - État
  *
  */
  set globalState (st) {
    this._globalState = st;
  }

  /**
  *
  * @function
  * @name get adminState
  * @description Récupérer le adminState 
  *
  */
   get adminState () {
    return this._adminState;
  }

  /**
  *
  * @function
  * @name set adminState
  * @description Attribuer le adminState
  * @param {string} st - État
  *
  */
  set adminState (st) {
    this._adminState = st;
  }

  /**
  *
  * @function
  * @name get serviceStates
  * @description Récupérer le serviceStates 
  *
  */
   get serviceStates () {
    return this._serviceStates;
  }

  /**
  *
  * @function
  * @name set serviceStates
  * @description Attribuer le serviceStates
  * @param {Array} st - États des services 
  *
  */
  set serviceStates (st) {
    this._serviceStates = st;
  }

}
