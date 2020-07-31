'use strict';

const Constraint = require('../constraint/constraint');

/**
*
* @class
* @name LooseConstraint
* @description Classe modélisant une contrainte préférentielle (par opposition aux contraintes "dures"), dans une opération.
*
*/

module.exports = class LooseConstraint extends Constraint {


    /**
    *
    * @function
    * @name constructor
    * @description Constructeur de la classe LooseConstraint
    * @param {string} type - Type de la contrainte
    * @param {object} key - Clé demandée pour la contrainte
    * @param {object} field - Correspondance de la clé avec le moteur
    * @param {string} operator - Opérateur demandé pour la contrainte
    * @param {object} value - Valeur demandée pour la contrainte
    * @param {object} condition - Correspondance de la valeur avec le moteur
    *
    */
    constructor(type, key, field, operator, value, condition, costRatio) {

      super(type, key, field, operator, value, condition)

      // Ratio du coût
      this._costRatio = costRatio;
    }
    /**
     *
     * @function
     * @name get costRatio
     * @description Récupérer la valeur du costRatio
     *
     */
    get costRatio () {
      return this._costRatio;
  }

  /**
    *
    * @function
    * @name toSqlString
    * @description Convertir la contrainte en condition SQL
    * @param {string} costname - Nom de la colonne de coût en SQL
    * @param {string} rcostname - Nom de la colonne de coût inverse en SQL
    *
    * @return {string} condition sql
    *
    */
   toSqlString (costname, rcostname) {

    let resultingString = 'CASE WHEN ';
    let costResultingString = '';
    let rcostResultingString = '';

    if (this.operator === '=') {
      resultingString += this.field;
      // Opération en fonction du type de condition (dans une liste connue)
      switch( this.condition.type ) {
        case "equal":
          resultingString += '=';
          break;
        case "inequal":
          resultingString += '!=';
          break;
        case "greater":
          resultingString += '>';
          break;
        case "greatereq":
          resultingString += '>=';
          break;
        case "less":
          resultingString += '<';
          break;
        case "lesseq":
          resultingString += '<=';
          break;
        case "like":
          resultingString += ' LIKE ';
          break;
        case "intersection":
          resultingString += ' && ';
          break;
        case "!=":
          resultingString += '!=';
          break;
        case "=":
          resultingString += '=';
          break;
      }

      resultingString += this.condition.value;

    } else if (this.operator === '!=') {
      resultingString += ' NOT (';
      resultingString += this.field;
      // Opération en fonction du type de condition (dans une liste connue)

      switch( this.condition.type ) {
        case "equal":
          resultingString += '=';
          break;
        case "inequal":
          resultingString += '!=';
          break;
        case "greater":
          resultingString += '>';
          break;
        case "greatereq":
          resultingString += '>=';
          break;
        case "less":
          resultingString += '<';
          break;
        case "lesseq":
          resultingString += '<=';
          break;
        case "like":
          resultingString += ' LIKE ';
          break;
        case "intersection":
          resultingString += ' && ';
          break;
        case "=":
          resultingString += '=';
          break;
        case "!=":
          resultingString += '!=';
          break;
      }

      resultingString += this.condition.value;
      resultingString += ')';

    } else if ( [ ">", "<", ">=", "<=" ].includes(this.operator) ){
      // on est on mode numerical
      resultingString += this.field;
      resultingString += this.operator;
      resultingString += this.condition.value;
    }

    resultingString += " THEN ";
    resultingString += this.costRatio;
    resultingString += "*";

    costResultingString += resultingString;
    costResultingString += costname;
    costResultingString += " ELSE ";
    costResultingString += costname;
    costResultingString += " END";

    rcostResultingString += resultingString;
    rcostResultingString += rcostname;
    rcostResultingString += " ELSE ";
    rcostResultingString += rcostname;
    rcostResultingString += " END";

    return [costResultingString, rcostResultingString]
  }

}
