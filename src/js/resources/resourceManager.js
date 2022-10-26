'use strict';

const fs = require('fs');
const path = require('path');
const osrmResource = require('../resources/osrmResource');
const pgrResource = require('../resources/pgrResource');
const smartpgrResource = require('../resources/smartpgrResource');
const valhallaResource = require('../resources/valhallaResource');
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
  constructor(sourceManager, operationManager, topologyManager) {

    // Liste des ids des ressources chargées par le manager
    this._loadedResourceId = new Array();

    // Liste des ids des ressources vérifiées par le manager
    this._checkedResourceId = new Array();

    // Liste des ressources chargées dans le manager
    this._resource = {};

    // Liste des types de ressource gérées par le manager
    this._availableResourceTypes = ["pgr", "smartpgr","osrm","valhalla"];

    // Manager de topology 
    this._topologyManager = topologyManager;

    // Manager de source
    this._sourceManager = sourceManager;

    // Manager d'opération
    this._operationManager = operationManager;

  }

  /**
  *
  * @function
  * @name get resource
  * @description Récupérer les ressources 
  *
  */
   get resource() {
    return this._resource;
  }

  /**
  *
  * @function
  * @name checkResourceDirectory
  * @description Fonction utilisée pour vérifier le contenu d'un dossier de description d'une ressource.
  * @param {string} directory - Dossier qui contient les configurations des ressources
  * @return {boolean} 
  *
  */

  async checkResourceDirectory(directory) {

    LOGGER.info("Vérification d'un dossier de ressources...");
    LOGGER.info("Nom du dossier: " + directory);

    if (fs.existsSync(directory)) {

      let fileList = new Array();
      try {
        fileList = fs.readdirSync(directory);
      } catch(error) {
        LOGGER.error("Impossible de lire le dossier :");
        LOGGER.error(error);
        return false;
      }

      if (fileList.length === 0) {
        LOGGER.warn("Le dossier " + directory + " est vide");
        return false;
      }

      for (let i = 0; i < fileList.length; i++) {

        let resource = fileList[i];
        let resourceFile = "";
        try {
          resourceFile = directory + "/" + resource;
          fs.accessSync(resourceFile, fs.constants.R_OK);
        } catch (err) {
          LOGGER.error("Le fichier de ressource ne peut etre lu: " + resourceFile);
        }

        let resourceConf = {};
        try {
          // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
          resourceConf = JSON.parse(fs.readFileSync(resourceFile));
        } catch (error) {
          LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de ressource: " + resourceFile);
          LOGGER.error(error);
          return false;
        }

        if (!(await this.checkResourceConfiguration(resourceConf))) {
          LOGGER.error("La ressource décrite dans le fichier " + resourceFile + " est mal configuée");
          return false;
        } else {
          this._checkedResourceId.push(resourceConf.resource.id);
        }

      }

      LOGGER.info("Vérification du dossier de ressources terminée");
      return true;

    } else {
      LOGGER.error("Mauvaise configuration: Le dossier n'existe pas: " + directory );
      return false;
    }

  }

  /**
  *
  * @function
  * @name checkResourceConfiguration
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une ressource.
  * @param {object} resourceJsonObject - Configuration de la ressource
  * @return {boolean} 
  *
  */

  async checkResourceConfiguration(resourceJsonObject) {

    LOGGER.info("Verification de la configuration d'une ressource...");

    if (!resourceJsonObject.resource) {
      LOGGER.error("Le fichier ne contient pas d'objet resource");
      return false;
    }

    // ID
    if (!resourceJsonObject.resource.id) {
      LOGGER.error("La ressource ne contient pas d'id.");
      return false;
    } else {
      LOGGER.info("Ressource id: " + resourceJsonObject.resource.id);

      // On vérifie que l'id de la ressource n'est pas déjà pris par une autre ressource chargée
      if (this._loadedResourceId.length !== 0) {
        for (let i = 0; i < this._loadedResourceId.length; i++ ) {
          if (this._loadedResourceId[i] === resourceJsonObject.resource.id) {
            LOGGER.error("Une ressource contenant l'id " + resourceJsonObject.resource.id + " a deja ete chargée.");
            return false;
          }
        }
      } else {
        // Il n'y a pas encore de ressource chargée.
      }

      // On vérifie que l'id de la ressource n'est pas déjà pris par une autre ressource vérifiée
      if (this._checkedResourceId.length !== 0) {
        for (let i = 0; i < this._checkedResourceId.length; i++ ) {
          if (this._checkedResourceId[i] === resourceJsonObject.resource.id) {
            LOGGER.error("Une ressource contenant l'id " + resourceJsonObject.resource.id + " a deja ete verifiee.");
            return false;
          }
        }
      } else {
        // C'est la première ressource vérifiée.
      }

    }

    // Version
    if (!resourceJsonObject.resource.resourceVersion) {
      LOGGER.error("La ressource ne contient pas de version.");
      return false;
    } else {
      // on vérifie que c'est bien une string
      if (typeof resourceJsonObject.resource.resourceVersion !== "string") {
        LOGGER.error("La version de la ressource n'est pas une chaine de carateres.");
        return false;
      }
    }

    // Type
    if (!resourceJsonObject.resource.type) {
      LOGGER.error("La ressource ne contient pas de type.");
      return false;
    } else {

      // Vérification que le type est valide
      if (this._availableResourceTypes.includes(resourceJsonObject.resource.type)) {
        LOGGER.info("Type de la ressource disponible: " + resourceJsonObject.resource.type);
      } else {
        LOGGER.error("La ressource indique un type invalide: " + resourceJsonObject.resource.type);
        return false;      
      }

    }

    // Description
    if (!resourceJsonObject.resource.description) {
      LOGGER.error("La ressource ne contient pas de description.");
      return false;
    } 

    // Topology
    if (!resourceJsonObject.resource.topology) {
      LOGGER.error("La ressource ne contient pas de topologie.");
      return false;
    } else {
      if (!(await this._topologyManager.checkTopologyConfiguration(resourceJsonObject.resource.topology))) {
        LOGGER.error("La ressource contient une topologie incorrecte.");
        return false;
      } else {
        this._topologyManager.saveCheckedTopology(resourceJsonObject.resource.topology);
      }
    }

    // Sources
    if (!resourceJsonObject.resource.sources) {
      LOGGER.error("La ressource ne contient pas de sources.");
      return false;
    } else {

      LOGGER.info("Verification des sources...")

      for (let i = 0; i < resourceJsonObject.resource.sources.length; i++ ) {

        let sourceId = resourceJsonObject.resource.sources[i];
        if (!this._sourceManager.isCheckedSourceAvailable(sourceId)) {
          LOGGER.error("La ressource contient une source non disponible.");
          return false;
        } else {
          // TODO : on stocke l'id de la ressource pour cette source donnée
        }

      }
    }

    // availableOperations
    if (!resourceJsonObject.resource.availableOperations) {
      LOGGER.error("La ressource ne contient pas de availableOperations.");
      return false;
    } else {
      // on fait la vérification via le operationManager
      if (!this._operationManager.checkResourceOperationConfiguration(resourceJsonObject.resource.availableOperations)) {
        LOGGER.error("Mauvaise configuration des operations dans la ressource.");
        return false;
      }
    }

    // On vérifie la cohérence entre les sources diponibles et les opérations configurées
    // Pour le moment, on va seulement vérifier que pour chaque opération paramétrée, il y a au moins une source qui puisse répondre
    for (let i = 0; i < resourceJsonObject.resource.availableOperations.length; i++) {

      let operationId = resourceJsonObject.resource.availableOperations[i].id;
      let found = false;

      for (let j = 0; resourceJsonObject.resource.sources; j++) {
        let sourceType = resourceJsonObject.resource.sources[j].type;
        let operations = this._sourceManager.operationsByType[sourceType];
        if (operations.includes(operationId)) {
          found = true;
          break;
        }
      }

      if (!found) {
        LOGGER.error("L'opération " + operationId + " n'a pas de source pour y répondre");
        return false;
      }

    }

    LOGGER.info("Fin de la verification de la ressource.");
    return true;

  }

  /**
  *
  * @function
  * @name flushCheckedResource
  * @description Vider la liste des ressources déjà vérifiées 
  *
  */
   flushCheckedResource() {

    this._checkedResourceId = new Array();
  
  }

  /**
  *
  * @function
  * @name loadResourceDirectory
  * @description Fonction utilisée pour charger le contenu d'un dossier de description d'une ressource.
  * @param {string} directory - Dossier qui contient les configurations des ressources
  * @return {boolean} 
  *
  */

  loadResourceDirectory(resourceDirectory) {

    // Pour chaque fichier du dossier des ressources, on crée une ressource
    let files = fs.readdirSync(resourceDirectory).filter( (file) => {
      return path.extname(file).toLowerCase() === ".resource";
    });

    for (let fileName of files) {

      let resourceFile = resourceDirectory + "/" + fileName;
      LOGGER.info("Chargement de: " + resourceFile);

      // Récupération du contenu en objet pour vérification puis création de la ressource
      let resourceContent = {};
      try {
        resourceContent = JSON.parse(fs.readFileSync(resourceFile));
      } catch (error) {
        LOGGER.error(error);
        LOGGER.error("Erreur lors de la lecture de la ressource: " + resourceFile);
      }

      // Création de la ressource
      if (!this.loadResourceConfiguration(resourceContent)) {
        LOGGER.error("La ressource configurée dans le fichier " + resourceFile + " n'a pas pu être chargée");
      } else {
        LOGGER.info("Ressource chargée : " + resourceFile);
      }

    }

    return true;

  }


  /**
  *
  * @function
  * @name loadResourceConfiguration
  * @description Fonction utilisée pour créer une ressource à partir de sa configuration
  * @param {json} resourceJsonObject - Description JSON de la ressource
  * @return {boolean} 
  *
  */

  loadResourceConfiguration(resourceJsonObject) {

    let resource;

    if (!resourceJsonObject.resource.id) {
      LOGGER.error("La ressource ne contient pas d'id.");
      return false;
    }

    LOGGER.info("Creation de la ressource: " + resourceJsonObject.resource.id);

    // On vérifie que la ressource n'existe pas déjà
    if (this._loadedResourceId.length !== 0) {
      for (let i = 0; i < this._loadedResourceId.length; i++ ) {
        if (this._loadedResourceId[i] === resourceJsonObject.resource.id) {
          LOGGER.info("La ressource contenant l'id " + resourceJsonObject.resource.id + " a déjà été chargée.");
          return true;
        }
      }
    } else {
      // C'est la première ressource créée
    }

    // Création de la topology associée 
    LOGGER.info("Chargement de la topology associé...");
    let currentTopology = {};
    if (!this._topologyManager.loadTopologyConfiguration(resourceJsonObject.resource.topology)) {
      LOGGER.error("Impossible de créer la topology associée à la ressource");
      return false;
    } else {
      currentTopology = this._topologyManager.getTopology(resourceJsonObject.resource.topology.id);
    }

    // Création des sources associées
    LOGGER.info("Vérification du chargement des sources associées...");
    for (let i = 0; i < resourceJsonObject.resource.sources.length; i++) {
      if (!this._sourceManager.isLoadedSourceAvailable(resourceJsonObject.resource.sources[i])) {
        LOGGER.error("La source associée à la ressource n'est pas chargée : " + resourceJsonObject.resource.sources[i].id);
        return false;
      }
    }

    // Création des opérations
    let resourceOperationHash = {};
    if (!this._operationManager.loadResourceOperationConfiguration(resourceOperationHash, resourceJsonObject)) {
      LOGGER.error("Erreur lors de la creation des operations de la ressource");
      return false;
    } 

    // Création de la ressource
    if (resourceJsonObject.resource.type === "osrm") {
      resource = new osrmResource(resourceJsonObject, resourceOperationHash);
    } else if (resourceJsonObject.resource.type === "pgr") {
      resource = new pgrResource(resourceJsonObject, resourceOperationHash);
    } else if (resourceJsonObject.resource.type === "smartpgr") {
      resource = new smartpgrResource(resourceJsonObject, resourceOperationHash);
    } else if (resourceJsonObject.resource.type === "valhalla") {
      resource = new valhallaResource(resourceJsonObject, resourceOperationHash);
    } else {
      LOGGER.error("Type de la ressource inconnue");
      return false;
    }

    // on sauvegarde l'id de la ressource pour savoir qu'elle a déjà été créée et la ressource elle-même
    this._loadedResourceId.push(resourceJsonObject.resource.id);
    this._resource[resourceJsonObject.resource.id] = resource;

    return true;
    
  }


}
