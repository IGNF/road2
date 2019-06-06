'use strict';

const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const Parameter = require('../parameters/parameter');
const ResourceParameter = require('../parameters/resourceParameter');
const BoolParameter = require('../parameters/boolParameter');
const EnumParameter = require('../parameters/enumParameter');
const PointParameter = require('../parameters/pointParameter');

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

    // Stockage des configurations des paramètres de service
    this._parametersConfiguration = {};

    // Stockage des paramètres de service
    this._parameters = {};

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

    let tmpMin;
    let tmpMax;

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
      if (!(parameterConf.required === "true" || parameterConf.required === "false")) {
        LOGGER.error("Le parametre contient un attribut required mal configure");
        return false;
      }
    }

    // default
    if (!parameterConf.defaultValue) {
      LOGGER.error("Le parametre ne contient pas d'attribut defaultValue");
      return false;
    } else {
      if (!(parameterConf.defaultValue === "true" || parameterConf.defaultValue === "false")) {
        LOGGER.error("Le parametre contient un attribut defaultValue mal configure");
        return false;
      }
    }

    // type
    if (!parameterConf.type) {
      LOGGER.error("Le parametre ne contient pas d'attribut type");
      return false;
    } else {
      if (parameterConf.type !== "boolean" && parameterConf.type !== "enumeration" && parameterConf.type !== "point") {
        LOGGER.error("Le type du parametre est incorrect");
        return false;
      }
    }

    // example
    if (!parameterConf.example) {
      LOGGER.warn("Le parametre ne contient pas d'exemple");
    }

    // min
    if (parameterConf.min) {

      tmpMin = parseInt(parameterConf.min, 10);

      if (isNaN(tmpMin)) {
        LOGGER.error("Le parametre min est incorrect: valeur non entiere");
        return false;
      }
      if (parameter.required === "true") {
        if (tmpMin < 1) {
          LOGGER.error("Le parametre min est incorrect: valeur inferieure a 1");
          return false;
        }
      } else {
        if (tmpMin > 0) {
          LOGGER.error("Le parametre min est incorrect: valeur superieure a 0");
          return false;
        }
      }

    }

    // max
    if (parameterConf.max) {

      tmpMax = parseInt(parameterConf.max, 10);

      if (isNaN(tmpMax)) {
        LOGGER.error("Le parametre max est incorrect: valeur non entiere");
        return false;
      }

      if (tmpMax < 1) {
        LOGGER.error("Le parametre max est incorrect: valeur inferieure a 1");
        return false;
      }

    }

    // cohérence entre min et max
    if (parameterConf.max && parameterConf.min) {
      if (tmpMax < tmpMin) {
        LOGGER.error("Le parametre max est incorrect: valeur inferieure au parametre min");
        return false;
      }
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

      parametersTable[parameterId] = new Parameter(parameterId, parameterConf.type, parameterConf.name, parameterConf.description, parameterConf.required, parameterConf.defaultValue);

      if (parameterConf.example) {
        parametersTable[parameterId].example = parameterConf.example;
      }

      if (parameterConf.min) {
        parametersTable[parameterId].min = parameterConf.min;
      }

      if (parameterConf.max) {
        parametersTable[parameterId].max = parameterConf.max;
      }

      if (parameterConf.explode) {
        parametersTable[parameterId].explode = parameterConf.explode;
      }

      if (parameterConf.style) {
        parametersTable[parameterId].style = parameterConf.style;
      }

      // Stocakge du paramètre
      this._parameters[parameterId] = parametersTable[parameterId];

    }

    return parametersTable;

  }

  /**
  *
  * @function
  * @name checkResourceParameterConf
  * @description Vérifier la configuration d'un paramètre de ressource
  *
  */
  checkResourceParameterConf(resourceParameterJsonObject) {

    LOGGER.info("Verification du parametre de la ressource");

    if (!resourceParameterJsonObject.id) {
      LOGGER.error("L'objet representant un parametre n'a pas d'id");
      return false;
    } else {
      LOGGER.info(resourceParameterJsonObject.id);
    }

    // on vérifie qu'il est bien disponible pour cette instance du service
    if (!this.isParameterAvailable(resourceParameterJsonObject.id)) {
      LOGGER.error("Le parametre indique n'est pas disponible");
      return false;
    } else {
      // on continue
    }

    // on récupère la configuration du paramètre
    let serviceParameterConf = this._parametersConfiguration[resourceParameterJsonObject.id];
    if (!serviceParameterConf) {
      LOGGER.fatal("La configuration du parametre de service est introuvable !");
      return false;
    }

    // Le reste des vérifications va dépendre du type de paramètre

    if (serviceParameterConf.type === "boolean") {

      // Gestion des valeurs par défaut
      if (serviceParameterConf.defaultValue === "true") {
        // on doit avoir une valeur indiquée qui sera celle utilisée par défaut
        if (!resourceParameterJsonObject.defaultValueContent) {
          LOGGER.error("Le parametre ne contient pas de valeur par defaut alors qu'il doit en avoir un");
          return false;
        } else {

          if (resourceParameterJsonObject.defaultValueContent !== "true" && resourceParameterJsonObject.defaultValueContent !== "false") {
            LOGGER.error("La valeur par defaut est incorrecte par rapport à son type: boolean");
            return false;
          } else {
            // on continue
          }

        }
      } else {
        // il n'y a rien à faire
      }

      // Analyse des valeur que peut prendre le paramètre
      if (resourceParameterJsonObject.values) {
        // vu que c'est un boolean, ce champ permet uniquement de restreindre la valeur du paramètre
        if (resourceParameterJsonObject.values !== "true" && resourceParameterJsonObject.values !== "false") {
          LOGGER.error("La valeur du parametre est incorrecte par rapport à son type: boolean");
          return false;
        } else {
          // on continue
        }
      } else {
        // ce n'est pas obligatoire pour ce type
      }

    } else if (serviceParameterConf.type === "enumeration") {

      // Analyse des valeur que peut prendre le paramètre
      if (resourceParameterJsonObject.values) {

        if (resourceParameterJsonObject.values.length === 0) {
          LOGGER.error("Le parametre ne contient aucune valeur alors qu'il doit en avoir");
          return false;
        } else {
          // on continue, on le stockera plus tard
        }

      } else {
        LOGGER.error("Le parametre ne contient pas de valeurs alors qu'il doit en avoir");
        return false;
      }

      // Gestion des valeurs par défaut
      if (serviceParameterConf.defaultValue === "true") {
        // on doit avoir une valeur indiquée qui sera celle utilisée par défaut
        if (!resourceParameterJsonObject.defaultValueContent) {
          LOGGER.error("Le parametre ne contient pas de valeur par defaut alors qu'il doit en avoir un");
          return false;
        } else {

          let found = false;
          // ce champ doit contenir une valeur présente dans values
          for (let i= 0; i < resourceParameterJsonObject.values.length; i++) {
            if (resourceParameterJsonObject.defaultValueContent === resourceParameterJsonObject.values[i]) {
              found = true;
            }
          }

          if (!found) {
            LOGGER.error("Le parametre ne contient pas de valeur par defaut qui soit dans la liste des valeurs");
            return false;
          }

        }
      } else {
        // il n'y a rien à faire
      }

    } else if (serviceParameterConf.type === "point") {

      // Analyse des valeur que peut prendre le paramètre
      if (resourceParameterJsonObject.values) {

        if (!resourceParameterJsonObject.values.bbox) {
          LOGGER.error("Le parametre ne contient pas de bbox alors qu'il doit en avoir une");
          return false;
        } else {
          // TODO: analyse de la bbox
        }

      } else {
        LOGGER.error("Le parametre ne contient pas de valeurs alors qu'il doit en avoir");
        return false;
      }

      // Gestion des valeurs par défaut
      if (serviceParameterConf.defaultValue === "true") {
        // on doit avoir une valeur indiquée qui sera celle utilisée par défaut
        if (!resourceParameterJsonObject.defaultValueContent) {
          LOGGER.error("Le parametre ne contient pas de valeur par defaut alors qu'il doit en avoir un");
          return false;
        } else {
          // TODO: vérifier que le point est bien dans le bbox
        }
      } else {
        // il n'y a rien à faire
      }

    } else {
      LOGGER.fatal("La configuration du parametre de service est incorrecte !");
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name createResourceParameter
  * @description Créer l'ensemble des opérations d'une ressource
  *
  */
  createResourceParameter(resourceParameterHash, currentOperationConf) {

    LOGGER.info("Creation des parametres de l'operation");

    // on commence par faire les paramètres
    for (let j = 0; j < currentOperationConf.parameters.length; j++) {

      // on isole la conf du parametre de ressource
      let curResParamConf = currentOperationConf.parameters[j];
      LOGGER.info("Parametre en cours: " + curResParamConf.id);

      // on récupère la conf du paramètre de service correspondante
      let curSerParamConf = this._parametersConfiguration[curResParamConf.id];

      // on récupère le paramètre de service
      let curSerParam = this._parameters[curResParamConf.id];

      // en fonction du type, on crée le bon resourceParameter
      let curResParam = {};

      if (curSerParamConf.type === "boolean") {
        curResParam = new BoolParameter(curSerParam);
      } else if (curSerParamConf.type === "enumeration") {
        curResParam = new EnumParameter(curSerParam);
      } else if (curSerParamConf.type === "point") {
        curResParam = new PointParameter(curSerParam);
      } else {
        LOGGER.error("Type inconnu");
        return false;
      }

      // on initialise le paramètre
      if (!curResParam.load(curResParamConf)) {
        LOGGER.error("Initialisation du parametre en echec");
        return false;
      } else {
        // on le stocke
        resourceParameterHash[curResParamConf.id] = curResParam;
      }


    }


    return true;

  }


}
