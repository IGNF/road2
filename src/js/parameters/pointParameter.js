'use strict';

const ResourceParameter = require('../parameters/resourceParameter');
const Point = require('../geometry/point');

/**
*
* @class
* @name PointParameter
* @description Classe modélisant un paramètre de type point, dans une opération.
*
*/

module.exports = class PointParameter extends ResourceParameter {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe PointParameter
  * @param {object} parameter - Référence au paramètre de service
  *
  */
  constructor(parameter) {

    // id
    super(parameter);

    // Bbox
    this._bbox = "";

    // Projection
    this._projection = "";

  }

  /**
  *
  * @function
  * @name get defaultValueContent
  * @description Récupérer la valeur par défaut
  *
  */
  get defaultValueContent () {
    return "";
  }

  /**
  *
  * @function
  * @name get values
  * @description Récupérer l'ensemble des valeurs par défaut
  *
  */
  get values () {
    return {"bbox": this._bbox};
  }

  /**
  *
  * @function
  * @name load
  * @description Charger la configuration
  * @param {string} parameterConf - Configuration d'un paramètre
  * @return {boolean}
  *
  */
  load(parameterConf) {

    this._bbox = parameterConf.values.bbox;

    this._projection = parameterConf.values.projection;

    return true;

  }

  /**
  *
  * @function
  * @name specificCheck
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @return {boolean}
  *
  */
  specificCheck(userValue) {

    if (typeof userValue !== "string") {
      return false;
    }

    let tmpStringCoordinates = userValue.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)/g);

    if (!tmpStringCoordinates) {
      return false;
    } else {
      // TODO: vérification de l'inclusion des coordonnées dans la bbox de la ressource
    }

    return true;
  }

  /**
  *
  * @function
  * @name specificConvertion
  * @description Convertir une valeur dans un format adapté aux requêtes
  * @param {string} userValue - Valeur à vérifier
  * @param {string} projection - Projection dans laquelle sont exprimées les coordonnées
  * @return {object}
  *
  */
  specificConvertion(userValue, projection) {

    let finalValue = {};

    let tmpStringCoordinates = userValue.split(",");
    finalValue = new Point(Number(tmpStringCoordinates[0]), Number(tmpStringCoordinates[1]), projection);

    return finalValue;

  }


}
