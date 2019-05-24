'use strict';

const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const Parameter = require('../parameters/parameter');

// Création du LOGGER
var LOGGER = log4js.getLogger("PARAMETERMANAGER");

/**
*
* @class
* @name parameterManager
* @description Classe modélisant le manager des opération pour un service.
*
*/

module.exports = class parameterManager  {


  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Operation
  *
  */
  constructor() {

    // Liste des ids appartenant aux paramètres vérifiés par le manager
    this._listOfVerifiedParameterId = new Array();

    // Stockage des configurations des paramètres
    this._parametersConfiguration = {};

  }

  /**
  *
  * @function
  * @name get listOfVerifiedParameterId
  * @description Récupérer l'ensemble des ids appartenant aux paramètres vérifiés par le manager
  *
  */
  get listOfVerifiedParameterId() {
    return this._listOfVerifiedParameterId;
  }

  /**
  *
  * @function
  * @name get parametersConfiguration
  * @description Récupérer l'ensemble des configurations appartenant aux paramètres vérifiés par le manager
  *
  */
  get parametersConfiguration() {
    return this._parametersConfiguration;
  }

  /**
  *
  * @function
  * @name getParameterConfigurationById
  * @description Récupérer la configuration d'un paramètre via son id
  *
  */
  getParameterConfigurationById(id) {
    if (this._parametersConfiguration[id]) {
      return this._parametersConfiguration[id];
    } else {
      return {};
    }
  }

  /**
  *
  * @function
  * @name isParameterAvailable
  * @description Permet de savoir si un paramètre est disponible, via son id
  *
  */
  isParameterAvailable(id) {
    if (this._listOfVerifiedParameterId.length !== 0) {
      for (let i=0; i < this._listOfVerifiedParameterId.length; i++) {
        if (id === this._listOfVerifiedParameterId[i]) {
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
  * @name loadParameterDirectory
  * @description Charger les paramètres du dossier
  *
  */
  loadParameterDirectory(parametersDirectory) {

    LOGGER.info("Chargement des parametres...");

    // Vérification de l'existence du dossier /dir/parameters
    if (!fs.statSync(parametersDirectory).isDirectory()) {
      LOGGER.error("Le dossier contenant la configuration des parametres n'existe pas: " + parametersDirectory);
      return false;
    }

    // Chargement des paramètres
    // On les charge en premier pour qu'au moment du chargement des opérations, on connaisse déjà les identifiants des paramètres
    fs.readdirSync(parametersDirectory).forEach(parameterConfFileName => {

      let parameterConfFile = parametersDirectory + "/" + parameterConfFileName;

      if (fs.statSync(parameterConfFile).isFile()) {

        LOGGER.info("Chargement du parametre depuis " + parameterConfFile);

        // on récupère le contenu du fichier puis on le vérifie et enfin on stocke l'id si tout va bien
        let parameterConf = JSON.parse(fs.readFileSync(parameterConfFile));

        if (this.checkParameterConf(parameterConf)) {

          this._listOfVerifiedParameterId.push(parameterConf.id);
          this._parametersConfiguration[parameterConf.id] = parameterConf;

        } else {
          // s'il y a une erreur dans le fichier on arrête
          LOGGER.error("La configuration d'un parametres est incorrecte: " + parameterConfFile);
          return false;
        }

      } else {
        // On ne fait rien
      }

    });

    LOGGER.info("Parametres charges.");

    return true;

  }

  /**
  *
  * @function
  * @name checkParameterConf
  * @description Vérifier la configuration d'un paramètre
  *
  */
  checkParameterConf(parameterConf) {

    LOGGER.info("Verification du parametre");

    // ID
    if (!parameterConf.id) {
      LOGGER.error("Le parametre ne contient pas d'id");
      return false;
    } else {
      LOGGER.info(parameterConf.id);
      // On vérifie que l'id n'est pas déjà pris.
      if (this._listOfVerifiedParameterId.length !== 0) {

        for (let i = 0; i < this._listOfVerifiedParameterId.length; i++ ) {
          if (this._listOfVerifiedParameterId[i] === parameterConf.id) {
            LOGGER.info("Le parametre contenant l'id " + parameterConf.id + " est deja referencee.");
            return false;
          } else {
            // on continue de vérifier
          }
        }

      } else {
        // C'est le premier paramètre. On ne fait rien, on continue la vérification
      }

    }

    // Name
    if (!parameterConf.name) {
      LOGGER.error("Le parametre ne contient pas d'attribut name");
      return false;
    }

    // description
    if (!parameterConf.description) {
      LOGGER.error("Le parametre ne contient pas d'attribut description");
      return false;
    }

    // required
    if (!parameterConf.required) {
      LOGGER.error("Le parametre ne contient pas d'attribut required");
      return false;
    } else {
      //TODO: vérification
    }

    // default
    if (!parameterConf.defaultValue) {
      LOGGER.error("Le parametre ne contient pas d'attribut defaultValue");
      return false;
    } else {
      //TODO: vérification
    }

    // type
    if (!parameterConf.type) {
      LOGGER.error("Le parametre ne contient pas d'attribut type");
      return false;
    } else {
      // TODO: vérification
    }

    LOGGER.info("Parametre ok");
    return true;

  }

  /**
  *
  * @function
  * @name createParameters
  * @description Créer les objets paramètres à partir de la configuration d'une opération
  *
  */
  createParameters(operationConf) {

    let parametersTable = {};

    for (let i = 0; i < operationConf.parameters.length; i++ ) {

      let parameterId = operationConf.parameters[i];
      let parameterConf = this._parametersConfiguration[parameterId];

      parametersTable[parameterId] = new Parameter(parameterId, parameterConf.type, parameterConf.name, parameterConf.description, parameterConf.required, parameterConf.default);

    }

    return parametersTable;

  }


}
