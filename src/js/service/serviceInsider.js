'use strict';

const log4js = require('log4js');
const fs = require('fs');

const ServiceAdministered = require('./serviceAdministered');
const Service = require('./service');

// Création du LOGGER
const LOGGER = log4js.getLogger("SERVICEINS");

/**
*
* @class
* @name ServiceInsider
* @description Classe modélisant un service administré mais qui se situe dans un autre processus que celui de l'administrateur qui le gère.
*
*/

module.exports = class ServiceInsider extends ServiceAdministered {


  /**
   *
   * @function
   * @name constructor
   * @description Constructeur de la classe ServiceInsider
   * @param {string} id - Identifiant du service pour l'administrateur
   * @param {string} location - Localisation de la configuration du service
   * 
   */
  constructor(id, location) {

    // Constructeur parent
    super(id, "sameProcess");

    // Emplacement de la configuration
    this._configurationLocation = location;

    // Instance de la classe Service
    this._serviceInstance = {};

  }

  /**
   *
   * @function
   * @name loadService
   * @description Créer un service administré via une instanciation de la classe Service
   * @param {object} options - Options pour charger le service (ici, il faut la configuration des logs de l'administrateur pour s'y rattacher)
   * 
   *
   */
  async loadService(options) {

  LOGGER.info("Création et lancement d'un service dans dans le même processus");

      // Un minimum de vérifications au cas où 
      if (typeof(this._configurationLocation) !== "string") {
        LOGGER.error("Le chemin fourni n'est pas une string");
        return null;
      } else {
        LOGGER.debug("Le chemin fourni est bien une string");
      }

      if (this._configurationLocation === "") {
        LOGGER.error("Le chemin fourni est vide");
        return null;
      } else {
        LOGGER.debug("Le chemin est renseigné : " + this._configurationLocation);
      }

      if (!options) {
        LOGGER.error("Options vides");
        return null;
      }
      if (!options.adminLogConfiguration) {
        LOGGER.error("Options sans attribut 'adminLogConfiguration'");
        return null;
      }

      // Création du service via un fork : on lance simplement service/main.js
      LOGGER.info("Instanciation d'un service...");

      this._serviceInstance = new Service();

      LOGGER.info("Instance créée");

      LOGGER.info("Execution des taches pour démarrer le service...");

      // Récupération de la configuration
      let configuration = {};
      try {
        configuration = JSON.parse(fs.readFileSync(this._configurationLocation));
      } catch(error) {
        LOGGER.error("Impossible de lire la configuration : " + this._configurationLocation);
        LOGGER.error(error);
        return false;
      }

      // Vérification au cas où cela n'a pas été fait avant
      if (!(await this._serviceInstance.checkServiceConfiguration(configuration, this._configurationLocation))) {
        LOGGER.error("Configuration non validée. Impossible de démarrer le service");
        return false;
      } else {

        LOGGER.debug("Configuration du service vérifiée et suffisamment validée pour lancer un service");
  
        // On aura besoin de cette configuration juste après et peut-être plus tard 
        this._serviceInstance.saveServiceConfiguration(configuration, this._configurationLocation, options.adminLogConfiguration);
  
        // On lance le chargement du service qui est normalement correctement configuré
        if (!this._serviceInstance.loadServiceConfiguration()) {
          LOGGER.error("Configuration non chargée. Impossible de démarrer le service");
          return false;
        } else {
  
          LOGGER.debug("Service chargé");
  
          // On connecte les sources
          if (!(await this._serviceInstance.connectSources())) {
  
            LOGGER.error("Aucune source n'a pu être connectée");
            return false;
          
          } else {
  
            LOGGER.info("Les sources connectables ont été connectées");
  
            // On démarre les serveurs associé à ce service
            if (!this._serviceInstance.startServers()) {
              LOGGER.error("Impossible de démarrer les serveurs. Impossible de démarrer le service");
              return false;
            }
  
          }
  
        }
    
      }
    
      return true;

  }

  /**
   *
   * @function
   * @name stopService
   * @description Arrêter un service administré via une instanciation de la classe Service
   * @return {boolean} status - Retourne si le service a bien été arrêté
   *
   */
  async stopService() {

    LOGGER.info("Arrêt d'un service dans le même processus");

    const status = this._serviceInstance.stopServers();
    this._serviceInstance = null;

    return status;
  
  }

  /**
   *
   * @function
   * @name computeRequest
   * @description Fonction pour utiliser pour envoyer une requête à un service selon le mode adaptée à la classe fille. Elle doit être ré-écrite dans chaque classe fille.
   * @param {object} request - Instance fille de la classe Request 
   * 
   */
  computeRequest(request) {

    LOGGER.info("computeRequest...");

    // L'instance de Service est accessible, il suffit de faire appel à la fonction qui traite les requêtes
    return this._serviceInstance.computeAdminRequest(request);

  }

}
