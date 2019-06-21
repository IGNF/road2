'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const ApisManager = require('../apis/apisManager');
const ResourceManager = require('../resources/resourceManager');
const errorManager = require('../utils/errorManager');
const SourceManager = require('../sources/sourceManager');
const OperationManager = require('../operations/operationManager');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("SERVICE");

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

    // Manager des opérations disponibles sur le service
    this._operationManager = new OperationManager();

    // catalogue des opérations disponibles
    this._operationCatalog = {};

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

    // Instance du serveur NodeJS (retour de app.listen d'ExpressJS)
    this._server = {};

    // Port du serveur
    this._port = "";

    // Host pour ExpressJS
    this._host = "";

    // Stockage de la configuration
    this._configuration = {};

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
  * @name get resourceCatalog
  * @description Récupérer l'ensemble des ressources
  *
  */
  get operationCatalog() {
    return this._operationCatalog;
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
    if (this._operationCatalog[operationId]) {
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
    if (this._operationCatalog[operationId]) {
      return this._operationCatalog[operationId];
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
  * @param {string} userPort - Port du serveur pour ExpressJS
  * @param {string} userHost - Host pour ExpressJS
  *
  */

  checkAndSaveGlobalConfiguration(userConfiguration, userPort, userHost) {

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
        let directory =  path.resolve(__dirname,userConfiguration.application.operations.directory);
        if (fs.existsSync(directory)) {
          // On vérifie que l'application peut lire les fichiers du dossier
          fs.readdirSync(directory).forEach(operation => {
            try {
              var file = directory + "/" + operation;
              fs.accessSync(file, fs.constants.R_OK);
            } catch (err) {
              LOGGER.error("Le fichier " + file + " ne peut etre lu.");
            }
          });
          // On vérifie que la partie concernant les paramètres est bien renseignée
          if (!userConfiguration.application.operations.parameters) {
            LOGGER.fatal("Mauvaise configuration: Champ 'application:operations:parameters' manquant !");
            return false;
          } else {
            if (!userConfiguration.application.operations.parameters.directory) {
              LOGGER.fatal("Mauvaise configuration: Champ 'application:operations:parameters:directory' manquant !");
              return false;
            } else {
              // On vérifie que le dossier existe et qu'il contient des fichiers de description des paramètres
              let directory =  path.resolve(__dirname,userConfiguration.application.operations.parameters.directory);
              if (fs.existsSync(directory)) {
                // On vérifie que l'application peut lire les fichiers du dossier
                fs.readdirSync(directory).forEach(parameter => {
                  try {
                    var file = directory + "/" + parameter;
                    fs.accessSync(file, fs.constants.R_OK);
                  } catch (err) {
                    LOGGER.error("Le fichier " + file + " ne peut etre lu.");
                  }
                });
              } else {
                LOGGER.fatal("Mauvaise configuration: Le dossier " + directory + " n'existe pas.");
                return false;
              }
            }
          }
        } else {
          LOGGER.fatal("Mauvaise configuration: Le dossier " + directory + " n'existe pas.");
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

        for (let i = 0; i < resourcesDirectories.length; i++) {

          // On vérifie que le dossier existe et qu'il contient des fichiers de description des ressources
          let directory =  path.resolve(__dirname, resourcesDirectories[i]);
          if (fs.existsSync(directory)) {
            // On vérifie que l'application peut lire les fichiers du dossier
            fs.readdirSync(directory).forEach(resource => {
              try {
                var file = directory + "/" + resource;
                fs.accessSync(file, fs.constants.R_OK);
              } catch (err) {
                LOGGER.error("Le fichier " + file + " ne peut etre lu.");
              }
            });
          } else {
            LOGGER.fatal("Mauvaise configuration: Le dossier " + directory + " n'existe pas.");
            return false;
          }

        }

      }
    } else {
      LOGGER.fatal("Mauvaise configuration: Objet 'application:resources' manquant !");
      return false;
    }
    // Information sur le reseau
    if (!userHost) {
      if (userConfiguration.application.network) {
        // Host
        if (!userConfiguration.application.network.host) {
          LOGGER.info("Le champ 'application:network:host' n'est pas renseigne.");
          this._host = "0.0.0.0";
        } else {
          // Vérification du paramètre
          let tmpHost = userConfiguration.application.network.host.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g);
          if (!tmpHost) {
            LOGGER.fatal("L'objet 'application:network:host' est mal renseigne.");
            return false;
          } else {
            this._host = userConfiguration.application.network.host;
          }
        }
      } else {
        LOGGER.info("L'objet 'application:network:host' n'est pas renseigne.");
        this._host = "0.0.0.0";
      }
    } else {
      LOGGER.info("Le parametre ROAD2_HOST n'est pas renseigne.");
      this._host = "0.0.0.0";
    }
    if (!userPort) {
      if (userConfiguration.application.network) {
        // Port
        if (!userConfiguration.application.network.port) {
          LOGGER.info("Le champ 'application:network:port' n'est pas renseigne.");
          this._port = "8080";
        } else {
          // Vérification du paramètre
          let tmpPort = userConfiguration.application.network.port.match(/^\d{1,5}$/g);
          if (!tmpPort) {
            LOGGER.fatal("L'objet 'application:network:port' est mal renseigne.");
            return false;
          } else {

            if (tmpPort > 65536) {
              LOGGER.fatal("L'objet 'application:network:port' est mal renseigne: Numero de port invalide");
              return false;
            } else {
              this._port = userConfiguration.application.network.port;
            }

          }
        }
      } else {
        LOGGER.info("L'objet 'application:network:port' n'est pas renseigne.");
        this._port = "8080";
      }
    } else {
      LOGGER.info("Le parametre ROAD2_PORT n'est pas renseigne.");
      this._port = "8080";
    }

    LOGGER.info("Verification terminee.");
    this._configuration = userConfiguration;
    return true;

  }


  /**
  *
  * @function
  * @name loadOperations
  * @description Chargement des opérations
  * @param {string} operationsDirectory - Dossier contenant les opérations à charger
  * @param {string} parametersDirectory - Dossier contenant les paramètres à charger
  *
  */

  loadOperations(operationsDirectory, parametersDirectory) {

    LOGGER.info("Chargement des operations...");

    if (!operationsDirectory) {
      operationsDirectory = this._configuration.application.operations.directory;
    }

    if (!parametersDirectory) {
      parametersDirectory = this._configuration.application.operations.parameters.directory;
    }

    if (!this._operationManager.loadOperationDirectory(this._operationCatalog, operationsDirectory, parametersDirectory)) {
      LOGGER.error("Erreur lors du chargement des operations.");
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name loadResources
  * @description Chargement des ressources
  * @param {table} userResourceDirectories - Tableau de dossiers contenant les ressources à charger
  *
  */

  loadResources(userResourceDirectories) {

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

      let resourceDirectory =  path.resolve(__dirname, userResourceDirectories[i]);

      // Pour chaque fichier du dossier des ressources, on crée une ressource
      let test = fs.readdirSync(resourceDirectory).filter( (file) => {
        return path.extname(file).toLowerCase() === ".resource";
      }).forEach(fileName => {

        let resourceFile = resourceDirectory + "/" + fileName;
        LOGGER.info("Chargement de: " + resourceFile);

        // Récupération du contenu en objet pour vérification puis création de la ressource
        try {

          let resourceContent = JSON.parse(fs.readFileSync(resourceFile));
          // Vérification du contenu
          if (!this._resourceManager.checkResource(resourceContent,this._sourceManager, this._operationManager)) {
            LOGGER.error("Erreur lors du chargement de: " + resourceFile);
          } else {
            // Création de la ressource
            this._resourceCatalog[resourceContent.resource.id] = this._resourceManager.createResource(resourceContent, this._operationManager);
            loadedResources++;
          }

        } catch (error) {
          LOGGER.error(error);
          LOGGER.error("Erreur lors de la lecture de: " + resourceFile);
        }

      });

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
      for (let i = 0; i < listOfSourceIds.length; i++) {

        let sourceId = listOfSourceIds[i];
        LOGGER.info("Chargement de la source: " + sourceId);
        LOGGER.debug(sourceDescriptions[sourceId]);

        // On crée la source
        let currentSource = this._sourceManager.createSource(sourceDescriptions[sourceId]);

        // On vérifie que le source peut bien être chargée ou connectée
        try {
          await this._sourceManager.connectSource(currentSource);
          this._sourceCatalog[sourceId] = currentSource;
          loadedSources++;
        } catch (err) {
          // on n'a pas pu se connecter à la source
          // TODO: remplacer ce comportement par une gestion plus fine des ressources
          // si une source ne peut être chargée alors on supprime l'ensemble des ressources qui l'utilisent
          LOGGER.fatal("Impossible de se connecter a la source: " + sourceId, err);
          throw errorManager.createError("Impossible de se connecter a la source");
        }
      }
    } else {
      LOGGER.fatal("Il n'y a aucune source a charger.");
      throw errorManager.createError("No source found");
    }

    if (loadedSources === 0) {
      LOGGER.fatal("Aucune source n'a pu etre chargee");
      throw errorManager.createError("No source found");
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

    if (this._logConfiguration !== {}) {

      // Pour le log des requêtes reçues sur le service avec la syntaxe
      LOGGER.info("Instanciation du logger pour les requêtes...");
      road2.use(log4js.connectLogger(log4js.getLogger('request'), {
        level: this._logConfiguration.httpConf.level,
        format: (req, res, format) => format(this._logConfiguration.httpConf.format)
      }));

    }

    // Chargement des APIs
    if (!this._apisManager.loadAPISDirectory(road2, userApiDirectory, userServerPrefix)) {
      LOGGER.error("Erreur lors du chargement des apis.");
      return false;
    }

    road2.all('/', (req, res) => {
      res.send('Road2 is running !! \n');
    });

    // Prêt à écouter
    this._server = road2.listen(this._port, this._host);
    LOGGER.info(`Road2 est fonctionnel (http://${this._host}:${this._port})`);

    return true;

  }

  /**
  *
  * @function
  * @name stopServer
  * @description Arrêt du serveur
  *
  */

  stopServer(callback) {

    this._server.close(callback);
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
