'use strict';

/**
*
* @class
* @name ResourceParameter
* @description Classe modélisant un paramètre, dans une opération.
*
*/

module.exports = class ResourceParameter {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe ResourceParameter
  * @param {object} parameter - Référence au paramètre de service
  *
  */
  constructor(parameter) {

    // id
    this._serviceParameter = parameter;

  }

  /**
  *
  * @function
  * @name get serviceParameter
  * @description Récupérer l'id du paramètre
  *
  */
  get serviceParameter () {
    return this._serviceParameter;
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

    return false;

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
  check(userValue, options) {

    let userTable = new Array();

    // La vérification dépend de plusieurs attributs du paramètre de service associé

    if (this.serviceParameter.explode === "true") {

      // on lit un tableau de valeurs
      // on vérifie donc que c'est un tableau qui contient des valeurs
      if (!Array.isArray(userValue)) {
        return false;
      }
      if (userValue.length === 0) {
        return false;
      }
      userTable = userValue;

    } else {

      // on lit une string qui contient plusieurs valeurs
      if (typeof userValue === "string") {
        // on sépare les valeurs
        if (this.serviceParameter.style === "pipeDelimited") {
          userTable = userValue.split("|");
        } else {
          return false;
        }
      } else {
        // on peut avoir simplement un float
        userTable = userValue;
      }

    }

    // on vérifie le nombre valeur
    if (userTable.length < this.serviceParameter.min || userTable.length > this.serviceParameter.max) {
      return false;
    }

    for (let i = 0; i < userTable.length; i++) {
      if (!this.specificCheck(userTable[i], options)) {
        return false;
      }
    }

    // tout s'est bien passé
    return true;

  }

  /**
  *
  * @function
  * @name specificCheck
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @param {object} options - Options
  * @return {boolean}
  *
  */
  specificCheck(userValue, options) {

    return false;

  }

  /**
  *
  * @function
  * @name convertIntoTable
  * @description Convertir l'entrée utilisateur en tableau de points pour une request
  * @param {string} userValue - Valeur à vérifier
  * @param {table} finalTable - Tableau à remplir
  * @param {object} options - Options
  * @return {boolean}
  *
  */
  convertIntoTable(userValue, finalTable, options) {

    let userTable = new Array();

    if (this.serviceParameter.explode === "true") {
      userTable = userValue;
    } else {

      if (this.serviceParameter.style === "pipeDelimited") {
        userTable = userValue.split("|");
      } else {
        return false;
      }

    }

    for (let i = 0; i < userTable.length; i++) {

      finalTable[i] = this.specificConvertion(userTable[i], options);
      if (finalTable[i] === null) {
        return false;
      }

    }

    return true;

  }

  /**
  *
  * @function
  * @name specificConvertion
  * @description Vérifier la validité d'une valeur par rapport au paramètre
  * @param {string} userValue - Valeur à vérifier
  * @param {object} options - Options
  * @return {object}
  *
  */
  specificConvertion(userValue, options) {

    return null;

  }


}
