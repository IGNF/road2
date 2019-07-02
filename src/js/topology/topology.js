'use strict';

const log4js = require('log4js');
const errorManager = require('../utils/errorManager');

// Création du LOGGER
const LOGGER = log4js.getLogger("TOPOLOGY");

/**
*
* @class
* @name Topology
* @description Classe modélisant une topologie.
*
*/
module.exports = class Topology {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Topology
  * @param{object} base - Instance de la classe Base
  * @param{string} table - Nom de la table contenant la topologie
  * @param{table} defaultAttributes - Tableau d'objets {key: 'test', column:'test_column'}
  * @param{table} otherAttributes - Tableau d'objets {key: 'test', column:'test_column'}
  *
  */
  constructor(base, table, defaultAttributes, otherAttributes) {

    // Référence à la base de données
    this._base = base;

    // Table contenant la topologie
    this._table = table;

    // stockage des attributs par défaut
    this._defaultAttributes = defaultAttributes;

    // stockage des attributs dans un tableau
    this._defaultAttributesTable = new Array();
    for (let i = 0; i < this._defaultAttributes.length; i++) {
      this._defaultAttributesTable.push(this._defaultAttributes[i]);
    }

    // stockage des attributs par défaut en une chaîne de caractères
    this._defaultAttributesString = this._defaultAttributesTable.join(",");

    // stockage des attributs restants et disponibles
    this._otherAttributes = otherAttributes;

  }

  /**
  *
  * @function
  * @name get base
  * @description Récupérer la base
  *
  */
  get base () {
    return this._base;
  }

  /**
  *
  * @function
  * @name get table
  * @description Récupérer la table
  *
  */
  get table () {
    return this._table;
  }

  /**
  *
  * @function
  * @name get defaultAttributes
  * @description Récupérer les attributs par défaut de la topologie
  *
  */
  get defaultAttributes () {
    return this._defaultAttributes;
  }

  /**
  *
  * @function
  * @name get defaultAttributesString
  * @description Récupérer les attributs par défaut de la topologie en une chaîne de caractères
  *
  */
  get defaultAttributesString () {
    return this._defaultAttributesString;
  }

  /**
  *
  * @function
  * @name get otherAttributes
  * @description Récupérer les attributs facultatifs de la topologie
  *
  */
  get otherAttributes () {
    return this._otherAttributes;
  }


}
