'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const ApisManager = require('../apis/apisManager');
const ResourceManager = require('../resources/resourceManager');
const SourceManager = require('../sources/sourceManager');
const OperationManager = require('../operations/operationManager');
const BaseManager = require('../base/baseManager');
const ProjectionManager = require('../geography/projectionManager');
const ServerManager = require('../server/serverManager');
const LogManager = require('../utils/logManager');
const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const HealthResponse = require('../responses/healthResponse');
const ProjectionResponse = require('../responses/projectionResponse');
const projectionRequest = require('../requests/projectionRequest');

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

    // Manager des sources du service.
    this._sourceManager = new SourceManager(this._projectionManager, this._baseManager);

    // Manager des ressources du service.
    this._resourceManager = new ResourceManager(this._sourceManager, this._operationManager);

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
  * @name get configuration
  * @description Récupérer la configuration du service
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
    return this._resourceManager.resource[id];
  }

  /**
  *
  * @function
  * @name getResources
  * @description Récupérer l'ensemble des ressources
  *
  */
   getResources() {
    return this._resourceManager.resource;
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
    if (this._resourceManager.resource[id]) {
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
  * @name checkServiceConfiguration
  * @description Vérification de la configuration globale du serveur
  * @param {json} userConfiguration - JSON décrivant la configuration du service
  * @param {string} userConfigurationPath - Chemin absolu du fichier de configuration
  *
  */

  async checkServiceConfiguration(userConfiguration, userConfigurationPath) {

    LOGGER.info("Verification de la configuration globale du service...");

    LOGGER.debug("Vérification des informations générales");

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

    LOGGER.debug("Vérification des informations du provider");

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

    // Information sur le logger
    
    // On le test ici aussi pour avoir un check le plus complet quand il est lancé en dehors d'un démarrage de Road2
    LOGGER.debug("Vérification des informations sur les logs");

    if (!userConfiguration.application.logs) {
      LOGGER.error("Mauvaise configuration: Objet 'application.logs' manquant !");
      return false;
    } else {

      if (!userConfiguration.application.logs.configuration) {
        LOGGER.error("Mauvaise configuration: Objet 'application.logs.configuration' manquant !");
        return false;
      } else {
        
        let logConfPath = "";
          
        try {
          logConfPath = path.resolve(path.dirname(userConfigurationPath), userConfiguration.application.logs.configuration);
        } catch (error) {
          LOGGER.error("Impossible d'avoir le chemin absolu du fichier de configuration des logs: " + userConfiguration.application.logs.configuration);
          LOGGER.error(error);
          return false;
        }

        if (fs.existsSync(logConfPath)) {

          let logConf = {};

          try {
            // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
            logConf = JSON.parse(fs.readFileSync(logConfPath));
          } catch (error) {
            LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de conf des logs du service de Road2: " + logConfPath);
            LOGGER.error(error);
            return false;
          }

          if (!LogManager.checkLogConfiguration(logConf)) {
            LOGGER.error("Le logger est mal configuré");
            return false;
          } 

        } else {
          LOGGER.fatal("Mauvaise configuration: Fichier de conf des logs inexistant : " + logConfPath);
          return false; 
        } 

      }
    }

    // Information sur les opérations

    LOGGER.debug("Vérification des informations sur les opérations");

    if (!userConfiguration.application.operations) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:operations' manquant !");
      return false;
    } else {

      // Dossier contenant les fichiers d'opérations
      if (!userConfiguration.application.operations.directory) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:operations:directory' manquant !");
        return false;
      } else {

        // On vérifie d'abord les paramètres car ils sont référencés dans les opérations
        if (!userConfiguration.application.operations.parameters) {
          LOGGER.fatal("Mauvaise configuration: Objet 'application:operations:parameters' manquant !");
          return false;
        } else {

          if (!userConfiguration.application.operations.parameters.directory) {
            LOGGER.fatal("Mauvaise configuration: Champ 'application:operations:parameters:directory' manquant !");
            return false;
          } else {

            // On vérifie que le dossier existe et qu'il contient des fichiers de description des paramètres              
            let parameterDirectory = "";

            try {
              parameterDirectory =  path.resolve(path.dirname(userConfigurationPath), userConfiguration.application.operations.parameters.directory);
            } catch (error) {
              LOGGER.fatal("Can't get absolute path of parameters directory: " + userConfiguration.application.operations.parameters.directory);
              LOGGER.fatal(error);
              return false;
            }

            if (!this._operationManager.checkParameterDirectory(parameterDirectory)) {
              LOGGER.error("Le dossier des parametres est mal configuré");
              return false;
            }

            // On vérifie que le dossier existe et qu'il contient des fichiers de description des opérations
            let operationDirectory = "";

            try {
              operationDirectory =  path.resolve(path.dirname(userConfigurationPath), userConfiguration.application.operations.directory);
            } catch (error) {
              LOGGER.fatal("Can't get absolute path of operations directory: " + userConfiguration.application.operations.directory);
              LOGGER.fatal(error);
              return false;
            }

            if (!this._operationManager.checkOperationDirectory(operationDirectory)) {
              LOGGER.error("Le dossier des operations est mal configuré");
              return false;
            }

          }

        }

      }

    }

    // Projections

    LOGGER.debug("Vérification des informations sur les projections");

    if (!userConfiguration.application.projections) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:projections' manquant !");
      return false;
    } else {

      if (!userConfiguration.application.projections.directory) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:projections:directory' manquant !");
        return false; 
      } else {


        let directory =  path.resolve(path.dirname(userConfigurationPath), userConfiguration.application.projections.directory);

        if (!this._projectionManager.checkProjectionDirectory(directory)) {
          LOGGER.fatal("La configuration des projections du dossier est incorrecte");
          return false;
        } 

      }

    }

    // Information sur les sources 
    LOGGER.debug("Vérification des informations sur les sources");

    if (!userConfiguration.application.sources) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:sources' manquant !");
      return false;
    } else {
      // Dossier contenant les fichiers de sources
      if (!userConfiguration.application.sources.directories) {
        LOGGER.fatal("Mauvaise configuration: Champ 'application:sources:directories' manquant !");
        return false;
      } else {

        let sourcesDirectories = userConfiguration.application.sources.directories;
        // On vérifie que c'est un tableau non vide
        if (!Array.isArray(sourcesDirectories)) {
          LOGGER.error("Mauvaise configuration: Champ 'application:sources:directories' n'est pas un tableau !");
          return false;
        }
        if (sourcesDirectories.length === 0) {
          LOGGER.error("Mauvaise configuration: Champ 'application:sources:directories' est un tableau vide !");
          return false;
        }

        let oneValidDir = false;

        for (let i = 0; i < sourcesDirectories.length; i++) {

          // On vérifie que le dossier existe et qu'il contient des fichiers de description des ressources
          if (sourcesDirectories[i] === "") {
            LOGGER.warn("Mauvaise configuration: Champ 'application:sources:directories' contient un élément vide");
            continue;
          } else {

            let directory =  path.resolve(path.dirname(userConfigurationPath), sourcesDirectories[i]);
            
            if (!(await this._sourceManager.checkSourceDirectory(directory))) {
              LOGGER.error("Le dossier " + directory + " contient des sources dont la vérification a échoué");
              return false;
            } else {
              LOGGER.info("Le dossier " + directory + " est vérifié et suffisamment validé pour continuer");
              oneValidDir = true;
            }

          }
          
        }

        if (!oneValidDir) {
          LOGGER.error("Aucun dossier de source n'a été validé");
          return false;
        }

      }
      
    } 

    // Information sur les ressources

    LOGGER.debug("Vérification des informations sur les ressources");

    if (!userConfiguration.application.resources) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:resources' manquant !");
      return false;
    } else {
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

        let oneValidDir = false;

        for (let i = 0; i < resourcesDirectories.length; i++) {

          // On vérifie que le dossier existe et qu'il contient des fichiers de description des ressources
          if (resourcesDirectories[i] === "") {
            LOGGER.warn("Mauvaise configuration: Champ 'application:resources:directories' contient un élément vide");
            continue;
          } else {

            let directory =  path.resolve(path.dirname(userConfigurationPath), resourcesDirectories[i]);
            
            if (!this._resourceManager.checkResourceDirectory(directory)) {
              LOGGER.error("Le dossier " + directory + " contient des ressources dont la vérification a échoué");
              return false;
            } else {
              LOGGER.info("Le dossier " + directory + " est vérifié et suffisamment validé pour continuer");
              oneValidDir = true;
            }

          }
          
        }

        if (!oneValidDir) {
          LOGGER.error("Aucun dossier de ressource n'a été validé");
          return false;
        }

      }
      
    } 

    // Information sur le reseau

    LOGGER.debug("Vérification des informations sur le réseau");

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
        if (!this._serverManager.checkServerConfiguration(userConfiguration.application.network.servers[i])) {
          LOGGER.fatal("Mauvaise configuration d'un serveur !");
          return false;
        } else {
          this._serverManager.saveServerConfiguration(userConfiguration.application.network.servers[i]);
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

    // Les APIs

    LOGGER.debug("Vérification des informations sur les APIs");

    if (!userConfiguration.application.apis) {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:apis' manquant !");
      return false;
    } else {

      if (!Array.isArray(userConfiguration.application.apis)) {
        LOGGER.fatal("Mauvaise configuration: Objet 'application:apis' n'est pas un tableau !");
        return false;
      }

      if (userConfiguration.application.apis.length === 0) {
        LOGGER.fatal("Mauvaise configuration: Objet 'application:apis' est un tableau vide !");
        return false;
      } else {

        for (let i = 0; i < userConfiguration.application.apis.length; i++) {
          if (!this._apisManager.checkApiConfiguration(userConfiguration.application.apis[i])) {
            LOGGER.fatal("Mauvaise configuration: Objet 'application:apis' contient un objet invalide");
            return false;
          }
        }

      }

    }

    // Nettoyage de tous les managers

    LOGGER.debug("Nettoyage des managers");

    this._projectionManager.flushCheckedProjection();
    this._baseManager.flushCheckedBaseConfiguration();
    this._operationManager.flushCheckedOperation();
    this._resourceManager.flushCheckedResource();
    this._sourceManager.flushCheckedSource();
    this._serverManager.flushCheckedServer();

    LOGGER.info("Verification terminee.");

    return true;

  }

  /**
  *
  * @function
  * @name saveServiceConfiguration
  * @description Sauvegarde de la configuration du service
  * @param {json} configuration - Configuration du service (contenu du service.json)
  * @param {string} configurationPath - Chemin de la configuration du service (chemin du service.json)
  * @param {json} logConfiguration - Configuration des logs du service (contenu du log4js.json)
  *
  */
  saveServiceConfiguration(configuration, configurationPath, logConfiguration) {

    this._configuration = configuration;
    this._configurationPath = configurationPath;
    this._logConfiguration = logConfiguration;

  }

  /**
  *
  * @function
  * @name loadServiceConfiguration
  * @description Chargement de la configuration du service
  *
  */
  loadServiceConfiguration() {

    LOGGER.info("Chargement de la configuration du service...");

    // Chargement des opérations
    LOGGER.info("Chargement des operations...");
    
    let parametersDirectory = "";
    try {
      parametersDirectory = path.resolve(path.dirname(this._configurationPath), this._configuration.application.operations.parameters.directory);
    } catch (error) {
      LOGGER.error("Impossible d'avoir le chemin aboslu du dossier des parametres: " + this._configuration.application.operations.parameters.directory);
      LOGGER.error(error);
      return false;
    }

    if (!this._operationManager.loadParameterDirectory(parametersDirectory)) {
      LOGGER.error("Erreur lors du chargement des operations.");
      return false;
    }

    let operationsDirectory = "";
    try {
      operationsDirectory = path.resolve(path.dirname(this._configurationPath), this._configuration.application.operations.directory);
    } catch (error) {
      LOGGER.error("Impossible d'avoir le chemin aboslu du dossier des operations: " + this._configuration.application.operations.directory);
      LOGGER.error(error);
      return false;
    }

    if (!this._operationManager.loadOperationDirectory(operationsDirectory)) {
      LOGGER.error("Erreur lors du chargement des operations.");
      return false;
    }

    // Chargement des projections
    LOGGER.info("Chargement des projections...");

    let projectionsDirectory = "";
    try {
      projectionsDirectory = path.resolve(path.dirname(this._configurationPath), this._configuration.application.projections.directory);
    } catch (error) {
      LOGGER.error("Impossible d'avoir le chemin aboslu du dossier des projections: " + this._configuration.application.projections.directory);
      LOGGER.error(error);
      return false;
    }
    
    if (!this._projectionManager.loadProjectionDirectory(projectionsDirectory)) {
      LOGGER.error("Erreur lors du chargement des projections.");
      return false;
    }

    // Chargement des sources 
    LOGGER.info("Chargement des sources...");

    for (let i = 0; i < this._configuration.application.sources.directories.length; i++) {

      let sourceDirectory = "";

      try {
        sourceDirectory = path.resolve(path.dirname(this._configurationPath), this._configuration.application.sources.directories[i]);
        LOGGER.info("Dossier de sources : " + sourceDirectory);
      } catch (error) {
        LOGGER.error("Impossible d'obtenir le chemin absolu du dossier de sources: " + this._configuration.application.sources.directories[i]);
        LOGGER.error(error);
        continue;
      }
      
      if (!this._sourceManager.loadSourceDirectory(sourceDirectory)) {
        LOGGER.error("Impossible de charger correctement le dossier de sources " + sourceDirectory);
      } else {
        // On va continuer 
        LOGGER.info("Les sources du dossier " + sourceDirectory + " sont chargées dans la mesure du possible")
      }

    }

    if (this._sourceManager.sources.length === 0) {
      LOGGER.fatal("Aucune ressource n'a pu etre chargee");
      return false;
    }

    // Chargement des ressources
    LOGGER.info("Chargement des ressources...");

    for (let i = 0; i < this._configuration.application.resources.directories.length; i++) {

      let resourceDirectory = "";

      try {
        resourceDirectory = path.resolve(path.dirname(this._configurationPath), this._configuration.application.resources.directories[i]);
        LOGGER.info("Dossier de ressources : " + resourceDirectory);
      } catch (error) {
        LOGGER.error("Impossible d'obtenir le chemin absolu du dossier de ressources: " + this._configuration.application.resources.directories[i]);
        LOGGER.error(error);
        continue;
      }
      
      if (!this._resourceManager.loadResourceDirectory(resourceDirectory)) {
        LOGGER.error("Impossible de charger correctement le dossier de ressources " + resourceDirectory);
      } else {
        // On va continuer 
        LOGGER.info("Les ressources du dossier " + resourceDirectory + " sont chargées dans la mesure du possible")
      }

    }

    if (this._resourceManager.resource.length === 0) {
      LOGGER.fatal("Aucune ressource n'a pu etre chargee");
      return false;
    }

    // Chargement des serveurs
    LOGGER.info("Creation de l'application ExpressJS...");

    // Application Express
    let road2 = express();

    // Stockage de l'instance Service dans l'app expressJS afin que les informations soient accessibles par les requêtes
    road2.set("service", this);

    // Initialisation des CORS 
    LOGGER.info("Initialisation des cors...");

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
    
    // Chargement des APIs indiquées dans la conf 
    LOGGER.info("Chargement des APIs indiquées dans la configuration...");

    for (let i = 0; i < this._configuration.application.apis.length; i++) {
      let apiConfiguration = this._configuration.application.apis[i];
      if (!this._apisManager.loadApiConfiguration(road2, apiConfiguration)) {
        LOGGER.fatal("Impossible de créer l'API " + apiConfiguration.name + "/" + apiConfiguration.version);
        return false;
      }
    }

    road2.all('/', (req, res) => {
      res.send('Road2');
    });

    // Création des serveurs indiqués dans la conf
    LOGGER.info("Chargement des serveurs...");

    for (let i = 0; i < this._configuration.application.network.servers.length; i++) {
      
      let serverConf = this._configuration.application.network.servers[i];
      LOGGER.info("Chargement du serveur : " + serverConf.id);

      if (!this._serverManager.loadServerConfiguration(road2, serverConf)) {
        LOGGER.fatal("Impossible de creer le serveur");
        return false;
      } else {
        LOGGER.info("Serveur chargé");
      }
    }

    return true;

  }

  /**
  *
  * @function
  * @name connectSources
  * @description Connecter toutes les sources du service
  *
  */
  async connectSources() {

    LOGGER.info("Connexion des sources du service...");

    // Connexion des sources
    if (!(await this._sourceManager.connectAllSources())) {
      LOGGER.fatal("Impossible de connecter toutes les sources du service");
      return false;
    } else {
      LOGGER.info("Les sources du service potentiellement connectables ont été connectées");
      return true;
    }

  }

  /**
  *
  * @function
  * @name startServers
  * @description Démarrage des serveurs du service
  *
  */
    async startServers() {

    LOGGER.info("Démarrage des serveurs du service...");

    if (!(await this._serverManager.startAllServers())) {
      LOGGER.fatal("Impossible de démarrer tous les serveurs.");
      return false;
    } else {
      LOGGER.info("Les serveurs du service ont été démarrés");
      return true;
    }

  }

  /**
  *
  * @function
  * @name stopServers
  * @description Arrêt du serveur
  *
  */

  async stopServers() {

    LOGGER.info("Extinction des serveurs...");

    if (!(await this._serverManager.stopAllServers())) {
      LOGGER.fatal("Impossible d'eteindre les serveurs.");
      return false;
    } else {
      LOGGER.info("Les serveurs du service sont éteints.");
      return true;
    }

  }

  /**
  *
  * @function
  * @name computeRequest
  * @description Fonction utilisée pour rediriger une requête vers le bon moteur.
  * Une requête se fait nécessairement sur une ressource. Cette ressource est indiquée dans la requête.
  * La ressource sait comment déterminer la source concernée par la requête.
  * Et la source interrogera le moteur.
  * @param {Request} request - Requête
  *
  */

  computeRequest(request) {
    // Récupération de la ressource
    // ---
    // L'id est dans la requête
    let resourceId = request.resource;
    // La ressource est dans le catalogue du resourceManager
    let resource = this._resourceManager.resource[resourceId];
    // ---

    // Récupération de la source concernée par la requête
    // ---
    // L'id est donné par le ressource
    let sourceId = resource.getSourceIdFromRequest(request);

    // La source est dans le catalogue du sourceManager
    let source = this._sourceManager.sources[sourceId];
    // ---

    //On renvoie la requête vers le moteur
    // ---
    // C'est la source qui fait le lien avec un moteur
    try {
      return source.computeRequest(request);
    } catch(err) {
      // TODO : modifier ce comportement
      return err;
    }
    // ---

  }

  /**
  *
  * @function
  * @name initIPC
  * @description Fonction utilisée pour permettra la communication IPC afin de traiter une requête venant de l'administrateur envoyée via ce protocol
  *
  */

  initIPC() {

    LOGGER.info("initIPC...");

    process.on('message', (request) => {

      LOGGER.debug("Service child received request: ");
      LOGGER.debug(request);

      // TODO : vérifier que le message vient bien du parent ? 

      let response;
      try {
        response = this.computeAdminRequest(request);
      } catch(error) {
        LOGGER.error("Erreur lors de l'exécution de la requête: " + error);
        error._uuid = request._uuid;
        error._errorFlag = true
        process.send(error);
        return false;
      }

      try {
        response._uuid = request._uuid;
        process.send(response);
      } catch(error) {
        // TODO : gestion plus fine du renvoi d'un message, il faudrait que l'administrateur vérifie l'état du canal
        LOGGER.error("Erreur lors de l'envoi de la réponse à la requête: " + error);
        error._uuid = request._uuid;
        error._errorFlag = true
        process.send(error);
        return false;
      }

      return true;

    });

    process.on('SIGTERM', async () => {

      LOGGER.debug("Réception du signal SIGTERM pour arrêter le service");

      if (await this.stopServers()) {
        LOGGER.debug("Les serveurs sont bien arrêtés, on peut sortir du service (exit)")
        process.exit(0);
      } else {
        LOGGER.fatal("Les serveurs ne se sont pas bien arrếtés");
        process.exit(1);
      }

    });
    
  }

  /**
  *
  * @function
  * @name computeAdminRequest
  * @description Fonction utilisée pour traiter une requête venant de l'administrateur
  * @param {object} request - Instance fille de la classe Request 
  *
  */

  computeAdminRequest(request) {

    LOGGER.info("computeAdminRequest...");

    // On part du principe qu'un maximum de vérifications ont été faites avant par l'administrateur
    // On essaye de réduire l'exécution par le service 

    // Le passage potentiel par IPC fait perdre les méthodes donc dans la suite, on est obligé de prendre les attributs avec _

    // En fonction du type de la requête, on va appeler différentes fonctions 
    // Le if est un choix modifiable. Pour le moment c'est ainsi car dans le cas du serviceProcess, on ne peut pas y échapper. 
    if (request._type === "healthRequest") {
      return this.computeHealthRequest(request);
    }else if (request._type === "projectionRequest") {
      return this.computeProjectionRequest(request);
    } else {
      throw errorManager.createError("Unknown request type");
    }

  }

  /**
  *
  * @function
  * @name computeHealthRequest
  * @description Fonction utilisée pour connaître l'état du service
  * @param {HealthRequest} healthRequest - Instance de la classe HealthRequest 
  *
  */

  computeHealthRequest(healthRequest) {

    LOGGER.info("computeHealthRequest...");

    let healthResponse = new HealthResponse();
    let nbRed = 0;
    let nbSources = this._sourceManager.loadedSourceId.length;
    let serviceState = {};
    serviceState.sources = new Array();

    // Récupération de la disponibilité de chaque source
    for (let sourceId in this._sourceManager.sources) {

      let sourceState = this._sourceManager.sources[sourceId].state;
      
      if (sourceState === "red") {
        nbRed++;
      } else if (sourceState === "green" || sourceState === "init") {
        // Les cas "green" et "init" sont considérés comme équivalent 
      } else {
        // État inconnu donc on lève une alerte et on le met manuellement à "unknown" pour ne pas renvoyer n'importe quoi à l'administrateur
        sourceState = "unknown";
        nbRed++;
      }

      serviceState.sources.push({id: sourceId, state: sourceState});

    }

    // Pour faire simple : 
    //  - un service est orange si une des sources est indisponible 
    //  - service est rouge si la moitié, ou plus, de ses sources sont indisponibles 
    if (nbRed > 0) {

      if (nbRed >= nbSources / 2) {
        serviceState.state = "red";
      } else {
        serviceState.state = "orange";
      }
      
    } else {
      serviceState.state = "green";
    }

    healthResponse.serviceStates.push(serviceState);
    return healthResponse;

  }

  /**
  *
  * @function
  * @name computeProjectionRequest
  * @description Fonction utilisée pour connaitre une projection utilisée par un service
  * @param {projectionRequest} projectionRequest - Instance de la classe projectionRequest 
  * @returns {projectionResponse} response - Instance de la classe projectionResponse
  *
  */

  computeProjectionRequest(projectionRequest){

    LOGGER.info("computeProjectionRequest...");

    // On doit utiliser les attributs avec _ car les méthodes ne sont pas disponible dans le cadre d'une communication IPC
    let projectionResponse = new ProjectionResponse();
    if ( !this._projectionManager.isProjectionLoaded(projectionRequest._projection)){      
      throw errorManager.createError(`Can't find projection ${projectionRequest._projection}`, 404);
    }  
    else{

      projectionResponse.id = projectionRequest._projection;
    }

    return projectionResponse;
  }

}
