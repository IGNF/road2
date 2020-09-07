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
  * @param {string} direction - Sens du parcours.
  * @param {string} askedProjection - Projection souhaitée.
  * @param {string} geometryFormat - Format souhaitée pour la géométrie en sortie.
  * @param {string} timeUnit - Unité de temps utilisée pour le calcul.
  *
  */
  constructor(
    resource,
    point,
    costType,
    costValue,
    profile,
    direction,
    askedProjection,
    geometryFormat,
    timeUnit
  ) {

    // Constructeur parent
    super("isochrone", resource, "isochroneRequest");

    /* Initialisation du reste des paramètres. */
    this._point = point;
    this._costType = costType;
    this._costValue = costValue;
    this._profile = profile;
    this._direction = direction;
    this._askedProjection = askedProjection;
    this._geometryFormat = geometryFormat;
    this._timeUnit = timeUnit;

    // Gestion des contraintes 
    this._constraints = new Array();

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
  * @name get askedProjection
  * @description Récupérer la projection souhaitée.
  *
  */
  get askedProjection() {
    return this._askedProjection;
  }

  /**
  *
  * @function
  * @name set askedProjection
  * @description Attribuer la projection souhaitée.
  * @param {object} prjct - Projection souhaitée.
  *
  */
  set askedProjection(prjct) {
    this._askedProjection = prjct;
  }

  /**
  *
  * @function
  * @name get geometryFormat
  * @description Récupérer le format de la géométrie en sortie.
  *
  */
  get geometryFormat() {
    return this._geometryFormat;
  }

  /**
  *
  * @function
  * @name set geometryFormat
  * @description Attribuer le format de la géométrie en sortie.
  * @param {object} gmtrfm - Format de la géométrie en sortie.
  *
  */
  set geometryFormat(gmtrfm) {
    this._geometryFormat = gmtrfm;
  }

  /**
  *
  * @function
  * @name get timeUnit
  * @description Récupérer l'unité de temps.
  *
  */
  get timeUnit() {
    return this._timeUnit;
  }

  /**
  *
  * @function
  * @name set timeUnit
  * @description Attribuer l'unité de temps.
  * @param {object} tu - Unité de temps.
  *
  */
  set timeUnit(tu) {
    this._timeUnit = tu;
  }

  /**
  *
  * @function
  * @name get constraints
  * @description Récupérer les contraintes
  *
  */
  get constraints () {
    return this._constraints;
  }

  /**
  *
  * @function
  * @name set constraints
  * @description Attribuer les contraintes
  *
  */
  set constraints (i) {
    this._constraints = i;
  }


}
