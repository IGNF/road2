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
  * @name isOperationAvailable
  * @description Savoir si une opération est disponible
  *
  */
  isOperationAvailable(id) {
    if (this._listOfVerifiedOperationId.length !== 0) {
      for (let i = 0; i < this._listOfVerifiedOperationId.length; i++) {
        if (id === this._listOfVerifiedOperationId[i]) {
          return true;
        } else {
          // on continue
        }
      }
    } else {
      return false;
    }
    return false;
  }

  /**
  *
  * @function
  * @name loadOperationDirectory
  * @description Charger les opérations du dossier
  *
  */
  loadOperationDirectory(operationCatalog, userOperationDirectory, userParameterDirectory) {

    LOGGER.info("Chargement des operations...");

    // Vérification de l'existence du dossier operations
    let operationsDirectory = path.resolve(__dirname, userOperationDirectory);
    if (!fs.statSync(operationsDirectory).isDirectory()) {
      LOGGER.error("Le dossier contenant la configuration des operations n'existe pas: " + operationsDirectory);
      return false;
    }

    // Vérification de l'existence du dossier parameters
    let parametersDirectory = path.resolve(__dirname, userParameterDirectory);
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
          operationCatalog[operationConf.id] = new Operation(operationConf.id, operationConf.name, operationConf.description, parametersTable);

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

      if (operationConf.parameters.length !== 0) {
        // on vérifie la validité des ids de paramètre fournis
        for (let i = 0; i < operationConf.parameters.length; i++ ) {
          if (!this._parameterManager.isParameterAvailable(operationConf.parameters[i])) {
            LOGGER.error("L'operation précise un attribut qui n'est pas disponible: " + operationConf.parameters[i]);
            return false;
          } else {
            // on continue
          }
        }
      } else {
        LOGGER.error("L'operation ne contient pas d'attribut parameters valide");
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
          if (!this.isOperationAvailable(currentOperationConf.id)) {
            LOGGER.error("L'operation indiquee n'est pas disponible");
            return false;
          } else {
            // on continue
          }

        }

        if (!currentOperationConf.parameters) {
          LOGGER.error("L'objet representant l'operation n'a pas de parametres");
          return false;
        } else {

          if (currentOperationConf.parameters.length === 0) {
            LOGGER.error("L'objet representant l'operation ne contient aucun parametre");
            return false;
          } else {

            for (let j = 0; j < currentOperationConf.parameters.length; j++) {
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

    }

    return true;

  }

  /**
  *
  * @function
  * @name getResourceOperationConf
  * @description Récupérer la liste des opérations disponibles sur une ressource
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
          if (!this.isOperationAvailable(currentOperationConf.id)) {
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
  *
  */

  isAvailableInTable (operationId, resourceOperationTable) {

    if (resourceOperationTable.length === 0) {
      LOGGER.error("Le tableau d'operations est vide.")
      return false;
    } else {
      LOGGER.info("Test");
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
  *
  */
  createResourceOperation(resourceOperationHash, resourceJsonObject) {

    LOGGER.info("Creation des operations de la ressource");

    // on crée les opérations unes à une
    for (let i = 0; i < resourceJsonObject.resource.availableOperations.length; i++) {

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
