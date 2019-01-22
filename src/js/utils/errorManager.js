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
  *
  */

  createError: function(msg, status) {

    var err = new Error(msg);
    if (status) {
      err.status = status;
    } else {
      err.status = 500;
    }
    return err;

  }

}
