'use strict';

// Création du LOGGER
var LOGGER = log4js.getLogger("PROCMANAGER");

module.exports = {

  /**
  *
  * @function
  * @name shutdown
  * @description Fonction utilisée pour éteindre le serveur. Elle permet aux logs d'être écrits avant d'arrêter le processus. 
  *
  */

  shutdown: function(error) {

    log4js.shutdown(function(){
      process.exit(error);
    });

  }

}
