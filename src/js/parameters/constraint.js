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
    * @param {object} key - Clé demandée pour la contrainte
    * @param {object} keyId - Correspondance de la clé avec le moteur 
    * @param {string} operator - Opérateur demandé pour la contrainte
    * @param {object} value - Valeur demandée pour la contrainte
    * @param {object} valueId - Correspondance de la valeur avec le moteur
    *
    */
    constructor(key, keyId, operator, value, valueId) {

        // clé
        this._key = key;

        // Correspondance de la clé avec le moteur 
        this._keyId = keyId;

        // operateur 
        this._operator = operator;

        // valeur 
        this._value = value;

        // Correspondance de la valeur avec le moteur
        this._valueId = valueId;


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
     * @name get keyId
     * @description Récupérer la clé réelle de la contrainte
     *
     */
    get keyId () {
        return this._keyId;
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
     * @name get valueId
     * @description Récupérer la valeur réelle de la contrainte
     *
     */
    get valueId () {
        return this._valueId;
    }



}