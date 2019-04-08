'use strict';

const log4js = require('log4js');

var LOGGER = log4js.getLogger("INIT");

module.exports = {

  /**
  *
  * @function
  * @name createGetCapabilities
  * @description Fonction utilisée pour créer le GetCapabilities
  * @param {object} app - App ExpressJS
  * @return {boolean} True si tout s'est bien passé et False sinon
  *
  */

  updateGetCapabilities: function(app) {

    let service = app.get("service");

    return true;

  },

  /**
  *
  * @function
  * @name run
  * @description Fonction lancée lors d'une MAJ sur le serveur.
  * @param {object} app - App ExpressJS
  * @param {string} uid - uid de l'api. Il permet de stocker des objets dans app.
  * @return {boolean} True si tout s'est bien passé et False sinon
  *
  */

  run: function(app, uid) {

    // Création du GetCapabilities
    if (!updateGetCapabilities(app)) {
      LOGGER.error("Erreur lors de la creation du GetCapabilities.");
      return false;
    }

    return true;

  }

}
