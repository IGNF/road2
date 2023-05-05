'use strict';

const Request = require('./request');

/**
*
* @class
* @name routeRequest
* @description Classe modélisant une requête d'itinéraire.
* Chaque requête reçue par le service doit être transformée en requête de cette forme
* pour le proxy
*/

module.exports = class routeRequest extends Request {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe routeRequest
  * @param {string} resource - Ressource concernée
  * @param {Point} start - Point de départ concerné
  * @param {Point} end - Point d'arrivée concerné
  * @param {string} profile - Profile concerné
  * @param {string} optimization - Optimisation concernée
  *
  */
  constructor(resource, start, end, profile, optimization) {

    // Constructeur parent
    super("route", "routeRequest");

    // Ressource concernée
    this._resource = resource;

    // Point de départ
    this._start = start;

    // Point d'arrivée
    this._end = end;

    // Profile
    this._profile = profile;

    // Optimisation
    this._optimization = optimization;

    // Intermediates
    // Tableau contenant des instances de Point
    this._intermediates = new Array();

    // computeSteps
    this._computeSteps = true;

    // waysAttributes
    // tableau de string
    this._waysAttributes = new Array();

    // geometryFormat
    // type des géométries demandé
    this._geometryFormat = "geojson";

    // bbox
    this._bbox = true;

    // timeUnit
    this._timeUnit = "minute";

    // distanceUnit
    this._distanceUnit = "meter";

    // Constraints
    // Tableau contenant des instances de Constraint
    this._constraints = new Array();

  }

  /**
  *
  * @function
  * @name get resource
  * @description Récupérer la ressource de la requête
  *
  */
   get resource () {
    return this._resource;
  }

  /**
  *
  * @function
  * @name set resource
  * @description Attribuer la ressource de la requête
  * @param {string} res - Id de la ressource
  *
  */
  set resource (res) {
    this._resource = res;
  }

  /**
  *
  * @function
  * @name get start
  * @description Récupérer le point de départ de la requête
  *
  */
  get start () {
    return this._start;
  }

  /**
  *
  * @function
  * @name set start
  * @description Attribuer le point de départ de la requête
  * @param {Point} st - Point de départ concerné
  *
  */
  set start (st) {
    this._start = st;
  }

  /**
  *
  * @function
  * @name get end
  * @description Récupérer le point d'arrivée de la requête
  *
  */
  get end () {
    return this._end;
  }

  /**
  *
  * @function
  * @name set end
  * @description Attribuer le point d'arrivée de la requête
  * @param {Point} en - Point d'arrivée concerné
  *
  */
  set end (en) {
    this._end = en;
  }

  /**
  *
  * @function
  * @name get profile
  * @description Récupérer le profile de la requête
  *
  */
  get profile () {
    return this._profile;
  }

  /**
  *
  * @function
  * @name set profile
  * @description Attribuer le profile de la requête
  * @param {string} pr - Profile
  *
  */
  set profile (pr) {
    this._profile = pr;
  }

  /**
  *
  * @function
  * @name get optmization
  * @description Récupérer l'optmisation de la requête
  *
  */
  get optimization () {
    return this._optimization;
  }

  /**
  *
  * @function
  * @name set optmization
  * @description Attribuer l'optmisation de la requête
  * @param {string} op - Optimisation
  *
  */
  set optimization (op) {
    this._optimization = op;
  }

  /**
  *
  * @function
  * @name get intermediates
  * @description Récupérer les points intermédiaires de la requête
  *
  */
  get intermediates () {
    return this._intermediates;
  }

  /**
  *
  * @function
  * @name set intermediates
  * @description Attribuer les points intermédiaires de la requête
  * @param {table} i - Tableau de Point
  *
  */
  set intermediates (i) {
    this._intermediates = i;
  }

  /**
  *
  * @function
  * @name get computeSteps
  * @description Récupérer le choix de l'affichage des étapes
  *
  */
  get computeSteps () {
    return this._computeSteps;
  }

  /**
  *
  * @function
  * @name set computeSteps
  * @description Attribuer le choix de l'affichage des étapes
  * @param {boolean} i - computeSteps
  *
  */
  set computeSteps (i) {
    this._computeSteps = i;
  }

  /**
  *
  * @function
  * @name get bbox
  * @description Récupérer le choix de l'affichage de la bbox
  *
  */
  get bbox () {
    return this._bbox;
  }

  /**
  *
  * @function
  * @name set bbox
  * @description Attribuer le choix de l'affichage de la bbox
  * @param {boolean} i - bbox
  *
  */
  set bbox (i) {
    this._bbox = i;
  }

  /**
  *
  * @function
  * @name get geometryFormat
  * @description Récupérer le choix du type de geometries
  *
  */
  get geometryFormat () {
    return this._geometryFormat;
  }

  /**
  *
  * @function
  * @name set geometryFormat
  * @description Attribuer le choix du type de geometries
  *
  */
  set geometryFormat (i) {
    this._geometryFormat = i;
  }


  /**
  *
  * @function
  * @name get waysAttributes
  * @description Récupérer la liste des attributs disponibles pour les voies empruntées.
  *
  */
  get waysAttributes () {
    return this._waysAttributes;
  }

  /**
  *
  * @function
  * @name set waysAttributes
  * @description Attribuer la liste des attributs disponibles pour les voies empruntées.
  *
  */
   set waysAttributes (wa) {
    this._waysAttributes = wa;
  }

  /**
  *
  * @function
  * @name get timeUnit
  * @description Récupérer l'unité des durées 
  *
  */
  get timeUnit () {
    return this._timeUnit;
  }

  /**
  *
  * @function
  * @name set timeUnit
  * @description Attribuer l'unité des durées 
  *
  */
  set timeUnit (i) {
    this._timeUnit = i;
  }

  /**
  *
  * @function
  * @name get distanceUnit
  * @description Récupérer l'unité des distances 
  *
  */
  get distanceUnit () {
    return this._distanceUnit;
  }

  /**
  *
  * @function
  * @name set distanceUnit
  * @description Attribuer l'unité des distances 
  *
  */
  set distanceUnit (i) {
    this._distanceUnit = i;
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
