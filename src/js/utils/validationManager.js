'use strict';

module.exports = {


/**
  *
  * @function
  * @name createValidationMessage
  * @description Création d'un message de validation
  * @param {string} msg - Message de validation
  * @return {object} validation - Objet qui contient un message de validation 
  *
  */

  createValidationMessage: function(msg) {

    return {
      code: "ok",
      message: msg
    };
    

  }


}
