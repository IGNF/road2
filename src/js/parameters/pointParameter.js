'use strict';

const ResourceParameter = require('../parameters/resourceParameter');

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
  *
  */
  load(parameterConf) {

    this._bbox = parameterConf.values.bbox;

    return true;

  }

  /**
  *
  * @function
  * @name specificCheck
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  *
  */
  specificCheck(userValue) {

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
  *
  */
  specificConvertion(userValue, finalValue) {

    let tmpStringCoordinates = userValue.split(",");
    finalValue[i].lon = Number(tmpStringCoordinates[0]);
    finalValue[i].lat = Number(tmpStringCoordinates[1]);

    return true;

  }


}
