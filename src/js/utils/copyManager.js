'use strict';

module.exports = {

  /**
  *
  * @function
  * @name deepCopy
  * @description Copie d'un objet
  * @param {objecy} obj - Objet à copier 
  * @return {object} Copie de l'objet en entrée
  *
  */

  deepCopy: function(obj) {

    if(typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if(obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if(obj instanceof Array) {
        return obj.reduce((arr, item, i) => {
            arr[i] = this.deepCopy(item);
            return arr;
        }, []);
    }

    if(obj instanceof Object) {
        return Object.keys(obj).reduce((newObj, key) => {
            newObj[key] = this.deepCopy(obj[key]);
            return newObj;
        }, {})
    }

  }

}