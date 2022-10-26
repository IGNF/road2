'use strict';

const assert = require('assert').strict;
const storageManager = require('../utils/storageManager');
const errorManager = require('../utils/errorManager');
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
  constructor(projectionManager) {

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

    // Correspondance entre les sources et les opérations possibles 
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
  * @name get operationsByType
  * @description Récupérer l'ensemble des opérations possibles par type de source
  *
  */
   get operationsByType() {
    return this._operationsByType;
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

  checkSourceDirectory(directory) {

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
          this._checkedSourceId.push(sourceConf.source.id);
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

  checkSourceConfiguration(sourceJsonObject) {

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
        validation = this.checkSourcePgr(sourceJsonObject);
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

    // Projection 
    if (!sourceJsonObject.projection) {
      LOGGER.error("Mauvaise configuration: source.projection absent");
      return false;
    } else {
      // Vérification de la projection
      if (!this._projectionManager.isProjectionChecked(sourceJsonObject.projection)) {
        LOGGER.error("La source indique une projection non disponible sur le service: " + topologyJsonDescription.projection);
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
        LOGGER.error("La source indique une projection non disponible sur le service: " + topologyJsonDescription.projection);
        return false;
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
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
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
      LOGGER.error("La ressource contient une source sans stockage.");
      return false;
    } else {
      if (!storageManager.checkJsonStorage(sourceJsonObject.storage)) {
        LOGGER.error("Stockage de la source incorrect.");
        return false;
      } else {
        // Normalement, il n'y a plus rien à faire car la fonction checkDuplicationSource() vérifie déjà que la source n'est pas dupliquée
      }
    }

    // Cost
    if (!sourceJsonObject.cost) {
      LOGGER.error("La ressource contient une source sans cout.");
      return false;
    } else {
      // Profile
      if (!sourceJsonObject.cost.profile) {
        LOGGER.error("La ressource contient une source sans profile.");
        return false;
      } else {
        // rien à faire
      }
      // Optimization
      if (!sourceJsonObject.cost.optimization) {
        LOGGER.error("La ressource contient une source sans optimization.");
        return false;
      } else {
        // rien à faire
      }
      // Compute
      if (!sourceJsonObject.cost.compute) {
        LOGGER.info("La ressource contient une source sans compute.");
      } else {
        if (!sourceJsonObject.cost.compute.storage) {
          LOGGER.error("La ressource contient une source ayant un cout sans stockage.");
          return false;
        } else {
          if (!storageManager.checkJsonStorage(sourceJsonObject.cost.compute.storage)) {
            LOGGER.warn("La ressource contient une source ayant un stockage du cout incorrect.");
          } else {
            // rien à faire
          }
        }
        //TODO: ajouter la vérification de configuration
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
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

 checkSourcePgr(sourceJsonObject) {

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
    LOGGER.error("La ressource contient une source sans stockage.");
    return false;
  } else {
    if (!storageManager.checkJsonStorage(sourceJsonObject.storage)) {
      LOGGER.error("Stockage de la source incorrect.");
      return false;
    } else {
      // Normalement, il n'y a plus rien à faire car la fonction checkDuplicationSource() vérifie déjà que la source n'est pas dupliquée
    }
  }

  // Cost
  if (!sourceJsonObject.cost) {
    LOGGER.error("La ressource contient une source sans cout.");
    return false;
  } else {
    // Profile
    if (!sourceJsonObject.cost.profile) {
      LOGGER.error("La ressource contient une source sans profile.");
      return false;
    } else {
      // rien à faire
    }
    // Optimization
    if (!sourceJsonObject.cost.optimization) {
      LOGGER.error("La ressource contient une source sans optimization.");
      return false;
    } else {
      // rien à faire
    }
    // Compute
    if (!sourceJsonObject.cost.compute) {
      LOGGER.info("La ressource contient une source sans compute.");
    } else {
      if (!sourceJsonObject.cost.compute.storage) {
        LOGGER.error("La ressource contient une source ayant un cout sans stockage.");
        return false;
      } else {
        if (!storageManager.checkJsonStorage(sourceJsonObject.cost.compute.storage)) {
          LOGGER.error("La ressource contient une source ayant un stockage du cout incorrect.");
          return false;
        } else {
          // rien à faire
        }
      }
      // TODO: ajouter la vérification de configuration
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
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

   checkSourceSmartrouting(sourceJsonObject) {

    LOGGER.info("Verification de la source smartrouting...");

    // Storage
    if (!sourceJsonObject.storage) {
      LOGGER.error("La ressource contient une source sans stockage.");
      return false;
    } else {
      if (!storageManager.checkJsonStorage(sourceJsonObject.storage)) {
        LOGGER.error("Stockage de la source incorrect.");
        return false;
      } else {
        // Normalement, il n'y a plus rien à faire car la fonction checkDuplicationSource() vérifie déjà que la source n'est pas dupliquée
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
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

   checkSourceValhalla(sourceJsonObject) {

    LOGGER.info("Verification de la source smartrouting...");

    // Storage
    if (!sourceJsonObject.storage) {
      LOGGER.error("La ressource contient une source sans stockage.");
      return false;
    } else {
      if (!storageManager.checkJsonStorage(sourceJsonObject.storage)) {
        LOGGER.error("Stockage de la source incorrect.");
        return false;
      } else {
        // Normalement, il n'y a plus rien à faire car la fonction checkDuplicationSource() vérifie déjà que la source n'est pas dupliquée
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
      source = new osrmSource(sourceJsonObject, topology);
    } else if (sourceJsonObject.type === "pgr") {
      source = new pgrSource(sourceJsonObject, topology);
    } else if (sourceJsonObject.type === "smartrouting") {
      // smartrouting n'utilise pas la topologie définie dans la conf
      source = new smartroutingSource(sourceJsonObject);
    } else if (sourceJsonObject.type === "valhalla") {
      source = new valhallaSource(sourceJsonObject, topology);
    } else {
      // On va voir si c'est un autre type.
      LOGGER.error("Le type de la source est inconnu");
      return false;
    }

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
