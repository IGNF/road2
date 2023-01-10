'use strict';

const log4js = require('log4js');
const ResourceParameter = require('../parameters/resourceParameter');
const Point = require('../geometry/point');
const errorManager = require('../utils/errorManager');
const validationManager = require('../utils/validationManager');

var LOGGER = log4js.getLogger("POINTPARAM");


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

    // Paramètre de service
    super(parameter);

    // Bbox
    this._bbox = "";

    // Projection
    this._projection = "";

    // Xmin de la bbox
    this._xmin;

    // Ymin de la bbox
    this._ymin;

    // Xmax de la bbox
    this._xmax;

    // Ymax de la bbox
    this._ymax;

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

    try {
      let splitBbox = this._bbox.split(",");
      this._xmin = Number(splitBbox[0]);
      this._ymin = Number(splitBbox[1]);
      this._xmax = Number(splitBbox[2]);
      this._ymax = Number(splitBbox[3]);
    } catch(err) {
      LOGGER.error("Erreur durant la lecture de la bbox:");
      LOGGER.error(err);
      return false;
    }

    if (this._xmin >= this._xmax) {
      LOGGER.error("BBox incorrecte en X");
      return false;
    }

    if (this._ymin >= this._ymax) {
      LOGGER.error("BBox incorrecte en Y");
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name specificCheck
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @param {string} userProjection - Projection dans laquelle sont exprimées les coordonnées de l'utilisateur
  * @return {object} result.code - "ok" si tout s'est bien passé et "error" sinon
  *                  result.message - "" si tout s'est bien passé et la raison de l'erreur sinon
  *
  */
  specificCheck(userValue, userProjection) {

    LOGGER.debug("specificCheck()");

    if (typeof userValue !== "string") {
      return errorManager.createErrorMessage("user value is NOT a string");
    } else {
      LOGGER.debug("user value is a string");
    }

    let tmpStringCoordinates = userValue.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/g);

    if (!tmpStringCoordinates) {
      return errorManager.createErrorMessage("user value is NOT like 'float,float'");
    } else {

      LOGGER.debug("user value is a well formated");

      // Vérification de l'inclusion des coordonnées dans la bbox de la ressource
      let userPoint = this.specificConvertion(userValue, userProjection);

      if (this._projection !== userProjection) {

        LOGGER.debug("user value need to be transformed from " + userProjection + " to " + this._projection);

        if (!userPoint.transform(this._projection)) {
          return errorManager.createErrorMessage("user value can't be transformed from " + userProjection + " to " + this._projection);
        } else {
          LOGGER.debug("user value has been well transformed");
        }

      } else {
        LOGGER.debug("user value doesn't need to be transformed");
      }

      if (userPoint.x < this._xmin || userPoint.x > this._xmax) {
        return errorManager.createErrorMessage("user value (" + userPoint.x + ") is NOT in bbox for X. Between " + this._xmin + " and " + this._xmax);
      } else {
        LOGGER.debug("user value is in bbox for x");
      }

      if (userPoint.y < this._ymin || userPoint.y > this._ymax) {
        return errorManager.createErrorMessage("user value (" + userPoint.y + ") is NOT in bbox for Y. Between " + this._ymin + " and " + this._ymax);
      } else {
        LOGGER.debug("user value is in bbox for y");
      }

    }

    return validationManager.createValidationMessage("");
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
