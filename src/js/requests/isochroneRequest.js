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
  * @param {string} resource - Ressource.
  * @param {string} point - Point de départ.
  * @param {string} costType - Type du coût.
  * @param {string} costValue - Valeur du coût.
  * @param {string} profile - Profil utilisé pour le calcul.
  * @param {string} optimization - Optimisation utilisée pour le calcul.
  * @param {string} direction - Sens du parcours.
  *
  */
  constructor(resource, point, costType, costValue, profile, optimization, direction) {

    // Constructeur parent
    super("isochrone", resource, "isochroneRequest");

    /* Initialisation du reste des paramètres. */
    this._point = point;
    this._costType = costType;
    this._costValue = costValue;
    this._profile = profile;
    this._optimization = optimization;
    this._direction = direction;
  }

  /**
  *
  * @function
  * @name get point
  * @description Récupérer le point de départ de la requête
  *
  */
  get point() {
    return this._point;
  }

  /**
  *
  * @function
  * @name set point
  * @description Attribuer le point de départ de la requête.
  * @param {object} pt - Point de départ.
  *
  */
  set point(pt) {
    this._point = pt;
  }

  /**
  *
  * @function
  * @name get costType
  * @description Récupérer le type du coût de la requête.
  *
  */
  get costType() {
    return this._costType;
  }

  /**
  *
  * @function
  * @name set costType
  * @description Attribuer le type du coût de la requête.
  * @param {object} ct - Type du coût.
  *
  */
  set costType(ct) {
    this._costType = ct;
  }

  /**
  *
  * @function
  * @name get costValue
  * @description Récupérer la valeur du coût de la requête.
  *
  */
  get costValue() {
    return this._costValue;
  }

  /**
  *
  * @function
  * @name set costValue
  * @description Attribuer la valeur du coût de la requête.
  * @param {object} cv - Valeur du coût.
  *
  */
  set costValue(cv) {
    this._costValue = cv;
  }

    /**
  *
  * @function
  * @name get profile
  * @description Récupérer le profil utilisé pour le calcul de la requête.
  *
  */
  get profile() {
    return this._profile;
  }

  /**
  *
  * @function
  * @name set profile
  * @description Attribuer le profil utilisé pour le calcul de la requête
  * @param {object} pf - Profil utilisé pour le calcul.
  *
  */
  set profile(pf) {
    this._profile = pf;
  }

    /**
  *
  * @function
  * @name get optimization
  * @description Récupérer l'optimisation utilisée pour le calcul de la requête.
  *
  */
  get optimization() {
    return this._optimization;
  }

  /**
  *
  * @function
  * @name set optimization
  * @description Attribuer l'optimisation utilisée pour le calcul de la requête.
  * @param {object} op - Optimisation utilisée pour le calcul.
  *
  */
  set optimization(op) {
    this._optimization = op;
  }

    /**
  *
  * @function
  * @name get direction
  * @description Récupérer le sens du parcours de la requête.
  *
  */
  get direction() {
    return this._direction;
  }

  /**
  *
  * @function
  * @name set direction
  * @description Attribuer le sens du parcours de la requête.
  * @param {object} dr - Sens du parcours.
  *
  */
  set direction(dr) {
    this._direction = dr;
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
