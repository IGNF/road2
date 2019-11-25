'use strict';

const Topology = require('./topology');

/**
*
* @class
* @name dbTopology
* @description Classe modélisant une topologie se basant sur une base de données.
*
*/
module.exports = class dbTopology extends Topology {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe dbTopology
  * @param{string} id - Id de la topologie
  * @param{string} description - Description de la topologie
  * @param{string} projection - Projection de la topologie
  * @param{string} bbox - Bbox de la topologie
  * @param{object} base - Instance de la classe Base
  * @param{string} schema - Nom de la schema contenant la topologie
  * @param{table} defaultAttributes - Tableau d'objets {key: 'test', column:'test_column', default: 'true'}
  * @param{table} otherAttributes - Tableau d'objets {key: 'test', column:'test_column', default: 'false'}
  *
  */
  constructor(id, description, projection, bbox, base, schema, defaultAttributes, otherAttributes) {

    // ID de la topologie
    super(id, "db", description, projection, bbox);

    // Référence à la base de données
    this._base = base;

    // Schema contenant la topologie
    this._schema = schema;

    // stockage des attributs par défaut
    this._defaultAttributes = defaultAttributes;

    // stockage des attributs dans un tableau
    this._defaultAttributesTable = new Array();
    this._defaultAttributesKeyTable = new Array();
    for (let i = 0; i < this._defaultAttributes.length; i++) {
      this._defaultAttributesTable.push("'" + this._defaultAttributes[i].column + "'");
      this._defaultAttributesKeyTable.push(this._defaultAttributes[i].key);
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
  * @name get schema
  * @description Récupérer le schema
  *
  */
  get schema () {
    return this._schema;
  }

  /**
  *
  * @function
  * @name get defaultAttributes
  * @description Récupérer les attributs (colonne) par défaut de la topologie
  *
  */
  get defaultAttributes () {
    return this._defaultAttributes;
  }

  /**
  *
  * @function
  * @name get defaultAttributesString
  * @description Récupérer les attributs (colonne) par défaut de la topologie en une chaîne de caractères
  *
  */
  get defaultAttributesString () {
    return this._defaultAttributesString;
  }

  /**
  *
  * @function
  * @name get defaultAttributesTable
  * @description Récupérer les attributs (colonne) par défaut de la topologie en tableau
  *
  */
  get defaultAttributesTable () {
    return this._defaultAttributesTable;
  }

  /**
  *
  * @function
  * @name get defaultAttributesKeyTable
  * @description Récupérer les attributs (clé) par défaut de la topologie en tableau
  *
  */
  get defaultAttributesKeyTable () {
    return this._defaultAttributesKeyTable;
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
