'use strict';

/**
*
* @class
* @name Constraint
* @description Classe modélisant une contrainte, dans une opération.
*
*/

module.exports = class Constraint {


    /**
    *
    * @function
    * @name constructor
    * @description Constructeur de la classe Constraint
    * @param {string} type - Type de la contrainte
    * @param {object} key - Clé demandée pour la contrainte
    * @param {object} field - Correspondance de la clé avec le moteur
    * @param {string} operator - Opérateur demandé pour la contrainte
    * @param {object} value - Valeur demandée pour la contrainte
    * @param {object} condition - Correspondance de la valeur avec le moteur
    *
    */
    constructor(type, key, field, operator, value, condition) {

        // Type
        this._type = type;

        // clé
        this._key = key;

        // Correspondance de la clé avec le moteur
        this._field = field;

        // operateur
        this._operator = operator;

        // valeur
        this._value = value;

        // Correspondance de la valeur avec le moteur
        this._condition = condition;


    }

    /**
     *
     * @function
     * @name get type
     * @description Récupérer le type de la contrainte
     *
     */
    get type () {
        return this._type;
    }

    /**
     *
     * @function
     * @name get key
     * @description Récupérer la clé de la contrainte
     *
     */
    get key () {
        return this._key;
    }

    /**
     *
     * @function
     * @name get field
     * @description Récupérer la clé réelle de la contrainte
     *
     */
    get field () {
        return this._field;
    }

    /**
     *
     * @function
     * @name get operator
     * @description Récupérer l'operateur de la contrainte
     *
     */
    get operator () {
        return this._operator;
    }

    /**
     *
     * @function
     * @name get value
     * @description Récupérer la valeur de la contrainte
     *
     */
    get value () {
        return this._value;
    }

    /**
     *
     * @function
     * @name get condition
     * @description Récupérer la valeur réelle de la contrainte
     *
     */
    get condition () {
        return this._condition;
    }

    /**
    *
    * @function
    * @name toSqlString
    * @description Convertir la contrainte en condition SQL
    * @return {string} condition sql
    *
    */
    toSqlString () {

      let resultingString = '';

      if (this.type == 'banned') {
        if (this.operator == '!=') {
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
          }

          resultingString += this.condition.value;

        } else if (this.operator == '=') {
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
          }

          resultingString += this.condition.value;
          resultingString += ')';

        } else if ( [ ">", "<", ">=", "<=" ].includes(this.operator) ){
          // on est on mode numerical
          resultingString += ' NOT (';
          resultingString += this.field;
          resultingString += this.operator;
          resultingString += this.condition.value;
          resultingString += ')';

        } else {
          // voir s'il y a d'autres cas
        }
      } else {
        // voir s'il y a d'autres cas
      }

      return resultingString
    }

}
