'use strict';

const osrmResource = require('../resources/osrmResource');
const pgrResource = require('../resources/pgrResource');
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

  checkResource(resourceJsonObject, sourceManager, operationManager, topologyManager) {

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
        if (!this.checkResourceOsrm(resourceJsonObject.resource)) {
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
        if (!this.checkResourcePgr(resourceJsonObject.resource)) {
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

    // Topology
    if (!resourceJsonObject.resource.topology) {
      LOGGER.error("La ressource ne contient pas de topologie.");
      return false;
    } else {
      if (!topologyManager.checkTopology(resourceJsonObject.resource.topology)) {
        LOGGER.error("La ressource contient une topologie incorrecte.");
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

        // Lien avec la topologie
        // TODO: vérifier que le type de la topologie soit cohérent avec le type de la source 

        // On stocke la correspondance entre une source et la topologie dont elle dérive
        sourceManager.sourceTopology[sourceJsonObject.id] = resourceJsonObject.resource.topology.id;

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
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */
  checkResourceOsrm(resourceJsonObject) {

    LOGGER.info("Verification de la ressource osrm...");

    // Description
    if (!resourceJsonObject.description) {
      LOGGER.error("La ressource ne contient pas de description.");
      return false;
    } else {
      // rien à faire
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
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  * TODO: c'est une copie conforme de checkResourceOsrm, c'est pas terrible (à factoriser ou spécialiser)
  */

  checkResourcePgr(resourceJsonObject) {

    LOGGER.info("Verification de la ressource pgr...");

    // Description
    if (!resourceJsonObject.description) {
      LOGGER.error("La ressource ne contient pas de description.");
      return false;
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
