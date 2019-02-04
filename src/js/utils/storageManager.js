'use strict';

const fs = require('fs');
const path = require('path');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("STORAGEMANAGER");

module.exports = {

  /**
  *
  * @function
  * @name checkJsonStorage
  * @description Fonction utilisée pour vérifier l'écriture d'un json au niveau du stockage.
  * @param {json} jsonStorage - Json décrivant le stockage
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
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
