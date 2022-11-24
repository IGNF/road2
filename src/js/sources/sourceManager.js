'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert').strict;
const osrmSource = require('../sources/osrmSource');
const pgrSource = require('../sources/pgrSource');
const smartroutingSource = require('../sources/smartroutingSource');
const valhallaSource = require('../sources/valhallaSource');
const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("SOURCEMANAGER");

module.exports = class sourceManager {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe sourceManager
  *
  */
  constructor(projectionManager, baseManager) {

    // Liste des ids des sources chargées par le manager
    this._loadedSourceId = new Array();

    // Liste des ids des sources vérifiées par le manager
    this._checkedSourceId = new Array();

    // Catalogue des sources du manager
    this._source = {};

    // Descriptions des sources chargées par le manager
    this._loadedSourceConfiguration = {};

    // Descriptions des sources vérifiées par le manager
    this._checkedSourceConfiguration = {};

    // Manager des projections 
    this._projectionManager = projectionManager;

    // Manager de bases de données (utiles pour certaines sources)
    this._baseManager = baseManager;

    // Correspondance entre les sources et les opérations possibles 
    // Le contenu de ce tableau dépend du moteur et du code écrit dans la source correspondante
    // Par exemple, le projet OSRM permet de faire du nearest et nous avons choisis de l'implémenter dans Road2
    this._operationsByType = {
      "osrm": ["nearest", "route"],
      "pgr": ["route", "isochrone"],
      "smartrouting": ["route", "isochrone"],
      "valhalla": ["route", "isochrone"]
    };

  }

  /**
  *
  * @function
  * @name get source
  * @description Récupérer l'ensemble des ids de sources chargées
  *
  */
  get source() {
    return this._source;
  }

  /**
  *
  * @function
  * @name isCheckedSourceAvailable
  * @description Fonction utilisée pour vérifier si une source a été vérifiée
  * @param {string} id - Id de la source
  * @return {boolean} 
  *
  */

  isCheckedSourceAvailable(id) {

    if (this._checkedSourceId.length === 0) {
      return false;
    }

    for (let i = 0; i < this._checkedSourceId.length; i++) {
      if (this._checkedSourceId[i] === id) {
        return true;
      }
    }
    return false;

  }

  /**
  *
  * @function
  * @name getSourceById
  * @description Fonction utilisée pour récupérer une source
  * @param {string} id - Id de la source
  * @return {source} source - Instance fille de la classe Source
  *
  */

  getSourceById(id) {

    if (this.isLoadedSourceAvailable(id)) {
      return this._source[id];
    } else {
      return null;
    }

  }

  /**
  *
  * @function
  * @name isLoadedSourceAvailable
  * @description Fonction utilisée pour vérifier si une source a été chargée
  * @param {string} id - Id de la source
  * @return {boolean} 
  *
  */

   isLoadedSourceAvailable(id) {

    if (this._loadedSourceId.length === 0) {
      return false;
    }

    for (let i = 0; i < this._loadedSourceId.length; i++) {
      if (this._loadedSourceId[i] === id) {
        return true;
      }
    }
    return false;

  }

  /**
  *
  * @function
  * @name checkSourceDirectory
  * @description Fonction utilisée pour vérifier un dossier contenant des sources.
  * @param {string} directory - Dossier qui contient les configurations des ressources
  * @return {boolean} 
  *
  */

  async checkSourceDirectory(directory) {

    LOGGER.info("Vérification d'un dossier de sources...");
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

        let source = fileList[i];
        let sourceFile = "";
        try {
          sourceFile = directory + "/" + source;
          fs.accessSync(sourceFile, fs.constants.R_OK);
        } catch (err) {
          LOGGER.error("Le fichier de source ne peut etre lu: " + sourceFile);
        }

        let sourceConf = {};
        try {
          // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
          sourceConf = JSON.parse(fs.readFileSync(sourceFile));
        } catch (error) {
          LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de source: " + sourceFile);
          LOGGER.error(error);
          return false;
        }

        if (!(await this.checkSourceConfiguration(sourceConf))) {
          LOGGER.error("La source décrite dans le fichier " + sourceFile + " est mal configuée");
          return false;
        } else {
          this._checkedSourceId.push(sourceConf.id);
        }

      }

      LOGGER.info("Vérification du dossier de sources terminée");
      return true;

    } else {
      LOGGER.error("Mauvaise configuration: Le dossier n'existe pas: " + directory );
      return false;
    }

  }

  /**
  *
  * @function
  * @name checkSourceConfiguration
  * @description Fonction utilisée pour vérifier la configuration d'une source.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

  async checkSourceConfiguration(sourceJsonObject) {

    LOGGER.info("Verification de la source...");

    // ID
    if (!sourceJsonObject.id) {
      LOGGER.error("Mauvaise configuration: source.id absent");
      return false;
    } else {
      // On vérifie que l'id n'est pas déjà chargé.
      if (this._loadedSourceId.length !== 0) {

        for (let i = 0; i < this._loadedSourceId.length; i++ ) {
          if (this._loadedSourceId[i] === sourceJsonObject.id) {
            LOGGER.info("La source contenant l'id " + sourceJsonObject.id + " est deja chargée.");
            // On vérifie que la source décrite et celle déjà identifiée soient exactement les mêmes
            if (this.checkDuplicationLoadedSource(sourceJsonObject)) {
              break;
            } else {
              LOGGER.error("La source contenant l'id " + sourceJsonObject.id + " n'est pas identique à la source deja identifiee.");
              return false;
            }

          } else {
            // on continue la boucle de vérification
          }
        }

      } else {
        // C'est la première source.
      }

      // On vérifie que l'id n'est pas déjà vérifié.
      if (this._checkedSourceId.length !== 0) {

        for (let i = 0; i < this._checkedSourceId.length; i++ ) {
          if (this._checkedSourceId[i] === sourceJsonObject.id) {
            LOGGER.info("La source contenant l'id " + sourceJsonObject.id + " est deja vérifiée.");
            // On vérifie que la source décrite et celle déjà identifiée soient exactement les mêmes
            if (this.checkDuplicationCheckedSource(sourceJsonObject)) {
              break;
            } else {
              LOGGER.error("La source contenant l'id " + sourceJsonObject.id + " n'est pas identique à la source deja identifiee.");
              return false;
            }

          } else {
            // on continue la boucle de vérification
          }
        }

      } else {
        // C'est la première source.
      }

    }

    // Description
    if (!sourceJsonObject.description) {
      LOGGER.error("Mauvaise configuration: source.description absent");
      return false;
    } else {
      if (typeof(sourceJsonObject.description) !== "string") {
        LOGGER.error("Mauvaise configuration: source.description n'est pas une chaine de caractère");
      return false;
      } else {
        LOGGER.debug("source.description présent");
      }
    }

    // Projection 
    if (!sourceJsonObject.projection) {
      LOGGER.error("Mauvaise configuration: source.projection absent");
      return false;
    } else {
      // Vérification de la projection
      if (!this._projectionManager.isProjectionChecked(sourceJsonObject.projection)) {
        LOGGER.error("La source indique une projection non disponible sur le service: " + sourceJsonObject.projection);
        return false;
      }
    }

    // Bbox 
    if (!sourceJsonObject.bbox) {
      LOGGER.error("Mauvaise configuration: source.bbox absent");
      return false;
    } else {
      // Vérification de la bbox
      if (!this._projectionManager.checkBboxConfiguration(sourceJsonObject.bbox, sourceJsonObject.projection)) {
        LOGGER.error("La source indique une bbox incorrecte: " + sourceJsonObject.bbox);
        return false;
      }
    }

    // Type
    if (!sourceJsonObject.type) {
      LOGGER.error("Mauvaise configuration: source.type absent");
      return false;
    } else {

      LOGGER.debug("Type présent");

      // Vérification que le type est valide puis vérification spécifique à chaque type

      if (!Object.keys(this._operationsByType).includes(sourceJsonObject.type)) {
        LOGGER.error("La source indique un type non disponible : " + sourceJsonObject.type);
        return false;
      } else {
        LOGGER.debug("Le type présent est disponible : " + sourceJsonObject.type);
      }

      let validation = false;

      if (sourceJsonObject.type === "osrm") {
        validation = this.checkSourceOsrm(sourceJsonObject);
      } else if (sourceJsonObject.type === "pgr") {
        validation = await this.checkSourcePgr(sourceJsonObject);
      } else if (sourceJsonObject.type === "valhalla") {
        validation = this.checkSourceValhalla(sourceJsonObject);
      } else if (sourceJsonObject.type === "smartrouting") {
        validation = this.checkSourceSmartrouting(sourceJsonObject);
      } else {
        LOGGER.error("La source indique un type invalide : " + sourceJsonObject.type);
        return false;
      }

      if (!validation) {
        LOGGER.error("Erreur lors de la verification de la source");
        return false;
      } else {
        LOGGER.debug("Aucune erreur lors de la vérification de la source");
      }

    }

    LOGGER.info("Fin de la verification de la source.");
    return true;

  }

  /**
  *
  * @function
  * @name checkSourceOsrm
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une source osrm.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

  checkSourceOsrm(sourceJsonObject) {

    LOGGER.info("Verification de la source osrm...");

    // On vérifie que le module osrm est disponible 
    try {
      let osrmTest = require('osrm');
    } catch(error) {
      LOGGER.error("Le module osrm n'est pas disponible mais une source osrm est proposée dans la configuration.");
      return false;
    }

    // Storage
    if (!sourceJsonObject.storage) {
      LOGGER.error("Mauvaise configuration : 'source.storage' absent");
      return false;
    } else {

      LOGGER.debug("'source.storage' présent");

      if (!sourceJsonObject.storage.file) {
        LOGGER.error("Mauvaise configuration : 'source.storage.file' absent");
        return false;
      } else {
        LOGGER.debug("'source.storage.file' présent");
        // TODO : Vérifier l'existence et les droits de lecture
      }
    }

    // Cost
    if (!sourceJsonObject.cost) {
      LOGGER.error("Mauvaise configuration : 'source.cost' absent");
      return false;
    } else {

      LOGGER.debug("'source.storage.cost' présent");

      // Profile
      if (!sourceJsonObject.cost.profile) {
        LOGGER.error("Mauvaise configuration : 'source.cost.profile' absent");
        return false;
      } else {
        // rien à faire
        LOGGER.debug("'source.cost.profile' présent");
      }
      // Optimization
      if (!sourceJsonObject.cost.optimization) {
        LOGGER.error("Mauvaise configuration : 'source.cost.optimization' absent");
        return false;
      } else {
        // rien à faire
        LOGGER.debug("'source.cost.optimization' présent");
      }

    }

    LOGGER.info("Fin de la verification de la source osrm.");
    return true;
  }

  /**
  *
  * @function
  * @name checkSourcePgr
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une source pgr.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

  async checkSourcePgr(sourceJsonObject) {

  LOGGER.info("Verification de la source pgr...");

  // On vérifie que le module pg est disponible
  try {
    let { poolTest } = require('pg');
  } catch(error) {
    LOGGER.error("Le module pg n'est pas disponible mais une source pgrouting est proposée dans la configuration.");
    return false;
  }

  // Storage
  if (!sourceJsonObject.storage) {

    LOGGER.error("Mauvaise configuration : 'source.storage' absent");
    return false;

  } else {
    
    LOGGER.debug("'source.storage' présent");

    if (!sourceJsonObject.storage.base) {

      LOGGER.error("Mauvaise configuration : 'source.storage.base' absent");
      return false;

    } else {

      LOGGER.debug("'source.storage.base' présent");

      if (!sourceJsonObject.storage.base.dbConfig) {
        LOGGER.error("Mauvaise configuration : 'source.storage.base.dbConfig' absent");
        return false;
      } else {
        LOGGER.debug("'source.storage.base.dbConfig' présent");
        
        if (!(await this._baseManager.checkBaseConfiguration(sourceJsonObject.storage.base.dbConfig))) {
          LOGGER.error("Mauvaise configuration : 'source.storage.base.dbConfig' invalide");
          return false;
        } else {
          LOGGER.debug("'source.storage.base.dbConfig' valide");
          this._baseManager.saveCheckedBaseConfiguration(sourceJsonObject.storage.base.dbConfig);
        }

      }

      if (!sourceJsonObject.storage.base.schema) {
        LOGGER.error("Mauvaise configuration : 'source.storage.base.schema' absent");
        return false;
      } else {

        LOGGER.debug("'source.storage.base.schema' présent");

        if (typeof(sourceJsonObject.storage.base.schema) !== "string") {
          LOGGER.error("Mauvaise configuration : 'source.storage.base.schema' n'est pas une chaine de caractères");
          return false;
        }

      }

      if (!sourceJsonObject.storage.base.attributes) {
        // Cet élément n'est pas obligatoire pour laisser plus de liberté
        LOGGER.info("Configuration : 'source.storage.base.attributes' absent");
      } else {

        LOGGER.debug("'source.storage.base.attributes' présent");

        if (!Array.isArray(sourceJsonObject.storage.base.attributes)) {
          LOGGER.error("Mauvaise configuration : 'source.storage.base.attributes' n'est pas un tableau");
          return false;
        } else {
          LOGGER.debug("'source.storage.base.attributes' est un tableau");
        }

        if (sourceJsonObject.storage.base.attributes.length === 0) {
          LOGGER.error("Mauvaise configuration : 'source.storage.base.attributes' est un tableau vide");
          return false;
        } else {
          LOGGER.debug("'source.storage.base.attributes' est un tableau non vide");
        }

        for (let j = 0; j < sourceJsonObject.storage.base.attributes.length; j++) {

          if (!sourceJsonObject.storage.base.attributes[j].key) {
            LOGGER.error("Mauvaise configuration : 'source.storage.base.attributes["+j+"].key' est absent");
            return false;
          } 

          if (!sourceJsonObject.storage.base.attributes[j].column) {
            LOGGER.error("Mauvaise configuration : 'source.storage.base.attributes["+j+"].column' est absent");
            return false;
          } 

          if (!sourceJsonObject.storage.base.attributes[j].default) {
            LOGGER.error("Mauvaise configuration : 'source.storage.base.attributes["+j+"].default' est absent");
            return false;
          } else {
            if (sourceJsonObject.storage.base.attributes[j].default !== "true" && sourceJsonObject.storage.base.attributes[j].default !== "false" ) {
              LOGGER.error("Mauvaise configuration : 'source.storage.base.attributes["+j+"].default' doit être 'true' or 'false' (string)");
              return false;
            }
          }

        }

      }

    }

  }

  // Coûts
  if (!sourceJsonObject.costs) {
    LOGGER.error("Mauvaise configuration : 'source.costs' absent");
    return false;
  } else {

    LOGGER.debug("'source.costs' présent");

    if (!Array.isArray(sourceJsonObject.costs)) {
      LOGGER.error("Mauvaise configuration : 'source.costs' n'est pas un tableau");
      return false;
    } else {
      LOGGER.debug("'source.costs' est un tableau");
    }

    if (sourceJsonObject.costs.length === 0) {
      LOGGER.error("Mauvaise configuration : 'source.costs' est un tableau vide");
      return false;
    } else {
      LOGGER.debug("'source.costs' n'est pas un tableau vide");
    }

    for (let i = 0; i < sourceJsonObject.costs.length; i++) {

      if (!sourceJsonObject.costs[i].profile) {
        LOGGER.error("Mauvaise configuration : 'source.costs["+i+"].profile' absent");
        return false;
      } else {
        LOGGER.debug("'source.costs["+i+"].profile' présent");
      }

      if (!sourceJsonObject.costs[i].optimization) {
        LOGGER.error("Mauvaise configuration : 'source.costs["+i+"].optimization' absent");
        return false;
      } else {
        LOGGER.debug("'source.costs["+i+"].optimization' présent");
      }

      if (!sourceJsonObject.costs[i].costType) {
        LOGGER.error("Mauvaise configuration : 'source.costs["+i+"].costType' absent");
        return false;
      } else {
        LOGGER.debug("'source.costs["+i+"].costType' présent");
      }

      if (!sourceJsonObject.costs[i].costColumn) {
        LOGGER.error("Mauvaise configuration : 'source.costs["+i+"].costColumn' absent");
        return false;
      } else {
        LOGGER.debug("'source.costs["+i+"].costColumn' présent");
      }

      if (!sourceJsonObject.costs[i].rcostColumn) {
        LOGGER.error("Mauvaise configuration : 'source.costs["+i+"].rcostColumn' absent");
        return false;
      } else {
        LOGGER.debug("'source.costs["+i+"].rcostColumn' présent");
      }

    }

  }


  LOGGER.info("Fin de la verification de la source pgr.");
  return true;

}

  /**
  *
  * @function
  * @name checkSourceSmartrouting
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une source smartrouting.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

  checkSourceSmartrouting(sourceJsonObject) {

    LOGGER.info("Verification de la source smartrouting...");

    // Storage
    if (!sourceJsonObject.storage) {
      LOGGER.error("Mauvaise configuration : 'source.storage' absent");
      return false;
    } else {

      LOGGER.debug("'source.storage' présent");

      if (!sourceJsonObject.storage.url) {
        LOGGER.error("Mauvaise configuration : 'source.storage.url' absent");
        return false;
      } else {
        LOGGER.debug("'source.storage.url' présent");
        // TODO: vérifier la forme de l'URL avec une regex
      }
    }

    LOGGER.info("Fin de la verification de la source smartrouting.");
    return true;

  }

  /**
  *
  * @function
  * @name checkSourceValhalla
  * @description Fonction utilisée pour vérifier le contenu d'un fichier de description d'une source valhalla.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

   checkSourceValhalla(sourceJsonObject) {

    LOGGER.info("Verification de la source smartrouting...");

    // Storage
    if (!sourceJsonObject.storage) {

      LOGGER.error("Mauvaise configuration : 'source.storage' absent");
      return false;

    } else {

      LOGGER.debug("'source.storage' présent");

      if (!sourceJsonObject.storage.tar) {
        LOGGER.error("Mauvaise configuration : 'source.storage.tar' absent");
        return false;
      } else {
        LOGGER.debug("'source.storage.tar' présent");
      }

      if (!sourceJsonObject.storage.dir) {
        LOGGER.error("Mauvaise configuration : 'source.storage.dir' absent");
        return false;
      } else {
        LOGGER.debug("'source.storage.dir' présent");
      }

      if (!sourceJsonObject.storage.config) {
        LOGGER.error("Mauvaise configuration : 'source.storage.config' absent");
        return false;
      } else {
        LOGGER.debug("'source.storage.config' présent");
      }

    }

    // Coûts
    if (!sourceJsonObject.costs) {
      LOGGER.error("Mauvaise configuration : 'source.costs' absent");
      return false;
    } else {

      LOGGER.debug("'source.costs' présent");

      if (!Array.isArray(sourceJsonObject.costs)) {
        LOGGER.error("Mauvaise configuration : 'source.costs' n'est pas un tableau");
        return false;
      } else {
        LOGGER.debug("'source.costs' est un tableau");
      }

      if (sourceJsonObject.costs.length === 0) {
        LOGGER.error("Mauvaise configuration : 'source.costs' est un tableau vide");
        return false;
      } else {
        LOGGER.debug("'source.costs' n'est pas un tableau vide");
      }

      for (let i = 0; i < sourceJsonObject.costs.length; i++) {

        if (!sourceJsonObject.costs[i].profile) {
          LOGGER.error("Mauvaise configuration : 'source.costs["+i+"].profile' absent");
          return false;
        } else {
          LOGGER.debug("'source.costs["+i+"].profile' présent");
        }

        if (!sourceJsonObject.costs[i].optimization) {
          LOGGER.error("Mauvaise configuration : 'source.costs["+i+"].optimization' absent");
          return false;
        } else {
          LOGGER.debug("'source.costs["+i+"].optimization' présent");
        }

        if (!sourceJsonObject.costs[i].costType) {
          LOGGER.error("Mauvaise configuration : 'source.costs["+i+"].costType' absent");
          return false;
        } else {
          LOGGER.debug("'source.costs["+i+"].costType' présent");
        }

        if (!sourceJsonObject.costs[i].costing) {
          LOGGER.error("Mauvaise configuration : 'source.costs["+i+"].costing' absent");
          return false;
        } else {
          LOGGER.debug("'source.costs["+i+"].costing' présent");
        }

      }

    }

    LOGGER.info("Fin de la verification de la source smartrouting.");
    return true;

  }

  /**
  *
  * @function
  * @name checkDuplicationLoadedSource
  * @description Fonction utilisée pour vérifier que le contenu d'un fichier de description d'une source est bien le même qu'un autre.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

  checkDuplicationLoadedSource(sourceJsonObject) {

    LOGGER.info("Comparaison des deux sources identifiees et devant etre identiques...");

    // On récupère la description de la source faisant office de référence car lue la première.
    let referenceSource = this._loadedSourceConfiguration[sourceJsonObject.id];

    // On compare les deux objets
    try {
      assert.deepStrictEqual(sourceJsonObject, referenceSource);
    } catch (err) {
      LOGGER.error("Les deux sources ne sont pas identiques.");
      LOGGER.debug(err);
      return false;
    }

    LOGGER.info("Les deux sources sont identiques.");
    return true;

  }

  /**
  *
  * @function
  * @name checkDuplicationCheckedSource
  * @description Fonction utilisée pour vérifier que le contenu d'un fichier de description d'une source est bien le même qu'un autre.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean} 
  *
  */

   checkDuplicationCheckedSource(sourceJsonObject) {

    LOGGER.info("Comparaison des deux sources identifiees et devant etre identiques...");

    // On récupère la description de la source faisant office de référence car lue la première.
    let referenceSource = this._checkedSourceConfiguration[sourceJsonObject.id];

    // On compare les deux objets
    try {
      assert.deepStrictEqual(sourceJsonObject, referenceSource);
    } catch (err) {
      LOGGER.error("Les deux sources ne sont pas identiques.");
      LOGGER.debug(err);
      return false;
    }

    LOGGER.info("Les deux sources sont identiques.");
    return true;

  }

  /**
  *
  * @function
  * @name saveCheckedSource
  * @description Sauvegarder l'id de la source vérifié
  * @param {object} configuration - Id de la source que l'on veut sauvegarder
  *
  */
   saveCheckedSource(configuration) {

    this._checkedSourceId.push(configuration.id);
    this._checkedSourceConfiguration[configuration.id] = configuration;

  }

  /**
  *
  * @function
  * @name flushCheckedSource
  * @description Vider la liste des source déjà vérifiées 
  *
  */
  flushCheckedSource() {

    this._checkedSourceId = new Array();
    this._checkedSourceConfiguration = {};
    
  }

  /**
  *
  * @function
  * @name loadSourceDirectory
  * @description Fonction utilisée pour créer les sources contenues dans un dossier.
  * @param {string} directory - Dossier qui contient les configurations des ressources
  * @return {boolean}
  *
  */

  loadSourceDirectory(directory) {

    // Pour chaque fichier du dossier des sources, on crée une source
    let files = fs.readdirSync(directory).filter( (file) => {
      return path.extname(file).toLowerCase() === ".source";
    });

    for (let fileName of files) {

      let sourceFile = directory + "/" + fileName;
      LOGGER.info("Chargement de la source : " + sourceFile);

      // Récupération du contenu en objet pour vérification puis création de la source
      let sourceContent = {};
      try {
        sourceContent = JSON.parse(fs.readFileSync(sourceFile));
      } catch (error) {
        LOGGER.error(error);
        LOGGER.error("Erreur lors de la lecture de la source: " + sourceFile);
      }

      // Création de la ressource
      if (!this.loadSourceConfiguration(sourceContent)) {
        LOGGER.error("La source configurée dans le fichier " + sourceFile + " n'a pas pu être chargée");
      } else {
        LOGGER.info("Source chargée : " + sourceFile);
      }

    }

    return true;

  }

  /**
  *
  * @function
  * @name loadSourceConfiguration
  * @description Fonction utilisée pour créer une source.
  * @param {json} sourceJsonObject - Description JSON de la source
  * @return {boolean}
  *
  */

  loadSourceConfiguration(sourceJsonObject) {

    LOGGER.info("Creation de la source: " + sourceJsonObject.id);

    let source;

    if (this._source[sourceJsonObject.id]) {
      LOGGER.info("La source " + sourceJsonObject.id + " existe déjà");
      return true;
    }

    if (sourceJsonObject.type === "osrm") {
      source = new osrmSource(sourceJsonObject);
    } else if (sourceJsonObject.type === "pgr") {

      // Création de la base associée
      let base = {};
      if (!this._baseManager.loadBaseConfiguration(sourceJsonObject.storage.base.dbConfig)) {
        LOGGER.error("Impossible de charger la base configurée dans " + sourceJsonObject.storage.base.dbConfig);
        return false;
      } else {
        base = this._baseManager.getBase(sourceJsonObject.storage.base.dbConfig);
      }
      // Création de la source
      source = new pgrSource(sourceJsonObject, base);

    } else if (sourceJsonObject.type === "smartrouting") {
      source = new smartroutingSource(sourceJsonObject);
    } else if (sourceJsonObject.type === "valhalla") {
      source = new valhallaSource(sourceJsonObject);
    } else {
      LOGGER.error("Le type de la source est inconnu");
      return false;
    }

    // On sauvegarde la source et certains éléments pour le manager afin de pouvoir réutiliser ces infomations plus tard
    // Notamment dans la gestion (ajout/suppression/modification) de sources durant la vie du service
    this._loadedSourceId.push(sourceJsonObject.id);
    this._loadedSourceConfiguration[sourceJsonObject.id] = sourceJsonObject;
    this._source[sourceJsonObject.id] = source;

    return true;

  }

  /**
  *
  * @function
  * @name connectSource
  * @description Fonction utilisée pour connecter une source. 
  * On la sépare volontairement du load de la source car on veut pouvoir gérer ces actions de manière indépendante. 
  * @param {string} sourceId - Id de la source que l'on veut connecter
  *
  */
  async connectSource(sourceId) {

    LOGGER.info("Connexion a la source: " + sourceId);

    try {

      await this._source[sourceId].connect();
      LOGGER.info("Source connectee.");
      return true;

    } catch (err) {

      LOGGER.error("Impossible de connecter la source.", err);
      return false;

    }

  }

  /**
  *
  * @function
  * @name connectAllSources
  * @description Connecter l'ensemble des sources disponibles dans le manager
  *
  */
  async connectAllSources() {

    LOGGER.info("Connexion de l'ensemble des sources...");

    if (this._loadedSourceId.length === 0) {
      LOGGER.error("Aucune source n'est disponible");
      return false;
    }

    try {
      assert.deepStrictEqual(this._loadedSourceConfiguration, {});
      LOGGER.error("Aucune source n'a été préalablement chargée");
      return false;
    } catch (err) {
      // tout va bien
    }

    let nbSourceConnected = 0;

    for (let i = 0; i < this._loadedSourceId.length; i++) {
      
      LOGGER.info("Source : " + this._loadedSourceId[i]);

      if (!(await this.connectSource(this._loadedSourceId[i]))) {

        LOGGER.error("Source " + this._loadedSourceId[i] + " non connectée");
        // TODO : on continue de connecter les autres sources et on gère après coup la MAJ des ressources, du getcap, etc... 
        // Pour le moment, s'il y a une source qui ne fonctionne pas, on arrête le serveur 
        return false;

      } else {

        LOGGER.info("Source " + this._loadedSourceId[i] + " connectée");
        nbSourceConnected++;
        
      }
      
    }

    LOGGER.info("Les démarrages se sont bien déroulés.");

    if (nbSourceConnected === 0) {
      LOGGER.error("Aucune source n'a pu être connectée");
      return false;
    } else {
      LOGGER.info("Au moins une source a été connectée");
      return true;
    }

  }

}
