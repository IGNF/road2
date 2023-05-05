'use strict';

const fs = require('fs');
const log4js = require('log4js');
const ParameterManager = require('../parameters/parameterManager');
const Operation = require('../operations/operation');
const ResourceOperation = require('../operations/resourceOperation');

// Création du LOGGER
var LOGGER = log4js.getLogger("OPERATIONMANAGER");

/**
*
* @class
* @name operationManager
* @description Classe modélisant le manager des opération pour un service.
*
*/

module.exports = class operationManager  {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Operation
  *
  */
  constructor() {

    // Liste des ids appartenant aux opérations chargées par le manager
    this._loadedOperationId = new Array();

    // Liste des ids appartenant aux opérations vérifiées par le manager
    this._checkedOperationId = new Array();

    // Parameter manager
    this._parameterManager = new ParameterManager();

    // catalogue des opérations disponibles
    this._operationCatalog = {};

    // Catalogue des configurations des opérations disponibles
    this._checkedOperationConfiguration = {};

  }

  /**
  *
  * @function
  * @name verifyCheckedOperation
  * @description Savoir si une opération est vérifiée sur le service
  * @param {string} operationId - Id de l'opération
  *
  */
  verifyCheckedOperation(operationId) {

    for (let i = 0; i < this._checkedOperationId.length; i++) {
      if (this._checkedOperationId[i] === operationId) {
        return true;
      }
    }
    return false;

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
  * @name get checkOperationDirectory
  * @description Vérifier les configurations d'opération d'un dossier 
  * @param {string} directory - Dossier qui contient les configurations d'opération à vérifier
  *
  */
  checkOperationDirectory(directory) {

    LOGGER.info("Vérification du dossier d'opération...");

    if (!fs.existsSync(directory)) {
      LOGGER.error("Le dossier" + directory + "n'existe pas");
      return false;
    }

    // On vérifie que l'application peut lire les fichiers du dossier
    if (!fs.readdirSync(directory).every(operation => {

      let operationFile = "";

      try {
        operationFile = directory + "/" + operation;
        fs.accessSync(operationFile, fs.constants.R_OK);
      } catch (err) {
        LOGGER.error("Le fichier d'operation ne peut etre lu: " + operationFile);
      }

      let fileContent = {};
      try {
        // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
        fileContent = JSON.parse(fs.readFileSync(operationFile));
      } catch (error) {
        LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier d'operation: " + operationFile);
        LOGGER.error(error);
        return false;
      }

      if (!this.checkOperationConfiguration(fileContent)) {
        LOGGER.error("Operation mal configurée");
        return false;
      } else {
        this._checkedOperationId.push(fileContent.id);
        this._checkedOperationConfiguration[fileContent.id] = fileContent;
        LOGGER.info("Operation bien configurée");
        return true;
      }

    })
    ) {
      LOGGER.error("Une des opérations est mal configurée");
      return false;
    }

    return true;
    
  }

  /**
  *
  * @function
  * @name checkOperationConfiguration
  * @description Vérifier la configuration d'une opération
  * @param {json} operationConf - Configuration d'une opération de service
  * @return {boolean}
  *
  */
   checkOperationConfiguration(operationConf) {

    LOGGER.info("Verification de l'operation");

    // ID
    if (!operationConf.id) {
      LOGGER.error("L'operation ne contient pas d'id");
      return false;
    } else {

      // On vérifie que l'id n'est pas déjà chargé.
      if (this._loadedOperationId.length !== 0) {

        for (let i = 0; i < this._loadedOperationId.length; i++ ) {
          if (this._loadedOperationId[i] === operationConf.id) {
            LOGGER.info("L'operation contenant l'id " + operationConf.id + " est deja chargée.");
            return false;
          } else {
            // on continue de vérifier
          }
        }

      } else {
        // C'est la première operation. On ne fait rien, on continue la vérification
      }

      // On vérifie que l'id n'est pas déjà vérifié.
      if (this._checkedOperationId.length !== 0) {

        for (let i = 0; i < this._checkedOperationId.length; i++ ) {
          if (this._checkedOperationId[i] === operationConf.id) {
            LOGGER.info("L'operation contenant l'id " + operationConf.id + " est deja vérifié.");
            return false;
          } else {
            // on continue de vérifier
          }
        }

      } else {
        // C'est la première operation. On ne fait rien, on continue la vérification
      }

    }

    // Name
    if (!operationConf.name) {
      LOGGER.error("L'operation ne contient pas d'attribut name");
      return false;
    }

    // description
    if (!operationConf.description) {
      LOGGER.error("L'operation ne contient pas d'attribut description");
      return false;
    }

    // parameters
    if (!operationConf.parameters) {
      LOGGER.error("L'operation ne contient pas d'attribut parameters");
      return false;
    } else {

      if (!Array.isArray(operationConf.parameters)) {
        LOGGER.error("Les parametres de l'operation ne sont pas dans un tableau");
        return false; 
      }

      if (operationConf.parameters.length !== 0) {
        // on vérifie la validité des ids de paramètre fournis
        for (let i = 0; i < operationConf.parameters.length; i++ ) {
          if (!this._parameterManager.isParameterChecked(operationConf.parameters[i])) {
            LOGGER.error("L'operation précise un parametre qui n'est pas disponible: " + operationConf.parameters[i]);
            return false;
          } else {
            // on continue
          }
        }
      } else {
        LOGGER.error("Le tableau des parametres est vide");
        return false;
      }

    }

    return true;

  }

  /**
  *
  * @function
  * @name flushCheckedOperation
  * @description Vider la liste des opérations et paramètres déjà vérifiés 
  *
  */
  flushCheckedOperation() {

    this._checkedOperationId = new Array();
    this._checkedOperationConfiguration = {};
    this._parameterManager.flushCheckedParameter();

  }

  /**
  *
  * @function
  * @name checkParameterDirectory
  * @description Vérifier les configurations de paramètre d'un dossier 
  * @param {string} directory - Dossier qui contient les configurations de paramètre à vérifier
  *
  */
  checkParameterDirectory(directory) {

    return this._parameterManager.checkParameterDirectory(directory);

  }

  /**
  *
  * @function
  * @name loadParameterDirectory
  * @description Charger les configurations de paramètre d'un dossier 
  * @param {string} directory - Dossier qui contient les configurations de paramètre à charger
  *
  */
  loadParameterDirectory(directory) {

    return this._parameterManager.loadParameterDirectory(directory);

  }

  /**
  *
  * @function
  * @name loadOperationDirectory
  * @description Charger les opérations du dossier
  * @param {string} operationsDirectory - Dossier contenant les opérations (chemin absolu)
  * @return {boolean}
  *
  */
  loadOperationDirectory(operationsDirectory) {

    LOGGER.info("Chargement des operations d'un dossier...");

    // Vérification de l'existence du dossier operations
    if (!fs.statSync(operationsDirectory).isDirectory()) {
      LOGGER.error("Le dossier contenant la configuration des operations n'existe pas: " + operationsDirectory);
      return false;
    }

    // Chargement des opérations
    if (!fs.readdirSync(operationsDirectory).every(operationConfFileName => {

      let operationConfFile = operationsDirectory + "/" + operationConfFileName;

      if (fs.statSync(operationConfFile).isFile()) {

        // on récupère le contenu du fichier puis on le vérifie
        let operationConf = {};
        try {
          operationConf = JSON.parse(fs.readFileSync(operationConfFile));
        } catch(error) {
          LOGGER.error("Impossible de lire la configuration de l'opération dans le fichier " + operationConfFile);
          return false;
        }
        
        if (!this.loadOperationConfiguration(operationConf)) {
          LOGGER.error("Impossible de charger l'opération configurée dans le fichier " + operationConfFile);
          return false;
        }

      } else {
        // On ne fait rien
      }
      
      return true;

    })
    ) {
      LOGGER.error("Une des opérations n'a pas pu être chargée");
      return false;
    }

    LOGGER.info("Operations chargees.");

    return true;

  }

  /**
  *
  * @function
  * @name loadOperationConfiguration
  * @description Charger une opération à partir de sa configuration
  * @param {object} operationConf - Configuration de l'opération
  * @return {boolean}
  *
  */
  loadOperationConfiguration(operationConf) {

    // on crée l'opération et on l'ajoute au catalogue
    // pour créer l'opération, il faut d'abord récupérer les paramètres
    let parametersTable = this._parameterManager.getParameters(operationConf);

    if (parametersTable === null) {
      LOGGER.error("Impossible de récuperer l'ensemble des parametres pour créer l'opération");
      return false;
    } else {
      if (parametersTable.length === 0) {
        LOGGER.error("Impossible de récuperer les parametres pour créer l'opération");
        return false;
      } else {
        this._operationCatalog[operationConf.id] = new Operation(operationConf.id, operationConf.name, operationConf.description, parametersTable);
      }
    }
    
    // on stocke l'id si tout va bien
    this._loadedOperationId.push(operationConf.id);

    return true;

  }

  /**
  *
  * @function
  * @name checkResourceOperationConfiguration
  * @description Vérifier la configuration d'une opération de ressource
  * @param {json} resourceOperationJsonObject - Configuration d'une opération de ressource
  * @return {boolean}
  *
  */
  checkResourceOperationConfiguration(resourceOperationJsonObject) {

    LOGGER.info("Verification de l'operation de la ressource...");

    if (!Array.isArray(resourceOperationJsonObject)) {
      LOGGER.error("Mauvais configuration : la configuration d'opérations fournie n'est pas un tableau");
      return false;
    }

    // on regarde d'abord la taille du tableau donné en entrée
    if (resourceOperationJsonObject.length === 0) {
      LOGGER.error("Il n'y aucune operation decrite");
      return false;
    } else {

      // on vérifie les opérations unes à une
      for (let i = 0; i < resourceOperationJsonObject.length; i++) {
        let currentOperationConf = resourceOperationJsonObject[i];

        if (!currentOperationConf.id) {
          LOGGER.error("L'objet representant l'operation n'a pas d'id");
          return false;
        } else {

          LOGGER.info(currentOperationConf.id);

          // on vérifie qu'elle est bien disponible pour cette instance du service
          if (!this.verifyCheckedOperation(currentOperationConf.id)) {
            LOGGER.error("L'operation indiquee n'est pas disponible");
            // TODO: remplacer ce return par un continue pour affiner le chargement des ressources
            // par exemple, si la ressource indique une opération non disponible mais qu'on veuille quand même la charger pour les opérations disponibles
            return false;
          } else {
            // on continue
          }

        }

        if (!currentOperationConf.parameters) {
          LOGGER.error("L'objet representant l'operation n'a pas de parametres");
          return false;
        } else {

          if (!Array.isArray(currentOperationConf.parameters)) {
            LOGGER.error("Les parametres de l'operation ne sont pas dans un tableau");
            return false;
          }

          if (currentOperationConf.parameters.length === 0) {
            LOGGER.error("L'objet representant l'operation ne contient aucun parametre");
            return false;
          } 

          // On prend la liste des paramètres censé être là et on vérifie qu'ils sont bien présents et valides
          // On compare le nombre de paramètres attendus au nombre de paramètres présents et on compare pour être certain qu'il n'y en ait pas trop
          let wantedParameters = this._checkedOperationConfiguration[currentOperationConf.id].parameters;

          if (wantedParameters.length !== currentOperationConf.parameters.length) {
            LOGGER.error("Le nombre de parametres presents n'est pas celui attendu");
            return false;
          }

          for(let j = 0; j < currentOperationConf.parameters.length; j++) {
            let currentParameterConf = currentOperationConf.parameters[j];

            if (!this._parameterManager.checkResourceParameterConfiguration(currentParameterConf)) {
              LOGGER.error("L'objet representant un parametre est mal configure");
              return false;
            } else {
              // on continue
            }
          }

          LOGGER.info("Operation de ressource bien configurée");

        }

      }

    }

    return true;

  }

  /**
  *
  * @function
  * @name loadResourceOperationConfiguration
  * @description Créer l'ensemble des opérations d'une ressource
  * @param {object} resourceOperationHash - Objet contenant les opérations de ressource
  * @param {json} resourceJsonObject - Configuration d'une opération de ressource
  * @return {boolean}
  *
  */
  loadResourceOperationConfiguration(resourceOperationHash, resourceJsonObject) {

    LOGGER.info("Creation des operations de la ressource");

    // on crée les opérations unes à une
    for (let i = 0; i < resourceJsonObject.resource.availableOperations.length; i++) {
      
      // on isole la conf de l'opération
      let currentOperationConf = resourceJsonObject.resource.availableOperations[i];
      LOGGER.info("Operation en cours: " + currentOperationConf.id);

      // création des paramètres de l'opération de ressource
      let resourceParameterHash = {};

      if (!this._parameterManager.loadResourceParameterConfiguration(resourceParameterHash, currentOperationConf)) {
        LOGGER.error("Erreur lors de la creation des parametres de l'operation");
        return false;
      }

      // création de l'objet et stockage
      resourceOperationHash[currentOperationConf.id] = new ResourceOperation(currentOperationConf.id, resourceParameterHash);

    }

    LOGGER.info("La creation des operations s'est bien deroulee");

    return true;

  }


}
