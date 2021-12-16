'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const assert = require('assert').strict;
const cors = require('cors');
const helmet = require('helmet');
const ApisManager = require('../apis/apisManager');
const ResourceManager = require('../resources/resourceManager');
const errorManager = require('../utils/errorManager');
const SourceManager = require('../sources/sourceManager');
const OperationManager = require('../operations/operationManager');
const BaseManager = require('../base/baseManager');
const TopologyManager = require('../topology/topologyManager');
const ProjectionManager = require('../geography/projectionManager');
const ServerManager = require('../server/serverManager');
const log4js = require('log4js');

// Création du LOGGER
const LOGGER = log4js.getLogger("SERVICE");

/**
*
* @class
* @name Service
* @description Il n'y a qu'un service par instance. Un service regroupe l'ensemble des informations utiles pour répondre aux requêtes.
*
*/

module.exports = class Service {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Service
  *
  */
  constructor() {

    // Manager des bases du service
    this._baseManager = new BaseManager();

    // Manager des opérations disponibles sur le service
    this._operationManager = new OperationManager();

    // Manager des projections
    this._projectionManager = new ProjectionManager();

    // Manager des topologies du service
    this._topologyManager = new TopologyManager(this._baseManager, this._projectionManager);

    // Manager des ressources du service.
    this._resourceManager = new ResourceManager();

    // catalogue des ressources du service.
    this._resourceCatalog = {};

    // Manager des sources du service.
    this._sourceManager = new SourceManager();

    // catalogue des sources du service.
    this._sourceCatalog = {};

    // Manager des apis du service
    this._apisManager = new ApisManager();

    // Manager de serveurs du service
    this._serverManager = new ServerManager();

    // Stockage de la configuration
    this._configuration = {};

    // Stockage du chemin de la configuration 
    this._configurationPath = "";

    // Stockage de la configuration des logs
    this._logConfiguration = {};

  }

  /**
  *
  * @function
  * @name get resourceCatalog
  * @description Récupérer l'ensemble des ressources
  *
  */
  get configuration() {
    return this._configuration;
  }

  /**
  *
  * @function
  * @name verifyAvailabilityOperation
  * @description Savoir si une opération est disponible sur le service
  * @param {string} operationId - Id de l'opération
  *
  */
  verifyAvailabilityOperation(operationId) {
    if (this._operationManager.verifyAvailabilityOperation(operationId)) {
      return true;
    } else {
      return false;
    }
  }

  /**
  *
  * @function
  * @name getOperationById
  * @description Récupérer une opération si elle est disponible sur le service
  * @param {string} operationId - Id de l'opération
  *
  */
  getOperationById(operationId) {
    if (this._operationManager.verifyAvailabilityOperation(operationId)) {
      return this._operationManager.getOperationById(operationId);
    } else {
      return {};
    }
  }

  /**
  *
  * @function
  * @name get resourceCatalog
  * @description Récupérer l'ensemble des ressources
  *
  */
  get resourceCatalog() {
    return this._resourceCatalog;
  }

  /**
  *
  * @function
  * @name get logConfiguration
  * @description Récupérer la configuration des logs
  *
  */
  get logConfiguration() {
    return this._logConfiguration;
  }

  /**
  *
  * @function
  * @name set logConfiguration
  * @description Attribuer la configuration des logs
  * @param {json} lc - Configuration des logs
  *
  */
  set logConfiguration(lc) {
    this._logConfiguration = lc;
  }

  /**
  *
  * @function
  * @name getResourceById
  * @description Récupérer une ressource par son id
  * @param {string} id - Id de la ressource
  *
  */
  getResourceById(id) {
    return this._resourceCatalog[id];
  }

  /**
  *
  * @function
  * @name verifyResourceExistenceById
  * @description Savoir si une ressource existe à partir de son id
  * @param {string} id - Id de la ressource
  *
  */
  verifyResourceExistenceById(id) {
    if (this._resourceCatalog[id]) {
      return true;
    } else {
      return false;
    }
  }

  /**
  *
  * @function
  * @name get sourceCatalog
  * @description Récupérer l'ensemble des sources
  *
  */
  get sourceCatalog() {
    return this._sourceCatalog;
  }

  /**
  *
  * @function
  * @name getSourceById
  * @description Récupérer une source par son id
  * @param {string} id - Id de la source
  *
  */
  getSourceById(id) {
    return this._sourceCatalog[id];
  }

  /**
  *
  * @function
  * @name verifySourceExistenceById
  * @description Savoir si une source existe à partir de son id
  * @param {string} id - Id de la source
  *
  */
  verifySourceExistenceById(id) {
    if (this._sourceCatalog[id]) {
      return true;
    } else {
      return false;
    }
  }

  /**
  *
  * @function
  * @name get apisManager
  * @description Récupérer le manager d'apis
  *
  */
  get apisManager() {
    return this._apisManager;
  }

  /**
  *
  * @function
  * @name checkAndSaveGlobalConfiguration
  * @description Vérification de la configuration globale du serveur
  * @param {json} userConfiguration - JSON décrivant la configuration du service
  * @param {string} userConfigurationPath - Chemin absolu du fichier de configuration
  *
  */

  checkAndSaveGlobalConfiguration(userConfiguration, userConfigurationPath) {

    LOGGER.info("Verification de la configuration globale de l'application...");

    // Configuration de l'application
    if (!userConfiguration.application) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application' manquant !");
      return false;
    }
    // Nom de l'application
    if (!userConfiguration.application.name) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:name' manquant !");
      return false;
    }
    // Titre de l'application
    if (!userConfiguration.application.title) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:title' manquant !");
      return false;
    }
    // Description de l'application
    if (!userConfiguration.application.description) {
      LOGGER.fatal("Mauvaise configuration: Champ 'application:description' manquant !");
      return false;
    }
    // Information sur le fournisseur du service
    if (userConfiguration.application.provider) {
      // Nom
      if (!userConfiguration.application.provider.name) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:provider:name' manquant !");
        return false;
      }
      // Site
      if (!userConfiguration.application.provider.site) {
        LOGGER.info("Le champ 'application:provider:site' n'est pas renseigne.");
      }
      // Mail
      if (!userConfiguration.application.provider.mail) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:provider:mail' manquant !");
        return false;
      }
    } else {
      LOGGER.warn("Configuration incomplete: Objet 'application:provider' manquant !");
    }
    // Information sur les opérations
    if (userConfiguration.application.operations) {
      // Dossier contenant les fichiers d'opérations
      if (!userConfiguration.application.operations.directory) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:operations:directory' manquant !");
        return false;
      } else {

        // On vérifie que le dossier existe et qu'il contient des fichiers de description des opérations
        let directory = "";

        try {
          directory =  path.resolve(path.dirname(userConfigurationPath), userConfiguration.application.operations.directory);
        } catch (error) {
          LOGGER.fatal("Can't get absolute path of operations directory: " + userConfiguration.application.operations.directory);
          LOGGER.fatal(error);
          return false;
        }

        if (fs.existsSync(directory)) {
          // On vérifie que l'application peut lire les fichiers du dossier
          fs.readdirSync(directory).forEach(operation => {

            let operationFile = "";

            try {
              operationFile = directory + "/" + operation;
              fs.accessSync(operationFile, fs.constants.R_OK);
            } catch (err) {
              LOGGER.error("Le fichier d'operation ne peut etre lu: " + operationFile);
            }

            try {
              // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
              JSON.parse(fs.readFileSync(operationFile));
            } catch (error) {
              LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier d'operation: " + operationFile);
              LOGGER.error(error);
              return false;
            }

          });

          // On vérifie que la partie concernant les paramètres est bien renseignée
          if (!userConfiguration.application.operations.parameters) {
            LOGGER.fatal("Mauvaise configuration: Objet 'application:operations:parameters' manquant !");
            return false;
          } else {

            if (!userConfiguration.application.operations.parameters.directory) {
              LOGGER.fatal("Mauvaise configuration: Champ 'application:operations:parameters:directory' manquant !");
              return false;
            } else {

              // On vérifie que le dossier existe et qu'il contient des fichiers de description des paramètres              
              let directory = "";

              try {
                directory =  path.resolve(path.dirname(userConfigurationPath), userConfiguration.application.operations.parameters.directory);
              } catch (error) {
                LOGGER.fatal("Can't get absolute path of parameters directory: " + userConfiguration.application.operations.parameters.directory);
                LOGGER.fatal(error);
                return false;
              }

              if (fs.existsSync(directory)) {
                // On vérifie que l'application peut lire les fichiers du dossier
                fs.readdirSync(directory).forEach(parameter => {

                  let parameterFile = "";

                  try {
                    parameterFile = directory + "/" + parameter;
                    fs.accessSync(parameterFile, fs.constants.R_OK);
                  } catch (err) {
                    LOGGER.error("Le fichier de parametres ne peut etre lu: " + parameterFile);
                  }

                  try {
                    // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
                    JSON.parse(fs.readFileSync(parameterFile));
                  } catch (error) {
                    LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de parametres: " + parameterFile);
                    LOGGER.error(error);
                    return false;
                  }

                });

              } else {
                LOGGER.fatal("Mauvaise configuration: Le dossier des parametres n'existe pas : " + directory);
                return false;
              }

            }

          }

        } else {
          LOGGER.fatal("Mauvaise configuration: Le dossier des operations n'existe pas: " + directory);
          return false;
        }

      }

    } else {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:operations' manquant !");
      return false;
    }

    // Information sur les ressources
    if (userConfiguration.application.resources) {
      // Dossier contenant les fichiers de ressources
      if (!userConfiguration.application.resources.directories) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:resources:directories' manquant !");
        return false;
      } else {

        let resourcesDirectories = userConfiguration.application.resources.directories;
        // On vérifie que c'est un tableau non vide
        if (!Array.isArray(resourcesDirectories)) {
          LOGGER.error("Mauvaise configuration: Champ 'application:resources:directories' n'est pas un tableau !");
          return false;
        }
        if (resourcesDirectories.length === 0) {
          LOGGER.error("Mauvaise configuration: Champ 'application:resources:directories' est un tableau vide !");
          return false;
        }

        let resourceCount = 0;
        for (let i = 0; i < resourcesDirectories.length; i++) {

          // On vérifie que le dossier existe et qu'il contient des fichiers de description des ressources
          if (resourcesDirectories[i] === "") {
            LOGGER.warn("Mauvaise configuration: Champ 'application:resources:directories' contient un élément vide");
            continue;
          } else {

            let directory =  path.resolve(path.dirname(userConfigurationPath), resourcesDirectories[i]);
            if (fs.existsSync(directory)) {
              // On vérifie que l'application peut lire les fichiers du dossier
              fs.readdirSync(directory).forEach(resource => {

                let resourceFile = "";
                try {
                  resourceFile = directory + "/" + resource;
                  fs.accessSync(resourceFile, fs.constants.R_OK);
                  resourceCount++;
                } catch (err) {
                  LOGGER.error("Le fichier de ressource ne peut etre lu: " + resourceFile);
                }

                try {
                  // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
                  JSON.parse(fs.readFileSync(resourceFile));
                } catch (error) {
                  LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de ressource: " + resourceFile);
                  LOGGER.error(error);
                  return false;
                }

              });
            } else {
              LOGGER.error("Mauvaise configuration: Le dossier n'existe pas: " + directory );
            }

          }
          
        }

        if (resourceCount === 0) {
          LOGGER.fatal("Mauvaise configuration: Champ 'application:resources:directories' ne pointe vers aucune ressource disponible !");
          return false;
        }

      }
      
    } else {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:resources' manquant !");
      return false;
    }
    // Information sur le reseau
    if (!userConfiguration.application.network) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:network' manquant !");
      return false;
    } else {

      if (!userConfiguration.application.network.servers) {
        LOGGER.fatal("Mauvaise configuration: Objet 'application:network:servers' manquant !");
        return false;
      }

      if (!Array.isArray(userConfiguration.application.network.servers)) {
        LOGGER.fatal("Mauvaise configuration: Objet 'application:network:servers' n'est pas un tableau !");
        return false;
      }

      if (userConfiguration.application.network.servers.length === 0) {
        LOGGER.fatal("Mauvaise configuration: Objet 'application:network' est un tableau vide !");
        return false;
      }

      for (let i = 0; i < userConfiguration.application.network.servers.length; i++) {
        if (!this._serverManager.checkConfiguration(userConfiguration.application.network.servers[i])) {
          LOGGER.fatal("Mauvaise configuration d'un serveur !");
          return false;
        }
      }

      if (!userConfiguration.application.network.cors) {
        LOGGER.warn("Configuration incomplete: Objet 'application:network:cors' manquant !");
      } else {

        if (!userConfiguration.application.network.cors.configuration) {
          LOGGER.fatal("Mauvaise configuration: Champ 'application:network:cors:configuration' manquant !");
          return false; 
        } else {

          let corsFile = "";
          
          try {
            corsFile = path.resolve(path.dirname(userConfigurationPath), userConfiguration.application.network.cors.configuration);
          } catch (error) {
            LOGGER.error("Impossible d'avoir le chemin absolu du fichier de cors: " + userConfiguration.application.network.cors.configuration);
            LOGGER.error(error);
            return false;
          }

          if (fs.existsSync(corsFile)) {

            try {
              // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
              JSON.parse(fs.readFileSync(corsFile));
            } catch (error) {
              LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de cors de Road2: " + corsFile);
              LOGGER.error(error);
              return false;
            }

          } else {
            LOGGER.fatal("Mauvaise configuration: Fichier de cors inexistant : " + corsFile);
            return false; 
          }

        }

      }

    }

    if (!userConfiguration.application.projections) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:projections' manquant !");
      return false;
    } else {

      if (!userConfiguration.application.projections.directory) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:projections:directory' manquant !");
        return false; 
      } else {

        let projDir = "";
        
        try {
          projDir = path.resolve(path.dirname(userConfigurationPath), userConfiguration.application.projections.directory);
        } catch (error) {
          LOGGER.error("Impossible d'avoir le chemin aboslu du dossier de projection: " + projDir);
          LOGGER.error(error);
          return false;
        }

        if (fs.existsSync(projDir)) {

          // On vérifie que l'application peut lire les fichiers du dossier
          fs.readdirSync(projDir).forEach(projection => {

            let projectionFile = "";

            try {
              projectionFile = projDir + "/" + projection;
              fs.accessSync(projectionFile, fs.constants.R_OK);
            } catch (err) {
              LOGGER.error("Le fichier de projection ne peut etre lu: " + projectionFile);
            }

            try {
              // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
              JSON.parse(fs.readFileSync(projectionFile));
            } catch (error) {
              LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de projection: " + projectionFile);
              LOGGER.error(error);
              return false;
            }
          });

        } else {
          LOGGER.fatal("Mauvaise configuration: Dossier de projections inexistant : " + projDir);
          return false; 
        }

      }

    }

    LOGGER.info("Verification terminee.");
    this._configuration = userConfiguration;
    // On stocke le chemin absolu car c'est utile pour la suite, notamment pour les chemins relatifs que l'on aura
    this._configurationPath = userConfigurationPath;
    return true;

  }


  /**
  *
  * @function
  * @name loadOperations
  * @description Chargement des opérations
  * @param {string} operationsDirectory - Dossier contenant les opérations à charger (chemin absolu)
  * @param {string} parametersDirectory - Dossier contenant les paramètres à charger (chemin absolu)
  *
  */

  loadOperations(operationsDirectory, parametersDirectory) {

    LOGGER.info("Chargement des operations...");

    if (!operationsDirectory) {
      try {
        operationsDirectory = path.resolve(path.dirname(this._configurationPath), this._configuration.application.operations.directory);
      } catch (error) {
        LOGGER.error("Impossible d'avoir le chemin aboslu du dossier des operations: " + this._configuration.application.operations.directory);
        LOGGER.error(error);
        return false;
      }
    }

    if (!parametersDirectory) {
      try {
        parametersDirectory = path.resolve(path.dirname(this._configurationPath), this._configuration.application.operations.parameters.directory);
      } catch (error) {
        LOGGER.error("Impossible d'avoir le chemin aboslu du dossier des parametres: " + this._configuration.application.operations.parameters.directory);
        LOGGER.error(error);
        return false;
      }
    }

    if (!this._operationManager.loadOperationDirectory(operationsDirectory, parametersDirectory)) {
      LOGGER.error("Erreur lors du chargement des operations.");
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name loadProjections
  * @description Chargement des opérations
  * @param {string} projectionsDirectory - Dossier contenant les projections à charger (chemin absolu)
  *
  */

  loadProjections(projectionsDirectory) {

    LOGGER.info("Chargement des projections...");

    if (!projectionsDirectory) {
      try {
        projectionsDirectory = path.resolve(path.dirname(this._configurationPath), this._configuration.application.projections.directory);
      } catch (error) {
        LOGGER.error("Impossible d'avoir le chemin aboslu du dossier des projections: " + this._configuration.application.projections.directory);
        LOGGER.error(error);
        return false;
      }
    }

    if (!this._projectionManager.loadProjectionDirectory(projectionsDirectory)) {
      LOGGER.error("Erreur lors du chargement des projections.");
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name loadResources
  * @description Chargement des ressources
  * @param {table} userResourceDirectories - Tableau de dossiers contenant les ressources à charger (chemins absolus)
  *
  */

  async loadResources(userResourceDirectories) {

    LOGGER.info("Chargement des ressources...");

    // Nombre de ressources chargées
    let loadedResources = 0;

    if (!userResourceDirectories) {
      userResourceDirectories = this._configuration.application.resources.directories;
    }

    if (!Array.isArray(userResourceDirectories)) {
      LOGGER.error("La variable contenant les dossiers de ressources n'est pas un tableau");
      return false;
    }

    if (userResourceDirectories.length === 0) {
      LOGGER.error("Le tableau contenant les dossiers de ressources est vide");
      return false;
    }

    for (let i = 0; i < userResourceDirectories.length; i++) {

      let resourceDirectory = "";

      try {
        resourceDirectory = path.resolve(path.dirname(this._configurationPath), userResourceDirectories[i]);
      } catch (error) {
        LOGGER.error("Impossible d'obtenir le chemin absolu du dossier de ressources: " + userResourceDirectories[i]);
        LOGGER.error(error);
        return false;
      }
      
      // Pour chaque fichier du dossier des ressources, on crée une ressource
      const files = fs.readdirSync(resourceDirectory).filter( (file) => {
        return path.extname(file).toLowerCase() === ".resource";
      })
      for (let fileName of files){

        let resourceFile = resourceDirectory + "/" + fileName;
        LOGGER.info("Chargement de: " + resourceFile);

        // Récupération du contenu en objet pour vérification puis création de la ressource
        try {

          let resourceContent = JSON.parse(fs.readFileSync(resourceFile));
          // Vérification du contenu
          let resourceChecked = await this._resourceManager.checkResource(resourceContent, this._sourceManager, this._operationManager, this._topologyManager)
          if (!resourceChecked) {
            LOGGER.error("Erreur lors du chargement de la ressource: " + resourceFile);
          } else {
            // Création de la ressource
            this._resourceCatalog[resourceContent.resource.id] = this._resourceManager.createResource(resourceContent, this._operationManager);
            loadedResources++;
          }

        } catch (error) {
          LOGGER.error(error);
          LOGGER.error("Erreur lors de la lecture de la ressource: " + resourceFile);
        }

      };

    }

    if (loadedResources === 0) {
      LOGGER.fatal("Aucune ressource n'a pu etre chargee");
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name loadTopologies
  * @description Chargement des topologies
  *
  */

  loadTopologies() {

    LOGGER.info("Chargement des topologies...");

    if (!this._topologyManager.loadAllTopologies()) {
      LOGGER.error("Echec lors du chargement des topologies.");
      return false;
    }

    LOGGER.info("Topologies chargees.");
    return true;
  }

  /**
  *
  * @function
  * @name loadSources
  * @description Chargement des sources
  *
  */

  async loadSources() {

    LOGGER.info("Chargement des sources...");

    let loadedSources = 0;

    // On récupère les informations du resourceManager pour les intégrer au sourceManager du service
    let listOfSourceIds = this._sourceManager.listOfSourceIds;
    let sourceDescriptions = this._sourceManager.sourceDescriptions;

    // On va créer chaque source
    if (listOfSourceIds.length !== 0) {
      // On va charger chaque source identifiée
      let sourceToRemove = new Array();
      for (let i = 0; i < listOfSourceIds.length; i++) {

        let sourceId = listOfSourceIds[i];
        LOGGER.info("Chargement de la source: " + sourceId);

        // On récupère la bonne topologie
        let topologyId = this._sourceManager.getSourceTopology(sourceId);
        if (topologyId === "") {
          LOGGER.error("Erreur lors de la recuperation de l'id de la topologie associee a la source");
          throw errorManager.createError("Topology Id not found");
        }

        let topology = this._topologyManager.getTopologyById(topologyId);

        try {
          assert.notDeepStrictEqual(topology, {});
        } catch(err) {
          LOGGER.error("Erreur lors de la recuperation de la topologie associee a la source");
          LOGGER.error(err);
          throw errorManager.createError("Topology not found");
        }

        // On crée la source
        // TODO: a revoir -> cas ou plusieurs datasources utilisant des topologies différentes
        let currentSource = this._sourceManager.createSource(sourceDescriptions[sourceId], topology);
        
        // On vérifie que le source peut bien être chargée ou connectée
        try {
          await this._sourceManager.connectSource(currentSource);
          this._sourceCatalog[sourceId] = currentSource;
          loadedSources++;
        } catch (err) {
          // on n'a pas pu se connecter à la source
          // si une source ne peut être chargée alors on la supprime
          LOGGER.error("Impossible de se connecter a la source: " + sourceId);
          LOGGER.debug("Erreur : " + err);
          LOGGER.warn("Suppression des references a la source dans les ressources qui l'utilisent...");
          let resourceList = this._sourceManager.listOfUsage(sourceId);
          if (resourceList.length !== 0) {
            for (let k = 0; k < resourceList.length; k++) {
              LOGGER.warn("Suppression au sein de la ressource " + resourceList[k]);
              let resource = this.resourceCatalog[resourceList[k]];
              resource.removeSource(sourceId);
            }
          }
          sourceToRemove.push(sourceId);

        }
      }

      // On supprime les sources qui n'ont pas pu être chargées
      if (sourceToRemove.length !== 0) {
        for (let k= 0; k < sourceToRemove.length; k++) {
          LOGGER.warn("Suppression de la source " + sourceToRemove[k]);
          this._sourceManager.removeSource(sourceToRemove[k]);
        }
      }

    } else {
      LOGGER.fatal("Il n'y a aucune source a charger.");
      throw errorManager.createError("No source found");
    }

    if (loadedSources === 0) {
      LOGGER.fatal("Aucune source n'a pu etre chargee");
      throw errorManager.createError("No source loaded");
    }
  }

  /**
  *
  * @function
  * @name createServer
  * @description Création du serveur
  * @param {string} userApiDirectory - Dossier contenant les apis à charger sur ce serveur
  * @param {string} userServerPrefix - Prefixe à utiliser sur le serveur créer
  *
  */

  createServer(userApiDirectory, userServerPrefix) {

    LOGGER.info("Creation de l'application web...");

    // Application Express
    let road2 = express();

    // Stockage de l'instance Service dans l'app expressJS afin que les informations soient accessibles par les requêtes
    road2.set("service", this);

    // Initialisation des CORS 
    let corsConfiguration = {};
    if (this._configuration.application.network.cors) {
      try {
        corsConfiguration = JSON.parse(fs.readFileSync(path.resolve(path.dirname(this._configurationPath), this._configuration.application.network.cors.configuration)));
      } catch (error) {
        LOGGER.error("Impossible de lire le fichier de configuration des cors: " + this._configuration.application.network.cors.configuration);
        LOGGER.error(error);
        return false;
      }
    } else {
      corsConfiguration.origin = false;
    }

    try {
      road2.use(cors(corsConfiguration));
    } catch (error) {
      LOGGER.fatal("Impossible d'initialiser les cors: ");
      LOGGER.error(corsConfiguration)
      LOGGER.error(error);
      return false;
    }
    
    // Gestion des en-têtes avec helmet selon les préconisations d'ExpressJS
    road2.use(helmet());

    // Pour le log des requêtes reçues sur le service avec la syntaxe
    LOGGER.info("Instanciation du logger pour les requêtes...");

    try {

      road2.use(log4js.connectLogger(log4js.getLogger('request'), {
        level: this._logConfiguration.httpConf.level,
        format: (req, res, format) => format(this._logConfiguration.httpConf.format)
      }));

    } catch (error) {
      LOGGER.fatal("Impossible de connecter le logger pour les requetes: ");
      LOGGER.error(this._logConfiguration.httpConf)
      LOGGER.error(error);
      return false;
    }
    

  

    // Chargement des APIs
    if (!this._apisManager.loadAPISDirectory(road2, userApiDirectory, userServerPrefix)) {
      LOGGER.error("Erreur lors du chargement des apis.");
      return false;
    }

    road2.all('/', (req, res) => {
      res.send('Road2');
    });

    // Création des serveurs
    if (!this._serverManager.createAllServer(road2)) {
      LOGGER.fatal("Impossible de creer les serveurs.");
      return false;
    }

    // Démarrage des serveurs
    if (!this._serverManager.startAllServer()) {
      LOGGER.fatal("Impossible de demarer les serveurs.");
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name stopServer
  * @description Arrêt du serveur
  *
  */

  stopServer() {

    // Extinction des serveurs
    if (!this._serverManager.stopAllServer()) {
      LOGGER.fatal("Impossible d'eteindre les serveurs.");
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name computeRequest
  * @description Fonction utilisée pour rediriger une requête vers le bon moteur.
  * Une requête se fait nécessairement sur une ressource. Cette ressource est indiquée dans la requête.
  * La ressource sait comment déterminer la source concernée par la requête.
  * Et la source interrogera le moteur.
  * @param {Request} request - Requête
  *
  */

  computeRequest(request) {
    // Récupération de la ressource
    // ---
    // L'id est dans la requête
    let resourceId = request.resource;
    // La ressource est dans le catalogue du service
    let resource = this._resourceCatalog[resourceId];
    // ---

    // Récupération de la source concernée par la requête
    // ---
    // L'id est donné par le ressource
    let sourceId = resource.getSourceIdFromRequest(request);

    // La source est dans le catalogue du service
    // TODO : vérifier que la source existe toujours
    let source = this._sourceCatalog[sourceId];
    // ---

    //On renvoie la requête vers le moteur
    // ---
    // C'est la source qui fait le lien avec un moteur
    try {
      return source.computeRequest(request);
    } catch(err) {
      return err
    }
    // ---

  }

  /**
  *
  * @function
  * @name disconnectAllSources
  * @description Fonction utilisée pour déconnecter toutes les sources.
  * @param {Source} source - Objet Source ou hérité de la classe Source
  *
  */
  async disconnectAllSources() {
    LOGGER.info("Déconnection de toutes les sources");
    try {
      for (let source_id in this._sourceCatalog) {
        await this._sourceManager.disconnectSource(this._sourceCatalog[source_id]);
      }
    } catch (err) {
      LOGGER.error("Impossible de déconnecter la source.", err);
    }
  }


}
