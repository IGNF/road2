'use strict';

module.exports = {

  /**
  *
  * @function
  * @name isFloat
  * @description Permet de savoir si une chaîne de caractère représente un float
  * @param {string} value - Objet à analyser
  * @return {boolean} 
  *
  */

  isFloat: function(value) {

    if (/^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
        return true;
    } else {
        return false;
    }

  },

    /**
  *
  * @function
  * @name convertFloat
  * @description Permet de savoir si un objet est un float
  * @param {string} value - Valeur à convertir
  * @return {float} 
  *
  */

  convertFloat: function(value) {

    if (this.isFloat(value)) {
        return Number(value);
      } else {
        return NaN;
      }

  }

}