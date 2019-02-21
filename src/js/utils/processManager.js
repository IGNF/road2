'use strict';

const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("PROCMANAGER");

module.exports = {

  /**
  *
  * @function
  * @name shutdown
  * @description Fonction utilisée pour éteindre le serveur. Elle permet aux logs d'être écrits avant d'arrêter le processus.
  * @param {integer} error - Signal de retour du process
  *
  */

  shutdown: function(error) {

    LOGGER.info("Extinction du serveur.")

    log4js.shutdown(function(){
      process.exit(error);
    });

  }

}
