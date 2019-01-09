'use strict';

const fs = require('fs');
const path = require('path');

// Création du LOGGER
var LOGGER = global.log4js.getLogger("STORAGEMANAGER");

module.exports = {

  /**
  *
  * @function
  * @name checkJsonStorage
  * @description Fonction utilisée pour vérifier l'écriture d'un json au niveau du stockage.
  *
  */

  checkJsonStorage: function(jsonStorage) {

    var storageFound = false;

    // On regarde si c'est du stokage fichier
    if (jsonStorage.file) {
      // Vérification que le fichier existe et peut être lu.
      if (fs.existsSync(jsonStorage.file)) {
        try {
          fs.accessSync(jsonStorage.file, fs.constants.R_OK);
        } catch (err) {
          LOGGER.error("Le fichier " + jsonStorage.file + " ne peut etre lu.");
          return false;
        }
        storageFound = true;
      } else {
        LOGGER.error("Le fichier " + jsonStorage.file + " n'existe pas.");
        return false;
      }

    } else {
      // Ce n'est pas un storage de type file, on va tester d'autres types
    }

    return storageFound;
  }

}
