'use strict';

const fs = require('fs');
const log4js = require('log4js');
const Parameter = require('../parameters/parameter');
const BoolParameter = require('../parameters/boolParameter');
const EnumParameter = require('../parameters/enumParameter');
const PointParameter = require('../parameters/pointParameter');
const FloatParameter = require('../parameters/floatParameter');
const IntParameter = require('../parameters/intParameter');
const ConstraintParameter = require('../parameters/constraintParameter');

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

    // Liste des ids appartenant aux paramètres chargés par le manager
    this._loadedParameterId = new Array();

    // Liste des ids appartenant aux paramètres vérifiés par le manager
    this._checkedParameterId = new Array();

    // Stockage des configurations des paramètres de service
    this._parametersConfiguration = {};

    // Stockage des configurations des paramètres de service vérifiés par le manager
    this._checkedParametersConfiguration = {};

    // Stockage des paramètres de service
    this._parameters = {};

  }

  /**
  *
  * @function
  * @name get loadedParameterId
  * @description Récupérer l'ensemble des ids appartenant aux paramètres vérifiés par le manager
  *
  */
  get loadedParameterId() {
    return this._loadedParameterId;
  }

  /**
  *
  * @function
  * @name isParameterLoaded
  * @description Permet de savoir si un paramètre est disponible, via son id
  * @param {string} id - Id du paramètre de service
  * @return {boolean}
  *
  */
  isParameterLoaded(id) {
    if (this._loadedParameterId.length !== 0) {
      for (let i=0; i < this._loadedParameterId.length; i++) {
        if (id === this._loadedParameterId[i]) {
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
  * @name isParameterChecked
  * @description Permet de savoir si un paramètre a été vérifié, via son id
  * @param {string} id - Id du paramètre de service
  * @return {boolean}
  *
  */
  isParameterChecked(id) {
    if (this._checkedParameterId.length !== 0) {
      for (let i=0; i < this._checkedParameterId.length; i++) {
        if (id === this._checkedParameterId[i]) {
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
  * @name get checkParameterDirectory
  * @description Vérifier les configurations de paramètre d'un dossier 
  * @param {string} directory - Dossier qui contient les configurations de paramètre à vérifier
  *
  */
  checkParameterDirectory(directory) {

    if (!fs.existsSync(directory)) {
      LOGGER.fatal("Mauvaise configuration: Le dossier des parametres n'existe pas : " + directory);
      return false;
    } 

    // On vérifie que l'application peut lire les fichiers du dossier
    if (!fs.readdirSync(directory).every(parameter => {

      let parameterFile = "";

      try {
        parameterFile = directory + "/" + parameter;
        fs.accessSync(parameterFile, fs.constants.R_OK);
      } catch (err) {
        LOGGER.error("Le fichier de parametres ne peut etre lu: " + parameterFile);
      }

      let contentFile = {};
      try {
        // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
        contentFile = JSON.parse(fs.readFileSync(parameterFile));
      } catch (error) {
        LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de parametres: " + parameterFile);
        LOGGER.error(error);
        return false;
      }

      if (!this.checkParameterConfiguration(contentFile)) {
        LOGGER.error("Parametre mal configuré");
        return false;
      } else {
        this._checkedParameterId.push(contentFile.id);
        this._checkedParametersConfiguration[contentFile.id] = contentFile;
        LOGGER.info("Parametre bien configurée");
        return true;
      }

    })
    ) {
      LOGGER.error("Un des paramètres est mal configuré");
      return false;
    }

    return true;

  }

  /**
  *
  * @function
  * @name checkParameterConfiguration
  * @description Vérifier la configuration d'un paramètre
  * @param {json} parametersConf - Configuration du paramètre de service
  * @return {boolean}
  *
  */
   checkParameterConfiguration(parameterConf) {

    let tmpMin;
    let tmpMax;

    LOGGER.info("Verification du parametre");

    // ID
    if (!parameterConf.id) {
      LOGGER.error("Le parametre ne contient pas d'id");
      return false;
    } else {
      LOGGER.info(parameterConf.id);
      // On vérifie que l'id n'est pas déjà chargé.
      if (this._loadedParameterId.length !== 0) {

        for (let i = 0; i < this._loadedParameterId.length; i++ ) {
          if (this._loadedParameterId[i] === parameterConf.id) {
            LOGGER.info("Le parametre contenant l'id " + parameterConf.id + " est deja chargé.");
            return false;
          } else {
            // on continue de vérifier
          }
        }

      } else {
        // C'est le premier paramètre. On ne fait rien, on continue la vérification
      }

      // On vérifie que l'id n'est pas déjà vérifié.
      if (this._checkedParameterId.length !== 0) {

        for (let i = 0; i < this._checkedParameterId.length; i++ ) {
          if (this._checkedParameterId[i] === parameterConf.id) {
            LOGGER.info("Le parametre contenant l'id " + parameterConf.id + " est deja vérifié.");
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
      if (parameterConf.type !== "boolean"
        && parameterConf.type !== "enumeration"
        && parameterConf.type !== "point"
        && parameterConf.type !== "float"
        && parameterConf.type !== "integer"
        && parameterConf.type !== "constraint") {
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
      if (parameterConf.required === "true") {
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

    // explode et style
    if (parameterConf.explode) {

      if (parameterConf.explode !== "true" && parameterConf.explode !== "false") {
        LOGGER.error("Le parametre explode est incorrect");
        return false;
      } else {

        // Si explode=false alors on doit avoir une valeur pour style
        if (parameterConf.explode === "false") {
          if (parameterConf.style) {
            if (parameterConf.style !== "pipeDelimited") {
              LOGGER.error("Le parametre style est incorrect");
              return false;
            }
          } else {
            LOGGER.error("Le parametre style n'est pas present alors que explode=false");
            return false;
          }

        } else {
          // rien à vérifier
        }

      }
    }

    LOGGER.info("Parametre ok");
    return true;

  }

  /**
  *
  * @function
  * @name flushCheckedParameter
  * @description Vider la liste des paramètres déjà vérifiés 
  *
  */
  flushCheckedParameter() {

    this._checkedParameterId = new Array();
    this._checkedParametersConfiguration = {};
  
  }

  /**
  *
  * @function
  * @name loadParameterDirectory
  * @description Charger les paramètres du dossier
  * @param {string} parametersDirectory - Dossier contenant la description des paramètres
  * @return {boolean}
  *
  */
  loadParameterDirectory(parametersDirectory) {

    LOGGER.info("Chargement des parametres du dossier...");

    // Vérification de l'existence du dossier /dir/parameters
    if (!fs.statSync(parametersDirectory).isDirectory()) {
      LOGGER.error("Le dossier contenant la configuration des parametres n'existe pas: " + parametersDirectory);
      return false;
    }

    // Chargement des paramètres
    // On les charge en premier pour qu'au moment du chargement des opérations, on connaisse déjà les identifiants des paramètres
    if (!fs.readdirSync(parametersDirectory).every(parameterConfFileName => {

      let parameterConfFile = parametersDirectory + "/" + parameterConfFileName;

      if (fs.statSync(parameterConfFile).isFile()) {

        LOGGER.info("Chargement du parametre depuis " + parameterConfFile);

        // on récupère le contenu du fichier puis on le vérifie et enfin on stocke l'id si tout va bien
        let parameterConf = {};
        try {
          parameterConf = JSON.parse(fs.readFileSync(parameterConfFile));
        } catch(error) {
          LOGGER.error("Impossible de lire " + parameterConfFile);
          LOGGER.error(error);
          return false;
        }
        
        if (!this.loadParameterConfiguration(parameterConf)) {
          LOGGER.error("Impossible de charger le parametre");
          return false;
        }

      } else {
        // On ne fait rien
      }

      return true;

    })
    ) {
      LOGGER.error("Un des paramètres n'a pas pu être chargé");
      return false;
    }

    LOGGER.info("Parametres charges.");

    return true;

  }

  /**
  *
  * @function
  * @name loadParameterConfiguration
  * @description Créer un paramètre à partir de sa configuration 
  * @param {json} configuration - Configuration d'un parametre
  * @return {boolean}
  *
  */
   loadParameterConfiguration(configuration) {

    LOGGER.info("Chargement d'un parametre à partir de sa configuration...");

    let parameterId = configuration.id;
    let parameterConf = configuration;

    if (this._parameters[parameterId]) {
      LOGGER.info("Le parametre existe déjà");
      return true;
    }

    let parameter = new Parameter(parameterId, parameterConf.type, parameterConf.name, parameterConf.description, parameterConf.required, parameterConf.defaultValue);

    if (parameterConf.example) {
      parameter.example = parameterConf.example;
    }

    if (parameterConf.min) {
      parameter.min = parameterConf.min;
    }

    if (parameterConf.max) {
      parameter.max = parameterConf.max;
    }

    if (parameterConf.explode) {
      parameter.explode = parameterConf.explode;
    }

    if (parameterConf.style) {
      parameter.style = parameterConf.style;
    }

    // Stocakge du paramètre
    this._parameters[parameterId] = parameter;
    this._loadedParameterId.push(parameterId);
    this._parametersConfiguration[parameterId] = parameterConf;

    return true;

  }

  /**
  *
  * @function
  * @name getParameters
  * @description Créer les objets paramètres à partir de la configuration d'une opération
  * @param {json} operationConf - Configuration d'une opération de service
  * @return {table} Tableau d'instance de Parameter, paramètre de service
  *
  */
  getParameters(operationConf) {

    LOGGER.info("Récupération des parametres d'une operation...");

    let parametersTable = {};

    for (let i = 0; i < operationConf.parameters.length; i++ ) {

      let parameterId = operationConf.parameters[i];

      if (this._parameters[parameterId]) {
        parametersTable[parameterId] = this._parameters[parameterId];
        LOGGER.debug("Parametre " + parameterId + " récupéré");
      } else {
        LOGGER.error("Le parametre " + parameterId + " n'existe pas");
        return null;
      }

    }

    return parametersTable;

  }

  /**
  *
  * @function
  * @name checkResourceParameterConfiguration
  * @description Vérifier la configuration d'un paramètre de ressource
  * @param {json} resourceParameterJsonObject - Configuration d'un paramètre de ressource
  * @return {boolean}
  *
  */
  checkResourceParameterConfiguration(resourceParameterJsonObject) {

    LOGGER.info("Verification du parametre de la ressource");

    if (!resourceParameterJsonObject.id) {
      LOGGER.error("L'objet representant un parametre n'a pas d'id");
      return false;
    } else {
      LOGGER.info(resourceParameterJsonObject.id);
    }

    // on vérifie qu'il est bien disponible pour cette instance du service
    if (!this.isParameterChecked(resourceParameterJsonObject.id)) {
      LOGGER.error("Le parametre indique n'est pas disponible");
      return false;
    } else {
      // on continue
    }

    // on récupère la configuration du paramètre
    let serviceParameterConf = this._checkedParametersConfiguration[resourceParameterJsonObject.id];
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
        /* TODO: À revoir. */

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

        if (!resourceParameterJsonObject.values.projection) {
          LOGGER.error("Le parametre ne contient pas de projection alors qu'il doit en avoir une");
          return false;
        } else {
          // TODO: analyse de la disponibilité de la projection pour ce service
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

    } else if (serviceParameterConf.type === "float" || serviceParameterConf.type === "integer") {

      // Gestion des valeurs par défaut
      if (serviceParameterConf.defaultValue === "true") {
        // on doit avoir une valeur indiquée qui sera celle utilisée par défaut
        if (!resourceParameterJsonObject.defaultValueContent) {
          LOGGER.error("Le parametre ne contient pas de valeur par defaut alors qu'il doit en avoir un");
          return false;
        } else {
          // on vérifie qu'on a bien un float 
          if (typeof resourceParameterJsonObject.defaultValueContent !== "number") {
            LOGGER.error("La valeur par defaut n'est pas un nombre");
            return false;
          } else {
            // c'est ok
          }
        }
      } else {
        // il n'y a rien à faire
      }

      //on regarde si les min et max précisés sont bien des float 
      // min et max ne sont pas obligatoires

      if (resourceParameterJsonObject.values) {
        if (resourceParameterJsonObject.values.min) {
          if (typeof resourceParameterJsonObject.values.min !== "number") {
            LOGGER.error("La valeur min du parametre n'est pas un nombre");
            return false;
          } else {
            // c'est ok
          }
        }

        if (resourceParameterJsonObject.values.max) {
          if (typeof resourceParameterJsonObject.values.max !== "number") {
            LOGGER.error("La valeur max du parametre n'est pas un nombre");
            return false;
          } else {
            // c'est ok
          }
        }

      } else {
        // il n'y a rien à vérifier 
      }

    } else if (serviceParameterConf.type === "constraint") {
        /* TODO: Rajouter des contrôles sur les valeurs autorisées. */

        // Gestion des valeurs par défaut
        if (serviceParameterConf.defaultValue === "true") {
          // on doit avoir une valeur indiquée qui sera celle utilisée par défaut
          if (!resourceParameterJsonObject.defaultValueContent) {
            LOGGER.error("Le parametre ne contient pas de valeur par defaut alors qu'il doit en avoir un");
            return false;
          } else {
            // TODO: vérification
          }
        } else {
          // il n'y a rien à faire
        }

        // Vérification du contenu de value
        if (!Array.isArray(resourceParameterJsonObject.values)) {
          LOGGER.error("Les valeur du parametre constrainte n'est pas un tableau");
          return false;
        }

        if (resourceParameterJsonObject.values.length === 0) {
          LOGGER.error("Les valeur du parametre constrainte est un tableau vide");
          return false;
        }

        for(let i = 0; i < resourceParameterJsonObject.values.length; i++) {
          let key = resourceParameterJsonObject.values[i];

          if (!key.keyType) {
            LOGGER.error("Le type de la cle contrainte n'est pas precise");
            return false;
          } else {
            if ( !(["name-pgr", "numerical-pgr", "name-osrm","name-valhalla"].includes(key.keyType)) ) {
              LOGGER.error("Le type de la cle contrainte est invalide");
              return false;
            } else {
              // tout va bien
            }
          }

          if (!key.availableConstraintType) {
            LOGGER.error("Les types de contrainte pour cette cle ne sont pas precises");
            return false;
          } else {
            if (!Array.isArray(key.availableConstraintType)) {
              LOGGER.error("Les types de contrainte pour cette cle ne sont pas un tableau");
              return false;
            }
            if (key.availableConstraintType.length === 0) {
              LOGGER.error("Les types de contrainte pour cette cle sont un tableau vide");
              return false;
            }
            for(let c = 0; c < key.availableConstraintType.length; c++) {
              if (!["banned", "prefer", "avoid"].includes(key.availableConstraintType[c]) ) {
                LOGGER.error("Les types de contrainte pour cette cle sont invalides");
                return false;
              }

              if (key.availableConstraintType[c] === "prefer") {
                // Vérification du contenu de defaultPreferredCostRatio
                if (!(typeof resourceParameterJsonObject.defaultPreferredCostRatio === "number")) {
                  LOGGER.error("Le defaultPreferredCostRatio n'est pas un nombre");
                  return false;
                }
              }

              if (key.availableConstraintType[c] === "avoid") {
                // Vérification du contenu de defaultAvoidCostRatio
                if (!(typeof resourceParameterJsonObject.defaultAvoidCostRatio === "number")) {
                  LOGGER.error("Le defaultAvoidCostRatio n'est pas un nombre");
                  return false;
                }
              }
            }
          }

          if (!key.key) {
            LOGGER.error("Le nom de la cle contrainte n'est pas precise");
            return false;
          } else {
            // TODO: verification ?
          }

          if (key.keyType === "name-pgr") {
            if (!key.availableValues) {
              LOGGER.error("Les valeurs de la cle contrainte ne sont pas precisees");
              return false;
            }

            if (!Array.isArray(key.availableValues)) {
              LOGGER.error("Les valeurs de la cle contrainte ne sont pas dans un tableau");
              return false;
            }

            if (key.availableValues.length === 0) {
              LOGGER.error("Les valeurs de la cle contrainte sont dans un tableau vide");
              return false;
            }

            for(let l = 0; l < key.availableValues.length; l++) {
              let value = key.availableValues[l];

              if (!value.value) {
                LOGGER.error("Les valeurs de la cle contrainte n'ont pas de nom defini");
                return false;
              } else {
                // rien à faire
              }

              if (!value.field) {
                LOGGER.error("Les valeurs de la cle contrainte n'ont pas de field defini");
                return false;
              } else {
                // TODO: vérification ?
              }

              if (!value.condition) {
                LOGGER.error("Les valeurs de la cle contrainte n'ont pas de condition defini");
                return false;
              } else {
                // TODO: vérification ?
              }

            }
          } else if (key.keyType === "name-osrm" || key.keyType === "name-valhalla") {

            if (!key.availableValues) {
              LOGGER.error("Les valeurs de la cle contrainte ne sont pas precisees");
              return false;
            }

            if (!Array.isArray(key.availableValues)) {
              LOGGER.error("Les valeurs de la cle contrainte ne sont pas dans un tableau");
              return false;
            }

            if (key.availableValues.length === 0) {
              LOGGER.error("Les valeurs de la cle contrainte sont dans un tableau vide");
              return false;
            }

            for(let l = 0; l < key.availableValues.length; l++) {
              let value = key.availableValues[l];

              if (!value.value) {
                LOGGER.error("Les valeurs de la cle contrainte n'ont pas de nom defini");
                return false;
              } else {
                // rien à faire
              }

              if (!value.field) {
                LOGGER.error("Les valeurs de la cle contrainte n'ont pas de field defini");
                return false;
              } else {
                // TODO: vérification ?
              }

            }

          } else if (key.keyType === "numerical-pgr") {

            if (!key.field) {
              LOGGER.error("Les valeurs de la cle contrainte n'ont pas de field defini");
              return false;
            } else {
              // TODO: vérification ?
            }

          } else {
            return false;
          }

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
  * @name loadResourceParameterConfiguration
  * @description Créer l'ensemble des opérations d'une ressource
  * @param {object} resourceParameterHash - Objet contenant l'ensemble des paramètres de ressource pour une ressource
  * @param {json} currentOperationConf - Configuraton de l'opération de ressource pour une ressource
  * @return {boolean}
  *
  */
  loadResourceParameterConfiguration(resourceParameterHash, currentOperationConf) {

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
      } else if (curSerParamConf.type === "float") {
        curResParam = new FloatParameter(curSerParam);
      } else if (curSerParamConf.type === "integer") {
        curResParam = new IntParameter(curSerParam);
      } else if (curSerParamConf.type === "constraint") {
        curResParam = new ConstraintParameter(curSerParam);
      } else{
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
