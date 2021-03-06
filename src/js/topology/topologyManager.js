'use strict';

const log4js = require('log4js');
const storageManager = require('../utils/storageManager');
const DbTopology = require('./dbTopology');
const OsmTopology = require('./osmTopology');
const assert = require('assert');

// Création du LOGGER
const LOGGER = log4js.getLogger("TOPOLOGYMANAGER");

/**
*
* @class
* @name topologyManager
* @description Classe modélisant le manager des topologies.
*
*/
module.exports = class topologyManager {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe topologyManager
  * @param{BaseManager} baseManager - Manager de bases
  *
  */
  constructor(baseManager, projectionManager) {

    // Liste des descriptions de topologies vérifiées et validées par le manager
    this._listOfTopologyIds = new Array();

    // Descriptions des topologies vérifiées et validées par le manager
    this._topologyDescriptions = {};

    // Le catalogue des topologies créées par le manager
    this._topologiesCatalog = {};

    // Manager de bases
    this._baseManager = baseManager;

    // Manager de projections
    this._projectionManager = projectionManager;

  }

  /**
  *
  * @function
  * @name get topologiesCatalog
  * @description Récupérer le catalogue des topologies
  *
  */
  get topologiesCatalog() {
    return this._topologiesCatalog;
  }

  /**
  *
  * @function
  * @name getTopologyById
  * @description Récupérer une topologie via son id
  * @param{string} id - Id de la topologie
  *
  */
  getTopologyById(id) {
    if (this._topologiesCatalog[id]) {
      return this._topologiesCatalog[id];
    } else {
      return {};
    }

  }

  /**
  *
  * @function
  * @name checkTopology
  * @description Vérification de la description d'une topologie
  * @param{json} topologyJsonDescription - JSON décrivant une topologie
  *
  */
  async checkTopology(topologyJsonDescription) {

    // Id de la topologie
    if (!topologyJsonDescription.id) {
      LOGGER.error("La topologie ne contient pas d'id.");
      return false;
    } else {
      // On vérifie que l'id n'est pas déjà pris.
      if (this._listOfTopologyIds.length !== 0) {

        for (let i = 0; i < this._listOfTopologyIds.length; i++ ) {
          if (this._listOfTopologyIds[i] === topologyJsonDescription.id) {
            LOGGER.info("La topologie contenant l'id " + topologyJsonDescription.id + " est deja referencee.");
            // On vérifie que la source décrite et celle déjà identifiée soient exactement les mêmes
            if (this.checkDuplicationTopology(topologyJsonDescription)) {
              LOGGER.info("La topologie contenant l'id " + topologyJsonDescription.id + " est identique à la topologie deja identifiee.");
              return true;
            } else {
              LOGGER.error("La topologie contenant l'id " + topologyJsonDescription.id + " n'est pas identique à la topologie deja identifiee.");
              return false;
            }

          } else {
            // on continue de vérifier
          }
        }

      } else {
        // C'est la première source, on continue la vérification
      }
    }

    // Description de la topologie
    if (!topologyJsonDescription.description) {
      LOGGER.error("La ressource ne contient pas de description de la topologie.");
      return false;
    } else {
      // rien à faire
    }

    // Projection de la topologie
    if (!topologyJsonDescription.projection) {
      LOGGER.error("La ressource ne contient pas d'information sur la projection de la topologie.")
      return false;
    } else {
      // Vérification de la projection
      if (!this._projectionManager.isAvailableById(topologyJsonDescription.projection)) {
        LOGGER.error("La topologie indique une projection non disponible sur le service: " + topologyJsonDescription.projection);
        return false;
      }
    }

    // Bbox de la topologie
    if (!topologyJsonDescription.bbox) {
      LOGGER.error("La ressource ne contient pas d'information sur la bbox de la topologie.")
      return false;
    } else {
      // TODO: vérifier la bbox
    }

    if (!topologyJsonDescription.type) {
      LOGGER.error("La ressource ne contient pas de type de la topologie.");
      return false;
    } else {

      if (topologyJsonDescription.type === "db") {
        if (!(await this.checkDbTopology(topologyJsonDescription))) {
          LOGGER.error("La topologie db est incorrecte.");
          return false;
        }
      } else if (topologyJsonDescription.type === "osm") {
        if (!this.checkOsmTopology(topologyJsonDescription)) {
          LOGGER.error("La topologie osm est incorrecte.");
          return false;
        }
      } else {
        LOGGER.error("La ressource contient un type inconnu pour la topologie.");
        return false;
      }

    }

    // on sauvegarde l'id de la topologie pour savoir qu'elle a déjà été vérifiée et que sa description est valide
    this._listOfTopologyIds.push(topologyJsonDescription.id);
    this._topologyDescriptions[topologyJsonDescription.id] = topologyJsonDescription;

    return true;

  }

  /**
  *
  * @function
  * @name checkOsmTopology
  * @description Vérification de la description d'une topologie OSM
  * @param{json} topologyJsonDescription - JSON décrivant une topologie
  *
  */
  checkOsmTopology(topologyJsonDescription) {

    // Stockage de la topologie
    if (!topologyJsonDescription.storage) {
      LOGGER.info("La ressource ne contient pas d'information sur le stockage du fichier de generation de la topologie.");
    } else {
      if (!storageManager.checkJsonStorage(topologyJsonDescription.storage)) {
        LOGGER.warn("Stockage de la topologie incorrect.");
      } else {
        // rien à faire
      }
    }

    return true;

  }

  /**
  *
  * @function
  * @name checkDbTopology
  * @description Vérification de la description d'une topologie issue d'une base de données
  * @param{json} topologyJsonDescription - JSON décrivant une topologie
  *
  */
  async checkDbTopology(topologyJsonDescription) {

    // Stockage de la topologie
    if (!topologyJsonDescription.storage) {
      LOGGER.error("La ressource ne contient pas d'information sur le stockage du fichier de generation de la topologie.");
      return false;
    } else {
      // on continue
    }

    if (!topologyJsonDescription.storage.base) {
      LOGGER.error("La ressource ne contient pas de parametre 'topology.storage.base'.");
      return false;
    }

    // dbConfig
    if (!topologyJsonDescription.storage.base.dbConfig) {
      LOGGER.error("La ressource ne contient pas de parametre 'topology.storage.dbConfig'.");
      return false;
    } else {
      if (!(await this._baseManager.checkBase(topologyJsonDescription.storage.base.dbConfig))) {
        LOGGER.error("La ressource contient un parametre 'topology.storage.dbConfig' incorrect.");
        return false;
      }
    }

    // schema
    if (!topologyJsonDescription.storage.base.schema) {
      LOGGER.error("La ressource ne contient pas de parametre 'topology.storage.base.schema'.");
      return false;
    } else {
      // TODO: vérification que ce n'est pas du code injecté
    }

    // Attributs
    if (topologyJsonDescription.storage.base.attributes) {

      // on vérifie que c'est un tableau
      if (!Array.isArray(topologyJsonDescription.storage.base.attributes)) {
        LOGGER.error("Le parametre resource.topology.attributes n'est pas un tableau.");
        return false;
      }

      // que le tableau n'est pas vide
      if (topologyJsonDescription.storage.base.attributes.length === 0) {
        LOGGER.error("Le parametre resource.topology.attributes est un tableau vide.");
        return false;
      }

      // on va vérifier que chaque attribut est complet et unique dans sa description
      let attributesKeyTable = new Array();
      let attributesColumnTable = new Array();

      for (let i = 0; i < topologyJsonDescription.storage.base.attributes.length; i++) {
        let curAttribute = topologyJsonDescription.storage.base.attributes[i];


        if (!curAttribute.key) {
          LOGGER.error("La description de l'attribut est incomplete: key");
          return false;
        } else {

          if (attributesKeyTable.length !== 0) {
            for (let j = 0; j < attributesKeyTable.length; j++) {
              if (curAttribute.key === attributesKeyTable[j]) {
                LOGGER.error("La description de l'attribut indique une cle deja utilisee.");
                return false;
              }
            }
          }

        }

        if (!curAttribute.column) {
          LOGGER.error("La description de l'attribut est incomplete: column");
          return false;
        } else {

          if (attributesColumnTable.length !== 0) {
            for (let j = 0; j < attributesColumnTable.length; j++) {
              if (curAttribute.column === attributesColumnTable[j]) {
                LOGGER.error("La description de l'attribut indique une colonne deja utilisee.");
                return false;
              }
            }
          }

          // TODO: vérification que ce n'est pas du code injecté

        }

        if (!curAttribute.default) {
          LOGGER.error("La description de l'attribut est incomplete: default");
          return false;
        } else {

          if (curAttribute.default !== "true" && curAttribute.default !== "false") {
            LOGGER.error("La description de l'attribut a un parametre 'default' incorrect.");
            return false;
          }

        }

        attributesKeyTable.push(curAttribute.key);
        attributesColumnTable.push(curAttribute.column);

      }
    } else {
      // rien à faire
    }

    return true;

  }

  /**
  *
  * @function
  * @name checkDuplicationTopology
  * @description Fonction utilisée pour vérifier que le contenu d'un fichier de description d'une source est bien le même qu'un autre.
  * @param {json} topologyJsonDescription - Description JSON de la topologie
  * @return {boolean} vrai si tout c'est bien passé et faux s'il y a eu une erreur
  *
  */

  checkDuplicationTopology(topologyJsonDescription) {

    LOGGER.info("Comparaison des deux topologies identifiees et devant etre identiques...");

    // On récupère la description de la topologie faisant office de référence car lue la première.
    let referenceTopology = this._topologyDescriptions[topologyJsonDescription.id];

    // On compare les deux objets
    try {
      assert.deepStrictEqual(topologyJsonDescription, referenceTopology);
    } catch (err) {
      LOGGER.error("Les deux topologies ne sont pas identiques.");
      LOGGER.error(err);
      return false;
    }

    LOGGER.info("Les deux topologies sont identiques.");
    return true;

  }

  /**
  *
  * @function
  * @name createTopology
  * @description Fonction utilisée pour créer une source.
  * @param {json} topologyJsonObject - Description JSON de la topologie
  * @return {Topology} Topologie créée - Instance d'une classe fille de Topology
  *
  */

  createTopology(topologyJsonObject) {

    LOGGER.info("Creation de la topologie: " + topologyJsonObject.id);

    let topology;

    // on vérifie d'abord que la topologie n'a pas déjà été créée
    if (this._topologiesCatalog[topologyJsonObject.id]) {
      return this._topologiesCatalog[topologyJsonObject.id];
    } else {
      // la topologie n'existe pas, on continue
    }

    if (topologyJsonObject.type === "osm") {

      let osmFile = "";
      if (topologyJsonObject.storage) {
        osmFile = topologyJsonObject.storage.file;
      } else {
        // ce n'est pas obligatoire
      }

      topology = new OsmTopology(topologyJsonObject.id, topologyJsonObject.description,
        topologyJsonObject.projection, topologyJsonObject.bbox, osmFile);

    } else if (topologyJsonObject.type === "db") {

      // récupération de la base
      let base = this._baseManager.createBase(topologyJsonObject.storage.base.dbConfig);
      // création des tableaux d'attributs
      let defaultAttributes = new Array();
      let otherAttributes = new Array();
      for (let i = 0; i < topologyJsonObject.storage.base.attributes.length; i++) {
        let curAttribute = topologyJsonObject.storage.base.attributes[i];
        if (curAttribute.default === "true") {
          defaultAttributes.push(curAttribute);
        } else if (curAttribute.default === "false") {
          otherAttributes.push(curAttribute);
        } else {
          // cela ne doit pas arriver
        }
      }
      // création de la topologie
      topology = new DbTopology(topologyJsonObject.id, topologyJsonObject.description,
        topologyJsonObject.projection, topologyJsonObject.bbox, base, topologyJsonObject.storage.base.schema,
        defaultAttributes, otherAttributes);

    } else {
      // On va voir si c'est un autre type.
    }

    this._topologiesCatalog[topologyJsonObject.id] = topology;

    return topology;
  }

  /**
  *
  * @function
  * @name loadAllTopologies
  * @description Fonction utilisée pour créer une source.
  *
  */

  loadAllTopologies() {

    if (this._listOfTopologyIds.length === 0) {
      LOGGER.error("Aucune topologie a charger.");
      return false;
    } else {
      // on continue
    }

    for (let i = 0; i < this._listOfTopologyIds.length; i++) {

      let id = this._listOfTopologyIds[i];
      let configuration = this._topologyDescriptions[id];

      this._topologiesCatalog[id] = this.createTopology(configuration);

    }

    return true;

  }

}
