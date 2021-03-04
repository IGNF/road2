'use strict';

const fs = require('fs');
const path = require('path');
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

    // Liste des ids appartenant aux opérations vérifiées par le manager
    this._listOfVerifiedOperationId = new Array();

    // Parameter manager
    this._parameterManager = new ParameterManager();

    // catalogue des opérations disponibles
    this._operationCatalog = {};

    // Catalogue des configurations des opérations disponibles
    this._operationConfigurationCatalog = {};

  }

  /**
  *
  * @function
  * @name get listOfVerifiedOperationId
  * @description Récupérer l'ensemble des ids appartenant aux opérations vérifiées par le manager
  *
  */
  get listOfVerifiedOperationId() {
    return this._listOfVerifiedOperationId;
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
  * @name loadOperationDirectory
  * @description Charger les opérations du dossier
  * @param {string} userOperationDirectory - Dossier contenant les opérations (chemin absolu)
  * @param {string} userParameterDirectory - Dossier contenant les paramètres (chemin absolu)
  * @return {boolean}
  *
  */
  loadOperationDirectory(userOperationDirectory, userParameterDirectory) {

    LOGGER.info("Chargement des operations...");

    // Vérification de l'existence du dossier operations
    let operationsDirectory = userOperationDirectory;
    if (!fs.statSync(operationsDirectory).isDirectory()) {
      LOGGER.error("Le dossier contenant la configuration des operations n'existe pas: " + operationsDirectory);
      return false;
    }

    // Vérification de l'existence du dossier parameters
    let parametersDirectory = userParameterDirectory;
    if (!fs.statSync(parametersDirectory).isDirectory()) {
      LOGGER.error("Le dossier contenant la configuration des parametres n'existe pas: " + parametersDirectory);
      return false;
    }

    // Chargement des paramètres
    // C'est le parameterManager qui s'en charge
    if (!this._parameterManager.loadParameterDirectory(parametersDirectory)) {
      LOGGER.error("Erreur lors du chargement des parametres");
      return false;
    } else {
      LOGGER.info("Chargement des parametres ok");
    }

    // Chargement des opérations
    fs.readdirSync(operationsDirectory).forEach(operationConfFileName => {

      let operationConfFile = operationsDirectory + "/" + operationConfFileName;

      if (fs.statSync(operationConfFile).isFile()) {

        // on récupère le contenu du fichier puis on le vérifie
        let operationConf = JSON.parse(fs.readFileSync(operationConfFile));

        if (this.checkOperationConf(operationConf)) {
          // on stocke l'id si tout va bien
          this._listOfVerifiedOperationId.push(operationConf.id);
          // on crée l'opération et on l'ajoute au catalogue
          // pour créer l'opération, il faut d'abord créer les paramètres
          let parametersTable = this._parameterManager.createParameters(operationConf);
          this._operationConfigurationCatalog[operationConf.id] = operationConf;
          this._operationCatalog[operationConf.id] = new Operation(operationConf.id, operationConf.name, operationConf.description, parametersTable);

        } else {
          LOGGER.error("La configuration d'une operation est incorrecte: " + operationConfFile);
          return false;
        }

      } else {
        // On ne fait rien
      }

    });

    LOGGER.info("Operations chargees.");

    return true;

  }


  /**
  *
  * @function
  * @name checkOperationConf
  * @description Vérifier la configuration d'une opération
  * @param {json} operationConf - Configuration d'une opération de service
  * @return {boolean}
  *
  */
  checkOperationConf(operationConf) {

    LOGGER.info("Verification de l'operation");

    // ID
    if (!operationConf.id) {
      LOGGER.error("L'operation ne contient pas d'id");
      return false;
    } else {

      // On vérifie que l'id n'est pas déjà pris.
      if (this._listOfVerifiedOperationId.length !== 0) {

        for (let i = 0; i < this._listOfVerifiedOperationId.length; i++ ) {
          if (this._listOfVerifiedOperationId[i] === operationConf.id) {
            LOGGER.info("L'operation contenant l'id " + operationConf.id + " est deja referencee.");
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
          if (!this._parameterManager.isParameterAvailable(operationConf.parameters[i])) {
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
  * @name checkResourceOperationConf
  * @description Vérifier la configuration d'une opération de ressource
  * @param {json} resourceOperationJsonObject - Configuration d'une opération de ressource
  * @return {boolean}
  *
  */
  checkResourceOperationConf(resourceOperationJsonObject) {

    LOGGER.info("Verification de l'operation de la ressource");

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
          if (!this.verifyAvailabilityOperation(currentOperationConf.id)) {
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
          let wantedParameters = this._operationConfigurationCatalog[currentOperationConf.id].parameters;

          if (wantedParameters.length !== currentOperationConf.parameters.length) {
            LOGGER.error("Le nombre de parametres presents n'est pas celui attendu");
            return false;
          }

          for(let j = 0; j < currentOperationConf.parameters.length; j++) {
            let currentParameterConf = currentOperationConf.parameters[j];

            if (!this._parameterManager.checkResourceParameterConf(currentParameterConf)) {
              LOGGER.error("L'objet representant un parametre est mal configure");
              return false;
            } else {
              // on continue
            }
          }

        }

      }

    }

    return true;

  }

  /**
  *
  * @function
  * @name getResourceOperationConf
  * @description Récupérer la liste des opérations disponibles sur une ressource
  * @param {json} resourceOperationJsonObject - Configuration d'une opération de ressource
  * @param {table} operationTable - Tableau contenant les ids d'opérations de ressource
  * @return {boolean}
  *
  */
  getResourceOperationConf(resourceOperationJsonObject, operationTable) {

    LOGGER.info("Recuperation des operations de la ressource");

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
          if (!this.verifyAvailabilityOperation(currentOperationConf.id)) {
            LOGGER.error("L'operation indiquee n'est pas disponible");
            return false;
          } else {
            // on le stocke
            operationTable.push(currentOperationConf.id);
          }

        }

      }

    }

    return true;

  }

  /**
  *
  * @function
  * @name isAvailableInTable
  * @description Savoir si une opération est disponible dans une liste d'opérations de ressource
  * @param {string} operationId - Id de l'opération de ressource recherchée
  * @param {table} operationTable - Tableau contenant les ids d'opérations de ressource
  * @return {boolean}
  *
  */

  isAvailableInTable (operationId, resourceOperationTable) {

    if (resourceOperationTable.length === 0) {
      LOGGER.error("Le tableau d'operations est vide.")
      return false;
    } else {

      for (let i = 0; i < resourceOperationTable.length; i++) {
        LOGGER.info(resourceOperationTable[i]);
        if (operationId === resourceOperationTable[i]) {
          return true;
        }
      }

    }

    LOGGER.error("Operation non trouvee.")
    return false;
  }

  /**
  *
  * @function
  * @name createResourceOperation
  * @description Créer l'ensemble des opérations d'une ressource
  * @param {object} resourceOperationHash - Objet contenant les opérations de ressource
  * @param {json} resourceJsonObject - Configuration d'une opération de ressource
  * @return {boolean}
  *
  */
  createResourceOperation(resourceOperationHash, resourceJsonObject) {

    LOGGER.info("Creation des operations de la ressource");

    // on crée les opérations unes à une
    for (let i = 0; i < resourceJsonObject.resource.availableOperations.length; i++) {

      // TODO: tester à nouveau si l'opération est bien disponible sur le service
      // cela permet de ne charger que les opérations disponibles
      
      // on isole la conf de l'opération
      let currentOperationConf = resourceJsonObject.resource.availableOperations[i];
      LOGGER.info("Operation en cours: " + currentOperationConf.id);

      // création des paramètres de l'opération de ressource
      let resourceParameterHash = {};

      if (!this._parameterManager.createResourceParameter(resourceParameterHash, currentOperationConf)) {
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
