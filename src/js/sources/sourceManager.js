'use strict';

const assert = require('assert').strict;
const storageManager = require('../utils/storageManager');
const errorManager = require('../utils/errorManager');
const osrmSource = require('../sources/osrmSource');
const pgrSource = require('../sources/pgrSource');
const smartroutingSource = require('../sources/smartroutingSource');
const valhallaSource = require('../sources/valhallaSource');
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

    // Liste des ids des sources chargées par le manager
    this._loadedSourceId = new Array();

    // Liste des ids des sources vérifiées par le manager
    this._checkedSourceId = new Array();

    // Catalogue des sources du manager
    this._source = {};

    // Descriptions des sources chargées par le manager
    this._loadedSourceConfiguration = {};

    // Descriptions des sources vérifiées par le manager
    this._checkedSourceConfiguration = {};

    // Correspondance entre l'id d'une source et l'id de la topologie dont elle dérive
    this._sourceTopology = {};

    // Correspondance entre les sources et les opérations possibles 
    this._operationsByType = {
      "osrm": ["nearest", "route"],
      "pgr": ["route", "isochrone"],
      "smartrouting": ["route", "isochrone"]
    };

  }

  /**
  *
  * @function
  * @name get loadedSourceId
  * @description Récupérer l'ensemble des ids de sources chargées
  *
  */
  get loadedSourceId() {
    return this._loadedSourceId;
  }

  /**
  *
  * @function
  * @name get source
  * @description Récupérer l'ensemble des ids de sources chargées
  *
  */
  get source() {
    return this._source;
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
  * @name get operationsByType
  * @description Récupérer l'ensemble des opérations possibles par type de source
  *
  */
   get operationsByType() {
    return this._operationsByType;
  }

  /**
  *
  * @function
  * @name set loadedSourceId
  * @description Attribuer l'ensemble des ids de sources
  * @param {table} list - État de la connexion
  *
  */
  set loadedSourceId(list) {
    this._loadedSourceId = list;
  }

  /**
  *
  * @function
  * @name checkSourceConfiguration
  * @description Fonction utilisée pour vérifier la partie source d'un fichier de description d'une ressource.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

  checkSourceConfiguration(sourceJsonObject) {

    LOGGER.info("Verification de la source...");

    // ID
    if (!sourceJsonObject.id) {
      LOGGER.error("La ressource contient une source sans id.");
      return false;
    } else {
      // On vérifie que l'id n'est pas déjà chargé.
      if (this._loadedSourceId.length !== 0) {

        for (let i = 0; i < this._loadedSourceId.length; i++ ) {
          if (this._loadedSourceId[i] === sourceJsonObject.id) {
            LOGGER.info("La source contenant l'id " + sourceJsonObject.id + " est deja chargée.");
            // On vérifie que la source décrite et celle déjà identifiée soient exactement les mêmes
            if (this.checkDuplicationLoadedSource(sourceJsonObject)) {
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

      // On vérifie que l'id n'est pas déjà vérifié.
      if (this._checkedSourceId.length !== 0) {

        for (let i = 0; i < this._checkedSourceId.length; i++ ) {
          if (this._checkedSourceId[i] === sourceJsonObject.id) {
            LOGGER.info("La source contenant l'id " + sourceJsonObject.id + " est deja vérifiée.");
            // On vérifie que la source décrite et celle déjà identifiée soient exactement les mêmes
            if (this.checkDuplicationCheckedSource(sourceJsonObject)) {
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

        // On vérifie que le module osrm est disponible 
        try {
          let osrmTest = require('osrm');
        } catch(error) {
          LOGGER.error("Le module osrm n'est pas disponible mais une source osrm est proposée dans la configuration.");
          return false;
        }

        if (!this.checkSourceOsrm(sourceJsonObject)) {
          LOGGER.error("Erreur lors de la verification de la source osrm.");
          return false;
        } else {
          // il n'y a eu aucun problème, la source est correctement configurée.
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
      //------ VALHALLA
      if (sourceJsonObject.type === "valhalla") {
        available = true;
        LOGGER.info("Source valhalla.");

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

        if (!this.checkSourceValhalla(sourceJsonObject)) {
          LOGGER.error("Erreur lors de la verification de la source valhalla.");
          return false;
        } else {
          // il n'y a eu aucun problème, la ressource est correctement configurée.
        }
      } else {
        // On va voir si c'est un autre type.
      }
      //------ VALHALLA

      // Si ce n'est aucun type valide, on renvoie une erreur.
      if (!available) {
        LOGGER.error("La source indique un type invalide: " + sourceJsonObject.type);
        return false;
      }
    }

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
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une source smartrouting.
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
  * @name checkSourceValhalla
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une source valhalla.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

   checkSourceValhalla(sourceJsonObject) {

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
  * @name checkDuplicationLoadedSource
  * @description Fonction utilisée pour vérifier que le contenu d'un fichier de description d'une source est bien le même qu'un autre.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

  checkDuplicationLoadedSource(sourceJsonObject) {

    LOGGER.info("Comparaison des deux sources identifiees et devant etre identiques...");

    // On récupère la description de la source faisant office de référence car lue la première.
    let referenceSource = this._loadedSourceConfiguration[sourceJsonObject.id];

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
  * @name checkDuplicationCheckedSource
  * @description Fonction utilisée pour vérifier que le contenu d'un fichier de description d'une source est bien le même qu'un autre.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

   checkDuplicationCheckedSource(sourceJsonObject) {

    LOGGER.info("Comparaison des deux sources identifiees et devant etre identiques...");

    // On récupère la description de la source faisant office de référence car lue la première.
    let referenceSource = this._checkedSourceConfiguration[sourceJsonObject.id];

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
  * @name saveCheckedSource
  * @description Sauvegarder l'id de la source vérifié
  * @param {object} configuration - Id de la source que l'on veut sauvegarder
  *
  */
   saveCheckedSource(configuration) {

    this._checkedSourceId.push(configuration.id);
    this._checkedSourceConfiguration[configuration.id] = configuration;

  }

  /**
  *
  * @function
  * @name flushCheckedSource
  * @description Vider la liste des source déjà vérifiées 
  *
  */
  flushCheckedSource() {

    this._checkedSourceId = new Array();
    this._checkedSourceConfiguration = {};
    
  }

  /**
  *
  * @function
  * @name loadSourceConfiguration
  * @description Fonction utilisée pour créer une source.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @param {Topology} topology - Instance de la classe Topology
  * @return {boolean}
  *
  */

  loadSourceConfiguration(sourceJsonObject, topology) {

    LOGGER.info("Creation de la source: " + sourceJsonObject.id);

    let source;

    if (this._source[sourceJsonObject.id]) {
      LOGGER.info("La source " + sourceJsonObject.id + " existe déjà");
      return true;
    }

    if (sourceJsonObject.type === "osrm") {
      source = new osrmSource(sourceJsonObject, topology);
    } else if (sourceJsonObject.type === "pgr") {
      source = new pgrSource(sourceJsonObject, topology);
    } else if (sourceJsonObject.type === "smartrouting") {
      // smartrouting n'utilise pas la topologie définie dans la conf
      source = new smartroutingSource(sourceJsonObject);
    } else if (sourceJsonObject.type === "valhalla") {
      source = new valhallaSource(sourceJsonObject, topology);
    } else {
      // On va voir si c'est un autre type.
      LOGGER.error("Le type de la source est inconnu");
      return false;
    }

    this._loadedSourceId.push(sourceJsonObject.id);
    this._loadedSourceConfiguration[sourceJsonObject.id] = sourceJsonObject;
    this._source[sourceJsonObject.id] = source;

    return true;

  }

  /**
  *
  * @function
  * @name connectSource
  * @description Fonction utilisée pour connecter une source. 
  * On la sépare volontairement du load de la source car on veut pouvoir gérer ces actions de manière indépendante. 
  * @param {string} sourceId - Id de la source que l'on veut connecter
  *
  */
  async connectSource(sourceId) {

    LOGGER.info("Connexion a la source: " + sourceId);

    try {

      await this._source[sourceId].connect();
      LOGGER.info("Source connectee.");
      return true;

    } catch (err) {

      LOGGER.error("Impossible de connecter la source.", err);
      return false;

    }

  }

  /**
  *
  * @function
  * @name connectAllSources
  * @description Connecter l'ensemble des sources disponibles dans le manager
  *
  */
  async connectAllSources() {

    LOGGER.info("Connexion de l'ensemble des sources...");

    if (this._loadedSourceId.length === 0) {
      LOGGER.error("Aucune source n'est disponible");
      return false;
    }

    try {
      assert.deepStrictEqual(this._loadedSourceConfiguration, {});
      LOGGER.error("Aucune source n'a été préalablement chargée");
      return false;
    } catch (err) {
      // tout va bien
    }

    let nbSourceConnected = 0;

    for (let i = 0; i < this._loadedSourceId.length; i++) {
      
      LOGGER.info("Source : " + this._loadedSourceId[i]);

      if (!(await this.connectSource(this._loadedSourceId[i]))) {

        LOGGER.error("Source " + this._loadedSourceId[i] + " non connectée");
        // TODO : on continue de connecter les autres sources et on gère après coup la MAJ des ressources, du getcap, etc... 
        // Pour le moment, s'il y a une source qui ne fonctionne pas, on arrête le serveur 
        return false;

      } else {

        LOGGER.info("Source " + this._loadedSourceId[i] + " connectée");
        nbSourceConnected++;
        
      }
      
    }

    LOGGER.info("Les démarrages se sont bien déroulés.");

    if (nbSourceConnected === 0) {
      LOGGER.error("Aucune source n'a pu être connectée");
      return false;
    } else {
      LOGGER.info("Au moins une source a été connectée");
      return true;
    }

  }

}
