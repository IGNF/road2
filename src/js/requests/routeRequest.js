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
  * @param {object} start - Point de départ concerné (ex. {lon: 8.732901, lat: 41.928821})
  * @param {object} end - Point d'arrivée concerné (ex. {lon: 8.732901, lat: 41.953932})
  * @param {string} profile - Profile concerné
  * @param {string} optimization - Optimisation concernée
  *
  */
  constructor(resource, start, end, profile, optimization) {

    // Constructeur parent
    super("route", resource, "routeRequest");

    // Point de départ
    // (ex. {lon: 8.732901, lat: 41.928821})
    this._start = start;

    // Point d'arrivée
    // (ex. {lon: 8.732901, lat: 41.953932})
    this._end = end;

    // Profile
    this._profile = profile;

    // Optimisation
    this._optimization = optimization;

    // Intermediates
    // (ex. [{lon: 8.732901, lat: 41.953932}, {lon: 8.732901, lat: 41.928821}])
    this._intermediates = new Array();

    // computeGeometry
    this._computeGeometry = true;

    // waysAttributes
    // tableau de string
    this._waysAttributes = new Array();

    // algorith
    // algorithme utilisé
    this._algorithm = "";

    // geometries_type
    // type des géométries demandé
    this._geometries_type = "geojson"

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
  * @param {object} st - Point de départ concerné (ex. {lon: 8.732901, lat: 41.928821})
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
  * @param {object} en - Point d'arrivée concerné (ex. {lon: 8.732901, lat: 41.953932})
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
  * @param {table} i - Tableau de points (ex. [{lon: 8.732901, lat: 41.953932},{lon: 8.732902, lat: 41.953930}])
  *
  */
  set intermediates (i) {
    this._intermediates = i;
  }

  /**
  *
  * @function
  * @name get computeGeometry
  * @description Récupérer le choix de l'affichage de la géoémtrie
  *
  */
  get computeGeometry () {
    return this._computeGeometry;
  }

  /**
  *
  * @function
  * @name set computeGeometry
  * @description Attribuer le choix de l'affichage de la géoémtrie
  * @param {boolean} i - computeGeometry
  *
  */
  set computeGeometry (i) {
    this._computeGeometry = i;
  }

  /**
  *
  * @function
  * @name get algorithm
  * @description Récupérer le choix de l'algorithme
  *
  */
  get algorithm () {
    return this._algorithm;
  }

  /**
  *
  * @function
  * @name set algorithm
  * @description Attribuer le choix de l'algorithme
  *
  */
  set algorithm (i) {
    this._algorithm = i;
  }

  /**
  *
  * @function
  * @name get geometries_type
  * @description Récupérer le choix du type de geometries
  *
  */
  get geometries_type () {
    return this._geometries_type;
  }

  /**
  *
  * @function
  * @name set geometries_type
  * @description Attribuer le choix du type de geometries
  *
  */
  set geometries_type (i) {
    this._geometries_type = i;
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
