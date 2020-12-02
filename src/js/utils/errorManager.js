'use strict';

module.exports = {

  /**
  *
  * @function
  * @name createError
  * @description Création d'une erreur
  * create an error with .status. we
  * can then use the property in our
  * custom error handler (Connect repects this prop as well)
  * @param {string} msg - Message d'erreur
  * @param {integer} status - Code http d'erreur
  * @return {Error} err - Erreur
  *
  */

  createError: function(msg, status) {

    let err = new Error(msg);
    
    if (status) {
      err.status = status;
    } else {
      err.status = 500;
    }

    return err;

  },

   /**
  *
  * @function
  * @name createErrorMessage
  * @description Création d'un message d'erreur
  * @param {string} msg - Message d'erreur
  * @return {object} err - Objet qui contient un message d'erreur 
  *
  */

  createErrorMessage: function(msg) {

    return {
      code: "error",
      message: msg
    };
    

  }


}
