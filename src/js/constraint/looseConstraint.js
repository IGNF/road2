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
    * @name toSqlCondition
    * @description Convertir la contrainte en condition SQL
    *
    * @return {string} condition sql
    *
    */
   _toSqlCondition () {
    let resultingString = '';

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

    return resultingString
  }

  /**
    *
    * @function
    * @name looseConstraintsToSQL
    * @description Fonction statique qui permet de convertir un ensemble de contraintes préférentielles
    * en une seule chaîne SQL
    *
    * @param {Array} looseConstraints - Tableau de contraintes préférentielles
    * @param {String} costname - Nom du coût de la requête
    * @param {String} rcostname - Nom du coût inverse de la requête
    *
    * @return {String} chaine SQL permettant le calcul à la volée de coûts pour les contraintes préférentielles
    *
    */
  static looseConstraintsToSQL(looseConstraints, costname, rcostname) {
    let costResultingString = 'CASE';
    let rcostResultingString = 'CASE';
    let conditionsArray = [];
    let costRatios = [];

    // S'il n'y a qu'une condition, le traitement est différent et plus simple
    if (looseConstraints.length === 1) {
      let constraintCondition = looseConstraints[0]._toSqlCondition();
      let resultString = '';
      resultString += ' WHEN ';
      resultString += constraintCondition;
      resultString += ' THEN ';
      resultString += looseConstraints[0].costRatio;
      resultString += ' * ';

      costResultingString += resultString;
      costResultingString += costname;
      costResultingString += ' ELSE ';
      costResultingString += costname;
      costResultingString += ' END';

      rcostResultingString += resultString;
      rcostResultingString += rcostname;
      rcostResultingString += ' ELSE ';
      rcostResultingString += rcostname;
      rcostResultingString += ' END';

      return [costResultingString, rcostResultingString]
    }

    // Fonction pour produit cartésien entre tableaux (https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript)
    let f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
    let cartesian = (a, b, ...c) => b ? cartesian(f(a, b), ...c) : a;

    // On construit un tableau avec toutes les conditions qui vont apparaître dans la chaîne SQL,
    // puis on fait le produit cartésien de ses éléments pour avoir toutes les combinaisons possibles
    // de conditions.
    // On construit également un tableau de costration permettant de faire le calcul de coût à la volée,
    // avec une valeur de 1 (pas de modification du coût) quand la condition n'est pas remplie.

    for (let i = 0; i < looseConstraints.length; i++) {
      let currentConstraint = looseConstraints[i];
      let constraintCondition = currentConstraint._toSqlCondition();
      conditionsArray.push([constraintCondition, 'NOT(' + constraintCondition + ')']);
      costRatios.push([currentConstraint.costRatio, 1]);
    }

    const conditionsCombinations = cartesian(...conditionsArray);
    const costRatiosCombinations = cartesian(...costRatios);

    for (let i = 0; i < conditionsCombinations.length; i++) {
      let currentCombination = conditionsCombinations[i];
      let currentCostCombination = costRatiosCombinations[i];

      // Ajout des conditions
      costResultingString += ' WHEN ';
      rcostResultingString += ' WHEN ';
      for (let j = 0; j < currentCombination.length - 1; j++) {
        costResultingString += currentCombination[j];
        rcostResultingString += currentCombination[j];
        costResultingString += ' AND ';
        rcostResultingString += ' AND ';
      }
      // Ajout de la derière condtion sans 'AND'
      costResultingString += currentCombination[currentCombination.length - 1];
      rcostResultingString += currentCombination[currentCombination.length - 1];

      // Ajout du calcul de coût à la volée
      costResultingString += ' THEN ';
      rcostResultingString += ' THEN ';
      for (let j = 0; j < currentCombination.length; j++) {
        costResultingString += currentCostCombination[j];
        rcostResultingString += currentCostCombination[j];
        costResultingString += ' * ';
        rcostResultingString += ' * ';
      }
      costResultingString += costname;
      rcostResultingString += rcostname;
    }

    costResultingString += ' ELSE ';
    costResultingString += costname;
    costResultingString += ' END';

    rcostResultingString += ' ELSE ';
    rcostResultingString += rcostname;
    rcostResultingString += ' END';

    return [costResultingString, rcostResultingString]
  }

}
