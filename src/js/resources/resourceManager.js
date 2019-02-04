'use strict';

const fs = require('fs');
const path = require('path');
var storageManager = require('../utils/storageManager');
var SourceManager = require('../sources/sourceManager');
var osrmResource = require('../resources/osrmResource');

// Création du LOGGER
var LOGGER = global.log4js.getLogger("RESOURCEMANAGER");

module.exports = class resourceManager {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe resourceManager
  *
  */
  constructor() {

    // Liste des ids des ressources gérées par le manager
    this._listOfResourceIds = [];

  }

  /**
  *
  * @function
  * @name get listOfResourceIds
  * @description Récupérer l'ensemble des ids de ressources
  *
  */
  get listOfResourceIds() {
    return this._listOfResourceIds;
  }

  /**
  *
  * @function
  * @name checkResource
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une ressource.
  * @param {json} resourceJsonObject - Description JSON de la ressource
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

  checkResource(resourceJsonObject, sourceManager) {

    LOGGER.info("Verification de la ressource...");

    // ID
    if (!resourceJsonObject.resource.id) {
      LOGGER.error("La ressource ne contient pas d'id.");
      return false;
    } else {
      LOGGER.info("Ressource id: " + resourceJsonObject.resource.id);
      // On vérifie que l'id de la ressource n'est pas déjà pris par une autre ressource.
      if (this._listOfResourceIds.length != 0) {
        for (var i = 0; i < this._listOfResourceIds.length; i++ ) {
          if (this._listOfResourceIds[i] == resourceJsonObject.resource.id) {
            LOGGER.error("Une ressource contenant l'id " + resourceJsonObject.resource.id + " existe deja. Cette ressource ne peut donc etre ajoutee.");
            return false;
          }
        }
        this._listOfResourceIds.push(resourceJsonObject.resource.id);
      } else {
        // C'est la première ressource.
        this._listOfResourceIds.push(resourceJsonObject.resource.id);
      }
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
        if (!this.checkResourceOsrm(resourceJsonObject.resource, sourceManager)) {
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

  }


  /**
  *
  * @function
  * @name checkResourceOsrm
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une ressource osrm.
  * @param {json} resourceJsonObject - Description JSON de la ressource
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

  checkResourceOsrm(resourceJsonObject, sourceManager) {

    LOGGER.info("Verification de la ressource osrm...");

    // Description
    if (!resourceJsonObject.description) {
      LOGGER.error("La ressource ne contient pas de description.");
      return false;
    } else {
      // rien à faire
    }

    // Topology
    if (!resourceJsonObject.topology) {
      LOGGER.error("La ressource ne contient pas de topologie.");
      return false;
    } else {
      // Description de la topologie
      if (!resourceJsonObject.topology.description) {
        LOGGER.error("La ressource ne contient pas de description de la topologie.");
        return false;
      } else {
        // rien à faire
      }
      // Stockage de la topologie
      if (!resourceJsonObject.topology.storage) {
        LOGGER.error("La ressource ne contient pas d'information sur le stockage du fichier de generation de la topologie.");
        return false;
      } else {
        if (!storageManager.checkJsonStorage(resourceJsonObject.topology.storage)) {
          LOGGER.error("Stockage de la topologie incorrect.");
          return false;
        } else {
          // rien à faire
        }
      }
      // Projection de la topologie
      if (!resourceJsonObject.topology.projection) {
        LOGGER.error("La ressource ne contient pas d'information sur la projection de la topologie.")
        return false;
      } else {
        // TODO: vérifier la projection
      }
    }

    // Sources
    if (!resourceJsonObject.sources) {
      LOGGER.error("La ressource ne contient pas de sources.");
      return false;
    } else {

      LOGGER.info("Verification des sources...")

      for (var i = 0; i < resourceJsonObject.sources.length; i++ ) {

        var sourceJsonObject = resourceJsonObject.sources[i];
        if (!sourceManager.checkSource(sourceJsonObject)) {
          LOGGER.error("La ressource contient une source invalide.");
          return false;
        } else {
          // on ne fait rien
        }

      }
    }

    // AvailableOperations
    if (!resourceJsonObject.availableOperations) {
      LOGGER.error("La ressource ne contient pas de descriptions sur les operations possibles.");
      return false;
    } else {

    }

    // DefaultSourceId
    if (!resourceJsonObject.defaultSourceId) {
      LOGGER.error("La ressource ne contient pas un id de source par defaut.");
      return false;
    } else {

      var foundId = false;

      for (var i = 0; i < resourceJsonObject.sources.length; i++ ) {
        var sourceJsonObject = resourceJsonObject.sources[i];

        if (sourceJsonObject.id == resourceJsonObject.defaultSourceId) {
          foundId = true;
          break;
        }
      }
      if (!foundId) {
        LOGGER.error("L'id par defaut de la ressource ne correspond a aucun id de sources definies.");
        return false;
      }

    }

    // DefaultProjection
    if (!resourceJsonObject.defaultProjection) {
      LOGGER.warn("La ressource ne contient pas de projection par défaut. C'est celle de la topologie qui sera utilisee.");
    } else {
      // TODO: vérification de la disponibilité et de la cohérence avec la projection de la topologie.
    }

    // BoundingBox
    if (!resourceJsonObject.boundingBox) {
      LOGGER.warn("La ressource ne contient pas de boundingBox.");
    } else {
      // TODO: vérification géométrique et cohérence avec la projection par défaut ou de la topologie.
    }

    // AvailableProjection
    if (!resourceJsonObject.availableProjections) {
      LOGGER.warn("La ressource ne contient pas de projections rendues disponibles. C'est celle de la topologie qui sera utilisee.");
    } else {
      // TODO: vérification de la disponibilité et de la cohérence avec la projection de la topologie.
    }

    LOGGER.info("Fin de la verification de la ressource osrm.");
    return true;

  }

  /**
  *
  * @function
  * @name createResource
  * @description Fonction utilisée pour créer une ressource.
  * @param {json} resourceJsonObject - Description JSON de la ressource
  * @return {Resource} Ressource créée
  *
  */

  createResource(resourceJsonObject) {

    LOGGER.info("Creation de la ressource: " + resourceJsonObject.resource.id);

    var resource;

    if (resourceJsonObject.resource.type == "osrm") {
      resource = new osrmResource(resourceJsonObject);
    } else {
      // On va voir si c'est un autre type.
    }

    return resource;
  }


}
