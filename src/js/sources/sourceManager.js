'use strict';

const assert = require('assert').strict;
const storageManager = require('../utils/storageManager');
const errorManager = require('../utils/errorManager');
const osrmSource = require('../sources/osrmSource');
const pgrSource = require('../sources/pgrSource');
const smartroutingSource = require('../sources/smartroutingSource');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("SOURCEMANAGER");

module.exports = class sourceManager {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe sourceManager
  *
  */
  constructor() {

    // Liste des ids des sources gérées par le manager
    this._listOfSourceIds = new Array();

    // Description des sources conservées de manière unique dans _listOfSourceIds
    this._sourceDescriptions = {};

    // Correspondance entre l'id d'une source et l'id de la topologie dont elle dérive
    this._sourceTopology = {};

    // Correspondance entre l'id d'une source et l'id des ressources où elle est utilisée
    this._sourceUsage = {};

  }

  /**
  *
  * @function
  * @name get listOfSourceIds
  * @description Récupérer l'ensemble des ids de sources
  *
  */
  get listOfSourceIds() {
    return this._listOfSourceIds;
  }

  /**
  *
  * @function
  * @name get sourceTopology
  * @description Récupérer la correspondance source/topologie
  *
  */
  get sourceTopology() {
    return this._sourceTopology;
  }

  /**
  *
  * @function
  * @name get sourceDescriptions
  * @description Récupérer l'ensemble des descriptions des sources conservées
  *
  */
  get sourceDescriptions() {
    return this._sourceDescriptions;
  }

  /**
  *
  * @function
  * @name get sourceUsage
  * @description Récupérer l'ensemble des correspondances de sources
  *
  */
  get sourceUsage() {
    return this._sourceUsage;
  }

  /**
  *
  * @function
  * @name listOfUsage
  * @description Récupérer l'ensemble des id de ressources utilisant une source
  * @param {string} id - Id de la source 
  * @return {table} Liste des id de ressource 
  *
  */
  listOfUsage(id) {
    return this._sourceUsage[id];
  }

  /**
  *
  * @function
  * @name removeSource
  * @description Supprimer une source
  * @param {string} id - Id de la source 
  * @return {boolean} 
  *
  */
  removeSource(id) {

    let index = this._listOfSourceIds.indexOf(id);
    if (index !== -1) {
      this._listOfSourceIds.splice(index,1);
    } else {
      return false;
    }
    
    if (!delete this._sourceDescriptions[id]) {
      return false;
    }
    if (!delete this._sourceTopology[id]) {
      return false;
    }
    if (!delete this._sourceUsage[id]) {
      return false;
    }

    return true;
  }

    /**
  *
  * @function
  * @name addUsage
  * @description Ajouter l'usage, via l'id, d'une ressource pour une source
  * @param {string} sourceId - Id de la source 
  * @param {string} resourceId - Id de la ressource 
  * @return {boolean} 
  *
  */
  addUsage(sourceId, resourceId) {
    if (!this._sourceUsage[sourceId]) {
      this._sourceUsage[sourceId] = new Array();
    } 
    if (!Array.isArray(this._sourceUsage[sourceId])) {
      return false;
    }
    this._sourceUsage[sourceId].push(resourceId);
    return true;
  }

  /**
  *
  * @function
  * @name set listOfSourceIds
  * @description Attribuer l'ensemble des ids de sources
  * @param {table} list - État de la connexion
  *
  */
  set listOfSourceIds(list) {
    this._listOfSourceIds = list;
  }

  /**
  *
  * @function
  * @name set sourceDescriptions
  * @description Attribuer l'ensemble des descriptions des sources conservées
  * @param {object} descriptions - Objet contenant les descriptions
  *
  */
  set sourceDescriptions(descriptions) {
    this._sourceDescriptions = descriptions;
  }

  /**
  *
  * @function
  * @name getSourceDescriptionById
  * @description Récupérer la description de la source indiquée par son id
  * @param {string} id - Id de la source
  *
  */
  getSourceDescriptionById(id) {
    if (this._sourceDescriptions[id]) {
      return this._sourceDescriptions[id];
    } else {
      return {};
    }

  }

  /**
  *
  * @function
  * @name getSourceTopology
  * @description Récupérer l'id de la topologie dont dérive une source
  * @param {string} sourceId - Id de la source
  * @return {string} Id d'une topologie
  *
  */

  getSourceTopology(sourceId) {

    if(this._sourceTopology[sourceId]) {
      return this._sourceTopology[sourceId];
    } else {
      return "";
    }

  }

  /**
  *
  * @function
  * @name checkSource
  * @description Fonction utilisée pour vérifier la partie source d'un fichier de description d'une ressource.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @param {object} operationManager - Le manager des opérations du service
  * @param {table} resourceOperationTable - Tableau contenant l'ensemble des id d'opérations disponibles pour cette ressource
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

  checkSource(sourceJsonObject, operationManager, resourceOperationTable) {

    LOGGER.info("Verification de la source...");

    // ID
    if (!sourceJsonObject.id) {
      LOGGER.error("La ressource contient une source sans id.");
      return false;
    } else {
      // On vérifie que l'id n'est pas déjà pris.
      if (this._listOfSourceIds.length !== 0) {

        let present = false;

        for (let i = 0; i < this._listOfSourceIds.length; i++ ) {
          if (this._listOfSourceIds[i] === sourceJsonObject.id) {
            LOGGER.info("La source contenant l'id " + sourceJsonObject.id + " est deja referencee.");
            // On vérifie que la source décrite et celle déjà identifiée soient exactement les mêmes
            if (this.checkDuplicationSource(sourceJsonObject)) {
              present = true;
              break;
            } else {
              LOGGER.error("La source contenant l'id " + sourceJsonObject.id + " n'est pas identique à la source deja identifiee.");
              return false;
            }

          } else {
            // on continue la boucle de vérification
          }
        }

      } else {
        // C'est la première source.
      }
    }

    // Type
    if (!sourceJsonObject.type) {
      LOGGER.error("La ressource contient une source sans type.");
      return false;
    } else {
      // Vérification que le type est valide puis vérification spécifique à chaque type
      let available = false;
      // La partie délimitée peut être copié-collée pour ajouter un nouveau type.
      // Il ne reste plus qu'à créer la fonction de vérification correspondante.
      //------ OSRM
      if (sourceJsonObject.type === "osrm") {
        available = true;
        LOGGER.info("Source osrm.");

        let operationFound = false;

        // On vérifie que le module osrm est disponible 
        try {
          let osrmTest = require('osrm');
        } catch(error) {
          LOGGER.error("Le module osrm n'est pas disponible mais une source osrm est proposée dans la configuration.");
          return false;
        }

        // On vérifie que les opérations possibles sur ce type de source soient disponibles dans l'instance du service
        if (operationManager.verifyAvailabilityOperation("route")) {
          // On vérifie que les opérations possibles sur ce type de source soient disponibles pour la ressource
          if (operationManager.isAvailableInTable("route", resourceOperationTable)) {
            operationFound = true;
          } else {
            // on continue pour voir la suite 
          }
        } else {
          // on continue pour voir la suite 
        }

        if (!operationFound) {
          LOGGER.error("Le service ne propose pas d'operations disponibles pour ce type de source (ex. route), il n'est donc pas possible de charger cette source.");
          return false;
        }

        if (!this.checkSourceOsrm(sourceJsonObject)) {
          LOGGER.error("Erreur lors de la verification de la source osrm.");
          return false;
        } else {
          // il n'y a eu aucun problème, la ressource est correctement configurée.
        }
      } else {
        // On va voir si c'est un autre type.
      }
      //------ OSRM
      //------ PGR
      if (sourceJsonObject.type === "pgr") {
        available = true;
        LOGGER.info("Source pgrouting.");

        // On vérifie que le module pg est disponible 
        try {
          let { poolTest } = require('pg');
        } catch(error) {
          LOGGER.error("Le module pg n'est pas disponible mais une source pgrouting est proposée dans la configuration.");
          return false;
        }

        let operationFound = false;

        // On vérifie que les opérations possibles sur ce type de source soient disponibles dans l'instance du service
        if (operationManager.verifyAvailabilityOperation("route")) {
          // On vérifie que les opérations possibles sur ce type de source soient disponibles pour la ressource
          if (operationManager.isAvailableInTable("route", resourceOperationTable)) {
            operationFound = true;
          } else {
            // on continue pour voir la suite 
          }
        } else {
          // on continue pour voir la suite 
        }

        // On vérifie que les opérations possibles sur ce type de source soient disponibles dans l'instance du service
        if (operationManager.verifyAvailabilityOperation("isochrone")) {
          // On vérifie que les opérations possibles sur ce type de source soient disponibles pour la ressource
          if (operationManager.isAvailableInTable("isochrone", resourceOperationTable)) {
            operationFound = true;
          } else {
            // on continue pour voir la suite 
          }
        } else {
          // on continue pour voir la suite 
        }

        if (!operationFound) {
          LOGGER.error("Le service ne propose pas d'operations disponibles pour ce type de source (ex. route, isochrone), il n'est donc pas possible de charger cette source.");
          return false;
        }

        if (!this.checkSourcePgr(sourceJsonObject)) {
          LOGGER.error("Erreur lors de la verification de la source pgr.");
          return false;
        } else {
          // il n'y a eu aucun problème, la ressource est correctement configurée.
        }
      } else {
        // On va voir si c'est un autre type.
      }
      //------ PGR
      //------ SMARTROUTING
      if (sourceJsonObject.type === "smartrouting") {
        available = true;
        LOGGER.info("Source smartrouting.");

        let operationFound = false;

        // On vérifie que les opérations possibles sur ce type de source soient disponibles dans l'instance du service
        if (operationManager.verifyAvailabilityOperation("route")) {
          // On vérifie que les opérations possibles sur ce type de source soient disponibles pour la ressource
          if (operationManager.isAvailableInTable("route", resourceOperationTable)) {
            operationFound = true;
          } else {
            // on continue pour voir la suite 
          }
        } else {
          // on continue pour voir la suite 
        }

        // On vérifie que les opérations possibles sur ce type de source soient disponibles dans l'instance du service
        if (operationManager.verifyAvailabilityOperation("isochrone")) {
          // On vérifie que les opérations possibles sur ce type de source soient disponibles pour la ressource
          if (operationManager.isAvailableInTable("isochrone", resourceOperationTable)) {
            operationFound = true;
          } else {
            // on continue pour voir la suite 
          }
        } else {
          // on continue pour voir la suite 
        }

        if (!operationFound) {
          LOGGER.error("Le service ne propose pas d'operations disponibles pour ce type de source (ex. route, isochrone), il n'est donc pas possible de charger cette source.");
          return false;
        }

        if (!this.checkSourceSmartrouting(sourceJsonObject)) {
          LOGGER.error("Erreur lors de la verification de la source smartrouting.");
          return false;
        } else {
          // il n'y a eu aucun problème, la ressource est correctement configurée.
        }
      } else {
        // On va voir si c'est un autre type.
      }
      //------ SMARTROUTING

      // Si ce n'est aucun type valide, on renvoie une erreur.
      if (!available) {
        LOGGER.error("La source indique un type invalide: " + sourceJsonObject.type);
        return false;
      }
    }

    this._listOfSourceIds.push(sourceJsonObject.id);
    this._sourceDescriptions[sourceJsonObject.id] = sourceJsonObject;

    LOGGER.info("Fin de la verification de la source.");
    return true;

  }

  /**
  *
  * @function
  * @name checkSourceOsrm
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une source osrm.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

  checkSourceOsrm(sourceJsonObject) {

    LOGGER.info("Verification de la source osrm...");

    // Storage
    if (!sourceJsonObject.storage) {
      LOGGER.error("La ressource contient une source sans stockage.");
      return false;
    } else {
      if (!storageManager.checkJsonStorage(sourceJsonObject.storage)) {
        LOGGER.error("Stockage de la source incorrect.");
        return false;
      } else {
        // Normalement, il n'y a plus rien à faire car la fonction checkDuplicationSource() vérifie déjà que la source n'est pas dupliquée
      }
    }

    // Cost
    if (!sourceJsonObject.cost) {
      LOGGER.error("La ressource contient une source sans cout.");
      return false;
    } else {
      // Profile
      if (!sourceJsonObject.cost.profile) {
        LOGGER.error("La ressource contient une source sans profile.");
        return false;
      } else {
        // rien à faire
      }
      // Optimization
      if (!sourceJsonObject.cost.optimization) {
        LOGGER.error("La ressource contient une source sans optimization.");
        return false;
      } else {
        // rien à faire
      }
      // Compute
      if (!sourceJsonObject.cost.compute) {
        LOGGER.info("La ressource contient une source sans compute.");
      } else {
        if (!sourceJsonObject.cost.compute.storage) {
          LOGGER.error("La ressource contient une source ayant un cout sans stockage.");
          return false;
        } else {
          if (!storageManager.checkJsonStorage(sourceJsonObject.cost.compute.storage)) {
            LOGGER.warn("La ressource contient une source ayant un stockage du cout incorrect.");
          } else {
            // rien à faire
          }
        }
        //TODO: ajouter la vérification de configuration
      }
    }

    LOGGER.info("Fin de la verification de la source osrm.");
    return true;
  }

  /**
  *
  * @function
  * @name checkSourcePgr
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une source pgr.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

 checkSourcePgr(sourceJsonObject) {

  LOGGER.info("Verification de la source pgr...");

  // Storage
  if (!sourceJsonObject.storage) {
    LOGGER.error("La ressource contient une source sans stockage.");
    return false;
  } else {
    if (!storageManager.checkJsonStorage(sourceJsonObject.storage)) {
      LOGGER.error("Stockage de la source incorrect.");
      return false;
    } else {
      // Normalement, il n'y a plus rien à faire car la fonction checkDuplicationSource() vérifie déjà que la source n'est pas dupliquée
    }
  }

  // Cost
  if (!sourceJsonObject.cost) {
    LOGGER.error("La ressource contient une source sans cout.");
    return false;
  } else {
    // Profile
    if (!sourceJsonObject.cost.profile) {
      LOGGER.error("La ressource contient une source sans profile.");
      return false;
    } else {
      // rien à faire
    }
    // Optimization
    if (!sourceJsonObject.cost.optimization) {
      LOGGER.error("La ressource contient une source sans optimization.");
      return false;
    } else {
      // rien à faire
    }
    // Compute
    if (!sourceJsonObject.cost.compute) {
      LOGGER.info("La ressource contient une source sans compute.");
    } else {
      if (!sourceJsonObject.cost.compute.storage) {
        LOGGER.error("La ressource contient une source ayant un cout sans stockage.");
        return false;
      } else {
        if (!storageManager.checkJsonStorage(sourceJsonObject.cost.compute.storage)) {
          LOGGER.error("La ressource contient une source ayant un stockage du cout incorrect.");
          return false;
        } else {
          // rien à faire
        }
      }
      // TODO: ajouter la vérification de configuration
    }
  }

  LOGGER.info("Fin de la verification de la source pgr.");
  return true;
}

  /**
  *
  * @function
  * @name checkSourceSmartrouting
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une source pgr.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

   checkSourceSmartrouting(sourceJsonObject) {

    LOGGER.info("Verification de la source smartrouting...");
  
    // Storage
    if (!sourceJsonObject.storage) {
      LOGGER.error("La ressource contient une source sans stockage.");
      return false;
    } else {
      if (!storageManager.checkJsonStorage(sourceJsonObject.storage)) {
        LOGGER.error("Stockage de la source incorrect.");
        return false;
      } else {
        // Normalement, il n'y a plus rien à faire car la fonction checkDuplicationSource() vérifie déjà que la source n'est pas dupliquée
      }
    }
  
    LOGGER.info("Fin de la verification de la source smartrouting.");
    return true;
  }

  /**
  *
  * @function
  * @name checkDuplicationSource
  * @description Fonction utilisée pour vérifier que le contenu d'un fichier de description d'une source est bien le même qu'un autre.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

  checkDuplicationSource(sourceJsonObject) {

    LOGGER.info("Comparaison des deux sources identifiees et devant etre identiques...");

    // On récupère la description de la source faisant office de référence car lue la première.
    let referenceSource = this._sourceDescriptions[sourceJsonObject.id];

    // On compare les deux objets
    try {
      assert.deepStrictEqual(sourceJsonObject, referenceSource);
    } catch (err) {
      LOGGER.error("Les deux sources ne sont pas identiques.");
      LOGGER.debug(err);
      return false;
    }

    LOGGER.info("Les deux sources sont identiques.");
    return true;

  }

  /**
  *
  * @function
  * @name createSource
  * @description Fonction utilisée pour créer une source.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @param {Topology} topology - Instance de la classe Topology
  * @return {Source} Source créée
  *
  */

  createSource(sourceJsonObject, topology) {

    LOGGER.info("Creation de la source: " + sourceJsonObject.id);

    let source;

    if (sourceJsonObject.type === "osrm") {
      source = new osrmSource(sourceJsonObject, topology);
    } else if (sourceJsonObject.type === "pgr") {
      source = new pgrSource(sourceJsonObject, topology);
    } else if (sourceJsonObject.type === "smartrouting") {
      // smartrouting n'utilise pas la topologie définie dans la conf
      source = new smartroutingSource(sourceJsonObject);
    } else {
      // On va voir si c'est un autre type.
    }
    return source;
  }

  /**
  *
  * @function
  * @name connectSource
  * @description Fonction utilisée pour connecter une source.
  * @param {Source} source - Objet Source ou hérité de la classe Source
  *
  */
  async connectSource(source) {

    LOGGER.info("Connexion a la source: " + source.id);
    try {
      await source.connect();
      LOGGER.info("Source connectee.");
    } catch (err) {
      LOGGER.error("Impossible de connecter la source.", err);
      throw errorManager.createError("Impossible de connecter la source.");
    }
  }

  /**
  *
  * @function
  * @name disconnectSource
  * @description Fonction utilisée pour déconnecter une source.
  * @param {Source} source - Objet Source ou hérité de la classe Source
  *
  */
  async disconnectSource(source) {
    LOGGER.info("Déconnection de la source: " + source.id);
    try {
      await source.disconnect();
      LOGGER.info("Source déconnectee.");
    } catch (err) {
      LOGGER.error("Impossible de déconnecter la source.", err);
      throw errorManager.createError("Impossible de déconnecter la source.");
    }
  }

}
