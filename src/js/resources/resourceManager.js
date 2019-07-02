'use strict';

const storageManager = require('../utils/storageManager');
const osrmResource = require('../resources/osrmResource');
const pgrResource = require('../resources/pgrResource');
const fs = require('fs');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("RESOURCEMANAGER");

module.exports = class resourceManager {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe resourceManager
  *
  */
  constructor() {

    // Liste des ids des ressources vérifiées par le manager
    this._listOfVerifiedResourceIds = new Array();

    // Liste des ids des ressources gérées par le manager
    this._listOfResourceIds = new Array();

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
  * @param {object} sourceManager - Manager de source du service
  * @param {object} operationManager - Manager d'opération du service
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

  checkResource(resourceJsonObject, sourceManager, operationManager) {

    LOGGER.info("Verification de la ressource...");

    if (!resourceJsonObject.resource.id) {
      LOGGER.error("Le fichier ne contient pas d'objet resource");
      return false;
    }

    // ID
    if (!resourceJsonObject.resource.id) {
      LOGGER.error("La ressource ne contient pas d'id.");
      return false;
    } else {
      LOGGER.info("Ressource id: " + resourceJsonObject.resource.id);
      // On vérifie que l'id de la ressource n'est pas déjà pris par une autre ressource.
      if (this._listOfVerifiedResourceIds.length !== 0) {
        for (let i = 0; i < this._listOfVerifiedResourceIds.length; i++ ) {
          if (this._listOfVerifiedResourceIds[i] === resourceJsonObject.resource.id) {
            LOGGER.error("Une ressource contenant l'id " + resourceJsonObject.resource.id + " a deja ete verifiee. Cette ressource ne peut donc etre ajoutee.");
            return false;
          }
        }
      } else {
        // C'est la première ressource.
      }
    }

    // Type
    if (!resourceJsonObject.resource.type) {
      LOGGER.error("La ressource ne contient pas de type.");
      return false;
    } else {
      // Vérification que le type est valide puis vérification spécifique à chaque type
      let available = false;
      // La partie délimitée peut être copié-collée pour ajouter un nouveau type.
      // Il ne reste plus qu'à créer la fonction de vérification correspondante.
      //------ OSRM
      if (resourceJsonObject.resource.type === "osrm") {
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
      //------ PGR
      if (resourceJsonObject.resource.type === "pgr") {
        available = true;
        LOGGER.info("Ressource pgrouting.");
        if (!this.checkResourcePgr(resourceJsonObject.resource, sourceManager)) {
          LOGGER.error("Erreur lors de la verification de la ressource pgr.");
          return false;
        } else {
          // il n'y a eu aucun problème, la ressource est correctement configurée.
        }
      } else {
        // On va voir si c'est un autre type.
      }
      //------ PGR

      // Si ce n'est aucun type valide, on renvoie une erreur.
      if (!available) {
        LOGGER.error("La ressource indique un type invalide: " + resourceJsonObject.resource.type);
        return false;
      }
    }

    let currentAvailableOp = new Array();
    // availableOperations
    if (!resourceJsonObject.resource.availableOperations) {
      LOGGER.error("La ressource ne contient pas de availableOperations.");
      return false;
    } else {
      // on fait la vérification via le operationManager
      if (!operationManager.checkResourceOperationConf(resourceJsonObject.resource.availableOperations)) {
        LOGGER.error("Mauvaise configuration des operations dans la ressource.");
        return false;
      } else {
        // on récupère la liste des opérations validées pour cette ressource
        if (!operationManager.getResourceOperationConf(resourceJsonObject.resource.availableOperations, currentAvailableOp)) {
          LOGGER.error("Impossible de recuperer les operations de la ressource.");
          return false;
        }
      }
    }

    // Sources
    if (!resourceJsonObject.resource.sources) {
      LOGGER.error("La ressource ne contient pas de sources.");
      return false;
    } else {

      LOGGER.info("Verification des sources...")

      for (let i = 0; i < resourceJsonObject.resource.sources.length; i++ ) {

        let sourceJsonObject = resourceJsonObject.resource.sources[i];
        if (!sourceManager.checkSource(sourceJsonObject, operationManager, currentAvailableOp)) {
          LOGGER.error("La ressource contient une source invalide.");
          return false;
        } else {
          // on ne fait rien
        }

      }
    }

    // on sauvegarde l'id de la ressource pour savoir qu'elle a déjà été vérifiée et que sa description est valide
    this._listOfVerifiedResourceIds.push(resourceJsonObject.resource.id);

    LOGGER.info("Fin de la verification de la ressource.");
    return true;

  }


  /**
  *
  * @function
  * @name checkResourceOsrm
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une ressource osrm.
  * @param {json} resourceJsonObject - Description JSON de la ressource
  * @param {object} sourceManager - Manager de source du service
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
      // Bbox de la topologie
      if (!resourceJsonObject.topology.bbox) {
        LOGGER.error("La ressource ne contient pas d'information sur la bbox de la topologie.")
        return false;
      } else {
        // TODO: vérifier la bbox
      }
    }

    LOGGER.info("Fin de la verification de la ressource osrm.");
    return true;

  }

  /**
  *
  * @function
  * @name checkResourcePgr
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une ressource pgr.
  * @param {json} resourceJsonObject - Description JSON de la ressource
  * @param {object} sourceManager - Manager de source du service
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  * TODO: c'est une copie conforme de checkResourceOsrm, c'est pas terrible (à factoriser ou spécialiser)
  */

  checkResourcePgr(resourceJsonObject, sourceManager) {

    LOGGER.info("Verification de la ressource pgr...");

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
    }

    // Description de la topologie
    if (!resourceJsonObject.topology.description) {
      LOGGER.error("La ressource ne contient pas de description de la topologie.");
      return false;
    } else {
      // rien à faire
    }

    // Projection de la topologie
    if (!resourceJsonObject.topology.projection) {
      LOGGER.error("La ressource ne contient pas d'information sur la projection de la topologie.")
      return false;
    } else {
      // TODO: vérifier la projection
    }
    // Bbox de la topologie
    if (!resourceJsonObject.topology.bbox) {
      LOGGER.error("La ressource ne contient pas d'information sur la bbox de la topologie.")
      return false;
    } else {
      // TODO: vérifier la bbox
    }

    // Stockage de la topologie
    if (!resourceJsonObject.topology.storage) {
      LOGGER.error("La ressource ne contient pas d'information sur le stockage du fichier de generation de la topologie.");
      return false;
    }

    if (!resourceJsonObject.topology.storage.base) {
      LOGGER.error("La ressource ne contient pas de parametre 'topology.storage.base'.");
      return false;
    }

    // dbConfig
    if (!resourceJsonObject.topology.storage.base.dbConfig) {
      LOGGER.error("La ressource ne contient pas de parametre 'topology.storage.dbConfig'.");
      return false;
    } else {
      try {
        fs.accessSync(resourceJsonObject.topology.storage.base.dbConfig, fs.constants.R_OK);
      } catch (err) {
        LOGGER.error("Le fichier " + resourceJsonObject.topology.storage.base.dbConfig + " ne peut etre lu.");
        return false;
      }
    }

    // table
    if (!resourceJsonObject.topology.storage.base.table) {
      LOGGER.error("La ressource ne contient pas de parametre 'topology.storage.base.table'.");
      return false;
    } else {
      // TODO: vérification que ce n'est pas du code injecté
    }

    // Attributs
    if (resourceJsonObject.topology.storage.base.attributes) {

      // on vérifie que c'est un tableau
      if (!Array.isArray(resourceJsonObject.topology.storage.base.attributes)) {
        LOGGER.error("Le parametre resource.topology.attributes n'est pas un tableau.");
        return false;
      }

      // que le tableau n'est pas vide
      if (resourceJsonObject.topology.storage.base.attributes.length === 0) {
        LOGGER.error("Le parametre resource.topology.attributes est un tableau vide.");
        return false;
      }

      // on va vérifier que chaque attribut est complet et unique dans sa description
      let attributesKeyTable = new Array();
      let attributesColumnTable = new Array();

      for (let i = 0; i < resourceJsonObject.topology.storage.base.attributes.length; i++) {
        let curAttribute = resourceJsonObject.topology.storage.base.attributes[i];


        if (!curAttribute.key) {
          LOGGER.error("La description de l'attribut est incomplete: key");
          return false;
        } else {

          if (attributesKeyTable.length !== 0) {
            for (let j = 0; j < attributesKeyTable.length; j++) {
              if (curAttribute.key === attributesKeyTable[j]) {
                LOGGER.error("La description de l'attribut indique une cle deja utilisee.");
                return false;
              }
            }
          }

        }

        if (!curAttribute.column) {
          LOGGER.error("La description de l'attribut est incomplete: column");
          return false;
        } else {

          if (attributesColumnTable.length !== 0) {
            for (let j = 0; j < attributesColumnTable.length; j++) {
              if (curAttribute.column === attributesColumnTable[j]) {
                LOGGER.error("La description de l'attribut indique une colonne deja utilisee.");
                return false;
              }
            }
          }

          // TODO: vérification que ce n'est pas du code injecté

        }

        if (!curAttribute.default) {
          LOGGER.error("La description de l'attribut est incomplete: default");
          return false;
        } else {

          if (curAttribute.default !== "true" && curAttribute.default !== "false") {
            LOGGER.error("La description de l'attribut a un parametre 'default' incorrect.");
            return false;
          }

        }

        attributesKeyTable.push(curAttribute.key);
        attributesColumnTable.push(curAttribute.column);

      }
    } else {
      // rien à faire
    }

    LOGGER.info("Fin de la verification de la ressource pgr.");
    return true;
  }


  /**
  *
  * @function
  * @name createResource
  * @description Fonction utilisée pour créer une ressource.
  * @param {json} resourceJsonObject - Description JSON de la ressource
  * @param {object} operationManager - Manager d'opération du service
  * @return {Resource} Ressource créée
  *
  */

  createResource(resourceJsonObject, operationManager) {

    let resource;

    if (!resourceJsonObject.resource.id) {
      LOGGER.error("La ressource ne contient pas d'id.");
      return null;
    }

    LOGGER.info("Creation de la ressource: " + resourceJsonObject.resource.id);

    // On vérifie que la ressource a bien été vérifiée et validée
    if (this._listOfVerifiedResourceIds.length !== 0) {
      for (let i = 0; i < this._listOfVerifiedResourceIds.length; i++ ) {
        if (this._listOfVerifiedResourceIds[i] === resourceJsonObject.resource.id) {
          LOGGER.info("La ressource contenant l'id " + resourceJsonObject.resource.id + " a deja ete verifiee.");
          break;
        }
      }
    } else {
      LOGGER.error("Tentative de creation d'une ressource sans verification prealable. Cette ressource ne peut donc etre creee.");
      return null;
    }

    // On vérifie que la ressource n'a pas déjà été créée
    if (this._listOfResourceIds.length !== 0) {
      for (let i = 0; i < this._listOfResourceIds.length; i++ ) {
        if (this._listOfResourceIds[i] === resourceJsonObject.resource.id) {
          LOGGER.error("Une ressource contenant l'id " + resourceJsonObject.resource.id + " existe deja. Cette ressource ne peut donc etre creee.");
          return null;
        }
      }
    } else {
      // C'est la première ressource.
    }

    // Création des opérations
    // ---

    let resourceOperationHash = {};

    if (!operationManager.createResourceOperation(resourceOperationHash, resourceJsonObject)) {
      LOGGER.error("Erreur lors de la creation des operations de la ressource");
      return null;
    } else {
      // on continue
    }

    // ---

    if (resourceJsonObject.resource.type === "osrm") {
      resource = new osrmResource(resourceJsonObject, resourceOperationHash);
    } else if (resourceJsonObject.resource.type === "pgr") {
      resource = new pgrResource(resourceJsonObject, resourceOperationHash);
    } else {
      // On va voir si c'est un autre type.
    }

    // on sauvegarde l'id de la ressource pour savoir qu'elle a déjà été créée
    this._listOfResourceIds.push(resourceJsonObject.resource.id);

    return resource;
  }


}
