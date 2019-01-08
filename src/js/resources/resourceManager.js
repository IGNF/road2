'use strict';

const fs = require('fs');
const path = require('path');

// Création du LOGGER
var LOGGER = global.log4js.getLogger("RESOURCEMANAGER");

module.exports = {

  /**
  *
  * @function
  * @name checkResource
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une ressource.
  *
  */

  checkResource: function(resourceJsonObject) {

    LOGGER.info("Verification de la ressource...");

    // ID
    if (!resourceJsonObject.resource.id) {
      LOGGER.error("La ressource ne contient pas d'id.");
      return false;
    } else {
      // TODO: On vérifie que l'id de la ressource n'est pas déjà pris par une autre ressource
    }

    // Type
    if (!resourceJsonObject.resource.type) {
      LOGGER.error("La ressource ne contient pas de type.");
      return false;
    } else {
      // Vérification que le type est valide puis vérification spécifique à chaque type
      var available = false;
      // La partie délimitée peut être copié-collée pour ajouter un nouveau type.
      // Il ne reste plus qu'à créer la fonction de vérification correspondante.
      //------ OSRM
      if (resourceJsonObject.resource.type == "osrm") {
        available = true;
        LOGGER.info("Ressource osrm.");
        if (!this.checkResourceOsrm(resourceJsonObject)) {
          LOGGER.error("Erreur lors de la verification de la ressource osrm.");
          return false;
        } else {
          // il n'y a eu aucun problème, la ressource est correctement configurée.
        }
      } else {
        // On va voir si c'est un autre type.
      }
      //------ OSRM

      // Si ce n'est aucun type valide, on renvoie une erreur.
      if (!available) {
        LOGGER.error("La ressource indique un type invalide: " + resourceJsonObject.resource.type);
        return false;
      }
    }

    LOGGER.info("Fin de la verification de la ressource.");
    return true;

  },


  /**
  *
  * @function
  * @name checkResourceOsrm
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une ressource osrm.
  *
  */

  checkResourceOsrm: function(resourceJsonObject) {

    LOGGER.info("Verification de la ressource osrm...");

    LOGGER.info("Fin de la verification de la ressource osrm.");
    return true;

  }


}
