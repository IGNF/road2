'use strict';

const ResourceParameter = require('../parameters/resourceParameter');
const Constraint = require('../constraint/constraint');
const LooseConstraint = require('../constraint/looseConstraint');
const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const validationManager = require('../utils/validationManager');


var LOGGER = log4js.getLogger("CONSTRAINTPARAM");

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

    this._defaultPreferredCostRatio;
    this._defaultAvoidCostRatio;

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
  * @name get defaultPreferredCostRatio
  * @description Récupérer la valeur par défaut du costRatio
  *
  */
  get defaultPreferredCostRatio () {
    return this._defaultPreferredCostRatio;
  }

  /**
  *
  * @function
  * @name get defaultAvoidCostRatio
  * @description Récupérer la valeur par défaut du costRatio
  *
  */
  get defaultAvoidCostRatio () {
    return this._defaultAvoidCostRatio;
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

    this._defaultPreferredCostRatio = parameterConf.defaultPreferredCostRatio;
    this._defaultAvoidCostRatio = parameterConf.defaultAvoidCostRatio;

    this._values = parameterConf.values;

    this._getcapabilities.keys = new Array();

    // Remplissage du verificationHash
    for(let i = 0; i < this._values.length; i++) {
      // pour chaque clé disponible
      let currentKeyDescription = {};
      currentKeyDescription.key = this._values[i].key.toLowerCase();

      this._verification[this._values[i].key.toLowerCase()] = {};

      this._verification[this._values[i].key.toLowerCase()].constraintType = new Array();
      currentKeyDescription.availableConstraintType = new Array();

      for (let j = 0; j < this._values[i].availableConstraintType.length; j++) {
        this._verification[this._values[i].key.toLowerCase()].constraintType.push(this._values[i].availableConstraintType[j]);
        currentKeyDescription.availableConstraintType.push(this._values[i].availableConstraintType[j]);
      }

      if (this._values[i].keyType === "name-pgr") {

        this._verification[this._values[i].key.toLowerCase()].keyType = "name-pgr";

        currentKeyDescription.availableOperators = new Array();
        currentKeyDescription.availableOperators.push("=","!=");
        currentKeyDescription.values = new Array();

        for(let l = 0; l < this._values[i].availableValues.length; l++) {

          this._verification[this._values[i].key.toLowerCase()][this._values[i].availableValues[l].value] = [
            this._values[i].availableValues[l].field,
            this._values[i].availableValues[l].condition
          ];
          currentKeyDescription.values.push(this._values[i].availableValues[l].value);

        }

      } else if (this._values[i].keyType === "numerical-pgr") {

        this._verification[this._values[i].key.toLowerCase()].keyType = "numerical-pgr";
        this._verification[this._values[i].key.toLowerCase()].field = this._values[i].field;

        currentKeyDescription.availableOperators = new Array();
        currentKeyDescription.availableOperators.push("=", "!=", ">", ">=", "<", "<=");


      } else if (this._values[i].keyType === "name-osrm") {

          this._verification[this._values[i].key.toLowerCase()].keyType = "name-osrm";

          currentKeyDescription.availableOperators = new Array();
          currentKeyDescription.availableOperators.push("=");
          currentKeyDescription.values = new Array();

          for(let l = 0; l < this._values[i].availableValues.length; l++) {

            this._verification[this._values[i].key.toLowerCase()][this._values[i].availableValues[l].value] = this._values[i].availableValues[l].field;
            currentKeyDescription.values.push(this._values[i].availableValues[l].value);

          }

      } else if (this._values[i].keyType === "name-valhalla") {

        this._verification[this._values[i].key.toLowerCase()].keyType = "name-valhalla";

        currentKeyDescription.availableOperators = new Array();
        currentKeyDescription.availableOperators.push("=");
        currentKeyDescription.values = new Array();

        for(let l = 0; l < this._values[i].availableValues.length; l++) {

          this._verification[this._values[i].key.toLowerCase()][this._values[i].availableValues[l].value] = this._values[i].availableValues[l].field;
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
  * @name specificCheck
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @param {object} options - Options
  * @return {object} result.code - "ok" si tout s'est bien passé et "error" sinon
  *                  result.message - "" si tout s'est bien passé et la raison de l'erreur sinon
  *
  *
  */
  specificCheck(userValue, options) {

    LOGGER.debug("specificCheck()");

    let userJson = {};

    if (typeof userValue !== "string") {
      return errorManager.createErrorMessage("user value is NOT a string");
    } else {
      LOGGER.debug("user value is a string");
    }

    // peut-on bien convertir l'entrée de l'utilisateur en JSON
    try {
      userJson = JSON.parse(userValue);
      LOGGER.debug("user value has been converted to JSON object");
    } catch (err) {
      return errorManager.createErrorMessage("user value can't be converted to JSON object");
    }

    // Vérification de la clé
    if (!userJson.key) {
      return errorManager.createErrorMessage("user value doesn't have a 'key'");
    } else {

      LOGGER.debug("user value has a 'key'");

      if (typeof userJson.key !== "string") {
        return errorManager.createErrorMessage("user value key is not a string");
      } else {
        LOGGER.debug("the key is a string");
      }

      if (!this._verification[userJson.key.toLowerCase()]) {
        return errorManager.createErrorMessage("user value key is not available");
      } else {
        LOGGER.debug("the key is available");
      }

    }

    // Vérification du type de la contrainte
    if (!userJson.constraintType) {
      return errorManager.createErrorMessage("user value doesn't have a 'constraintType'");
    } else {

      LOGGER.debug("user value has a 'constraintType'");

      if (typeof userJson.constraintType !== "string") {
        return errorManager.createErrorMessage("user value constraintType is not a string");
      } else {
        LOGGER.debug("the constraintType is a string");
      }

      let found = false;
      for (let i = 0; i < this._verification[userJson.key.toLowerCase()].constraintType.length; i++) {
        if (userJson.constraintType === this._verification[userJson.key.toLowerCase()].constraintType[i]) {
          found = true;
        }
      }
      if (!found) {
        return errorManager.createErrorMessage("user value constraintType is not available");
      } else {
        LOGGER.debug("the constraintType is available");
      }

      // Gestion du champ costRatio pour contraintes préférentielles
      if (userJson.constraintType === 'avoid' || userJson.constraintType === 'prefer') {

        if (userJson.costRatio) {

          LOGGER.debug("user value has a 'costRatio'");

          if(typeof userJson.costRatio !== "number") {
            return errorManager.createErrorMessage("user value costRatio is NOT a number");
          } else {
            // on ne vérifie rien de plus 
            LOGGER.debug("user value costRatio is a number");
          }

        } else {
          // ce n'est pas grave, il y a des valeurs par défaut
          LOGGER.debug("user value doesn't have a 'costRatio', defaults will be used");
        }

      } else {
        // il n'y a rien à vérifier pour les costRatio
        LOGGER.debug("no costRatio verification");
      }

    }

    let nameTable = ["name-pgr","name-osrm","name-valhalla"];
    if (nameTable.includes(this._verification[userJson.key.toLowerCase()].keyType)) {

      LOGGER.debug("keyType is name-pgr ror name-osrm ror name-valhalla");

      // Vérification de l'opérateur
      if (!userJson.operator) {
        return errorManager.createErrorMessage("user value doesn't have an 'operator'");
      } else {

        LOGGER.debug("user value has an 'operator'");

        if (typeof userJson.operator !== "string") {
          return errorManager.createErrorMessage("user value 'operator' is NOT a string");
        } else {
          LOGGER.debug("operator is a string");
        }

        if ( !(["=", "!="].includes(userJson.operator)) ) {
          return errorManager.createErrorMessage("user value 'operator' is NOT in: " + ["=", "!="]);
        } else {
          LOGGER.debug("operator is ok");
        }

      }

      // Vérification de la valeur
      if (!userJson.value) {
        return errorManager.createErrorMessage("user value doesn't have an 'value'");
      } else {

        LOGGER.debug("user value has a 'value'");

        if (typeof userJson.value !== "string") {
          return errorManager.createErrorMessage("user value 'value' is NOT a string");
        } else {
          LOGGER.debug("value is a string");
        }

        if (!this._verification[userJson.key.toLowerCase()][userJson.value]) {
          return errorManager.createErrorMessage("user value 'value' is NOT available");
        } else {
          // la contrainte est bien formulée et est disponible
          LOGGER.debug("value is ok");
          return validationManager.createValidationMessage("");
        }

      }

    } else if (this._verification[userJson.key.toLowerCase()].keyType === "numerical-pgr") {

      LOGGER.debug(" keyType is numerical-pgr");

      // Vérification de l'opérateur
      if (!userJson.operator) {
        return errorManager.createErrorMessage("user value doesn't have an 'operator'");
      } else {

        LOGGER.debug("user value has an 'operator'");

        if (typeof userJson.operator !== "string") {
          return errorManager.createErrorMessage("user value 'operator' is NOT a string");
        } else {
          LOGGER.debug("operator is a string");
        }

        if ( !(["=", "!=", ">", "<", ">=", "<="].includes(userJson.operator)) ) {
          return errorManager.createErrorMessage("user value 'operator' is NOT in: " + ["=", "!=", ">", "<", ">=", "<="]);
        } else {
          LOGGER.debug("operator is ok");
        }

      }

      // Vérification de la valeur
      if (!userJson.value) {
        return errorManager.createErrorMessage("user value doesn't have an 'value'");
      } else {

        LOGGER.debug("user value has a 'value'");

        if (typeof userJson.value !== "number") {
          return errorManager.createErrorMessage("user value 'value' is NOT a number");
        } else {
          // la contrainte est bien formulée et est disponible
          LOGGER.debug("value is ok");
          return validationManager.createValidationMessage("");
        }

      }

    } else {

      // TODO: cela ne devrait pas arriver il me semble, à vérifier et décider ce qu'on renvoit 
      LOGGER.debug(" keyType is unknown");
      return errorManager.createErrorMessage("");

    }

  }

  /**
  *
  * @function
  * @name specificConvertion
  * @description Convertir une valeur dans un format adapté aux requêtes
  * @param {string} userValue - Valeur à vérifier
  * @param {object} defaultCostRatios - objet de la forme {
        defaultPreferredCostRatio: 0.8,
        defaultAvoidCostRatio: 1.2,
      }
  * @return {object}
  *
  */
  specificConvertion(userValue, defaultCostRatios) {

    let userJson = {};
    let constraint;

    try {
      userJson = JSON.parse(userValue);
    } catch (err) {
      return false;
    }

    if (this._verification[userJson.key.toLowerCase()].keyType === "name-pgr") {

      let field = this._verification[userJson.key.toLowerCase()][userJson.value][0];
      let condition = this._verification[userJson.key.toLowerCase()][userJson.value][1];

      if (userJson.constraintType === 'banned') {
        constraint = new Constraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value, condition);
      } else if (userJson.constraintType === 'prefer' && !userJson.costRatio) {
        constraint = new LooseConstraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value, condition, defaultCostRatios.defaultPreferredCostRatio);
      } else if (userJson.constraintType === 'avoid' && !userJson.costRatio) {
        constraint = new LooseConstraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value, condition, defaultCostRatios.defaultAvoidCostRatio);
      } else {
        constraint = new LooseConstraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value, condition, userJson.costRatio);
      }

    } else if (this._verification[userJson.key.toLowerCase()].keyType === "numerical-pgr") {

      let field = this._verification[userJson.key.toLowerCase()].field;

      let condition = {
        type: userJson.operator,
        value: userJson.value
      }
      if (userJson.constraintType === 'banned') {
        constraint = new Constraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value, condition);
      } else if (userJson.constraintType === 'prefer' && !userJson.costRatio) {
        constraint = new LooseConstraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value, condition, defaultCostRatios.defaultPreferredCostRatio);
      } else if (userJson.constraintType === 'avoid' && !userJson.costRatio) {
        constraint = new LooseConstraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value, condition, defaultCostRatios.defaultAvoidCostRatio);
      } else {
        constraint = new LooseConstraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value, condition, userJson.costRatio);
      }

    } else if (this._verification[userJson.key.toLowerCase()].keyType === "geometry-pgr") {
      // TODO: gérer contraintes geom
      // field = the_geom
      // condition = { type: "intersection", value: "ST_fromGeoJson( truc_par_rapport_a_userJson )" }
    } else if (this._verification[userJson.key.toLowerCase()].keyType === "name-osrm") {
      let field = this._verification[userJson.key.toLowerCase()][userJson.value];

      if (userJson.constraintType === 'banned') {
        constraint = new Constraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value);
      }
    } else if (this._verification[userJson.key.toLowerCase()].keyType === "name-valhalla") {
      let field = this._verification[userJson.key.toLowerCase()][userJson.value];

      if (userJson.constraintType === 'banned') {
        constraint = new Constraint(userJson.constraintType, userJson.key.toLowerCase(), field, userJson.operator, userJson.value);
      }

    } else {
      //
    }

    return constraint;

  }


}
