'use strict';

const ResourceParameter = require('../parameters/resourceParameter');
const Constraint = require('./constraint');

/**
*
* @class
* @name ConstraintParameter
* @description Classe modélisant un paramètre de type contrainte, dans une opération.
*
*/

module.exports = class ConstraintParameter extends ResourceParameter {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe ConstraintParameter
  * @param {object} parameter - Référence au paramètre de service
  *
  */
  constructor(parameter) {

    // id
    super(parameter);

    // defaultValueContent
    this._defaultValueContent = {};

    // values
    this._values = new Array();

    // verificationHash
    // hash pour faciliter les vérifications et faire les correspondances entre les apis et les valeurs du moteur
    this._verification = {};

    // getcapabilities
    this._getcapabilities = {};

  }

  /**
  *
  * @function
  * @name get defaultValueContent
  * @description Récupérer la valeur par défaut
  *
  */
  get defaultValueContent () {
    return this._defaultValueContent;
  }

  /**
  *
  * @function
  * @name get values
  * @description Récupérer l'ensemble des valeurs par défaut
  *
  */
  get values () {
    return this._values;
  }

    /**
  *
  * @function
  * @name get getcapabilities
  * @description Récupérer le getcapabilities
  *
  */
  get getcapabilities () {
    return this._getcapabilities;
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

    if (super.serviceParameter.defaultValue === "true") {
      this._defaultValueContent = parameterConf.defaultValueContent;
      // TODO: Vérifier que cette valeur par défaut est comprise dans les valeurs disponibles
    }

    this._values = parameterConf.values;

    this._getcapabilities.keys = new Array();

    // Remplissage du verificationHash
    for(let i = 0; i < this._values.length; i++) {
      // pour chaque clé disponible
      let currentKeyDescription = {};
      currentKeyDescription.key = this._values[i].key;

      this._verification[this._values[i].key] = {};

      this._verification[this._values[i].key].constraintType = new Array();
      currentKeyDescription.availableConstraintType = new Array();

      for (let j = 0; j < this._values[i].availableConstraintType.length; j++) {
        this._verification[this._values[i].key].constraintType.push(this._values[i].availableConstraintType[j]);
        currentKeyDescription.availableConstraintType.push(this._values[i].availableConstraintType[j]);
      }

      if (this._values[i].keyType === "name-pgr") {

        this._verification[this._values[i].key].keyType = "name-pgr";

        currentKeyDescription.availableOperators = new Array();
        currentKeyDescription.availableOperators.push("=","!=");
        currentKeyDescription.values = new Array();

        for(let l = 0; l < this._values[i].availableValues.length; l++) {

          this._verification[this._values[i].key][this._values[i].availableValues[l].value] = [
            this._values[i].availableValues[l].field,
            this._values[i].availableValues[l].condition
          ];
          currentKeyDescription.values.push(this._values[i].availableValues[l].value);

        }

      } else if (this._values[i].keyType === "numerical-pgr") {

        this._verification[this._values[i].key].keyType = "numerical-pgr";
        this._verification[this._values[i].key].field = this._values[i].field;

        currentKeyDescription.availableOperators = new Array();
        currentKeyDescription.availableOperators.push("=", "!=", ">", ">=", "<", "<=");


      } else if (this._values[i].keyType === "name-osrm") {

          this._verification[this._values[i].key].keyType = "name-osrm";
  
          currentKeyDescription.availableOperators = new Array();
          currentKeyDescription.availableOperators.push("=");
          currentKeyDescription.values = new Array();
  
          for(let l = 0; l < this._values[i].availableValues.length; l++) {
  
            this._verification[this._values[i].key][this._values[i].availableValues[l].value] = this._values[i].availableValues[l].field;
            currentKeyDescription.values.push(this._values[i].availableValues[l].value);
  
          }

      } else {
        return false;
      }

      this._getcapabilities.keys.push(currentKeyDescription);

    }

    return true;

  }

  /**
  *
  * @function
  * @name check
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @param {object} options - Options
  * @return {boolean}
  *
  */
  specificCheck(userValue, options) {

    let userJson = {};

    if (typeof userValue !== "string") {
      return false;
    }

    // peut-on bien convertir l'entrée de l'utilisateur en JSON
    try {
      userJson = JSON.parse(userValue);
    } catch (err) {
      return false;
    }

    // Vérification de la clé
    if (!userJson.key) {
      return false;
    } else {
      if (typeof userJson.key !== "string") {
        return false;
      }
      if (!this._verification[userJson.key]) {
        return false;
      }
    }

    // Vérification du type de la contrainte
    if (!userJson.constraintType) {
      return false;
    } else {
      if (typeof userJson.constraintType !== "string") {
        return false;
      }
      let found = false;
      for (let i = 0; i < this._verification[userJson.key].constraintType.length; i++) {
        if (userJson.constraintType === this._verification[userJson.key].constraintType[i]) {
          found = true;
        }
      }
      if (!found) {
        return false;
      }
    }

    if (this._verification[userJson.key].keyType === "name-pgr" || this._verification[userJson.key].keyType === "name-osrm") {

      // Vérification de l'opérateur
      if (!userJson.operator) {
        return false;
      } else {
        if (typeof userJson.operator !== "string") {
          return false;
        }
        if ( !(["=", "!="].includes(userJson.operator)) ) {
          return false;
        }
      }

      // Vérification de la valeur
      if (!userJson.value) {
        return false;
      } else {
        if (typeof userJson.value !== "string") {
          return false;
        }
        if (!this._verification[userJson.key][userJson.value]) {
          return false;
        } else {
          // la contrainte est bien formulée et est disponible
          return true;
        }
      }

    } else if (this._verification[userJson.key].keyType === "numerical-pgr") {

      // Vérification de l'opérateur
      if (!userJson.operator) {
        return false;
      } else {
        if (typeof userJson.operator !== "string") {
          return false;
        }
        if ( !(["=", "!=", ">", "<", ">=", "<="].includes(userJson.operator)) ) {
          return false;
        }
      }

      // Vérification de la valeur
      if (!userJson.value) {
        return false;
      } else {
        if (typeof userJson.value !== "number") {
          return false;
        }
        // la contrainte est bien formulée et est disponible
        return true;

      }

    } else {
      return false;
    }

  }

  /**
  *
  * @function
  * @name specificConvertion
  * @description Convertir une valeur dans un format adapté aux requêtes
  * @param {string} userValue - Valeur à vérifier
  * @return {object}
  *
  */
  specificConvertion(userValue) {

    let userJson = {};
    let constraint;

    try {
      userJson = JSON.parse(userValue);
    } catch (err) {
      return false;
    }

    if (this._verification[userJson.key].keyType === "name-pgr") {

      let field = this._verification[userJson.key][userJson.value][0];
      let condition = this._verification[userJson.key][userJson.value][1];

      constraint = new Constraint(userJson.constraintType, userJson.key, field, userJson.operator, userJson.value, condition);

    } else if (this._verification[userJson.key].keyType === "numerical-pgr") {

      let field = this._verification[userJson.key].field;

      let condition = {
        type: userJson.operator,
        value: userJson.value
      }
      constraint = new Constraint(userJson.constraintType, userJson.key, field, userJson.operator, userJson.value, condition);

    } else if (this._verification[userJson.key].keyType === "geometry-pgr") {
      // TODO: gérer contraintes geom
      // field = the_geom
      // condition = { type: "intersection", value: "ST_fromGeoJson( truc_par_rapport_a_userJson )" }
    } else if (this._verification[userJson.key].keyType === "name-osrm") {
      let field = this._verification[userJson.key][userJson.value];

      constraint = new Constraint(userJson.constraintType, userJson.key, field, userJson.operator, userJson.value);
    } else {
      // 
    }

    return constraint;

  }


}
