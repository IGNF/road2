'use strict';

const log4js = require('log4js');
const Service = require('./service');
const ServiceInsider = require('./serviceInsider');
const ServiceProcess = require('./serviceProcess');
const errorManager = require('../utils/errorManager');

// Création du LOGGER
const LOGGER = log4js.getLogger("SERVICEMANAGER");

/**
*
* @class
* @name serviceManager
* @description Gestionnaire des services gérés par un administrateur
*
*/

module.exports = class serviceManager {

    /**
     *
     * @function
     * @name constructor
     * @description Constructeur de la classe serviceManager
     *
     */
    constructor() {

        // Catalogue de services chargés (objets de la classe ServiceAdministered)
        this._loadedServiceAdministeredCatalog = {};

        // Emplacement de la configuration des services chargés (chemin du service.json)
        this._loadedServiceConfLocations = {};

    }

    /**
     *
     * @function
     * @name checkServiceConfiguration
     * @description Vérification du contenu de la configuration d'un service (contenu du service.json)
     * @param {object} configuration - Configuration du service (contenu du service.json)
     * @param {string} configurationLocation - Chemin de la configuration du service (chemin du service.json)
     *
     */
    async checkServiceConfiguration(configuration, configurationLocation) {

        LOGGER.info("Vérification du contenu de la configuration du service...");

        // Création d'un service pour vérifier la configuration 
        // On procède ainsi pour ne pas dupliquer du code déjà présent dans la classe Service
        // De plus, on souhaite que la classe Service soit indépendante, donc ait le code de vérification de sa conf
        let service = new Service();

        if (!(await service.checkServiceConfiguration(configuration, configurationLocation))) {
            LOGGER.error("La configuration du service n'est pas correcte");
            return false;
        } else {
            LOGGER.info("La configuration du service est correcte");
            return true;
        }

    }

    /**
     *
     * @function
     * @name loadService
     * @description Création et lancement d'un service à partir de sa configuration
     * @param {string} creationType - Type de création pour le service. Permet d'indiquer si on est dans le même process ou pas, voir sur une autre machine en théorie. 
     * @param {string} id - Id du service pour l'administrateur
     * @param {string} configurationLocation - Emplacement de la configuration du service à charger
     * @param {object} options - Contenu optionnel pour le chargement de certains types de services
     * 
     */
    async loadService(creationType, id, configurationLocation, options) {

        LOGGER.info("Création et lancement du service " + id);

        // TODO : voir s'il n'existe pas déjà ? 

        let serviceAdministered = {};

        // En fonction du type demandé, on va créer différemment le service
        // Dans la configuration, on a "sameProcess", "newProcess" et "findByURI"
        if (creationType === "sameProcess") {

            // Instanciation du service directement sur le même process que l'administrateur
            LOGGER.debug("sameProcess : Création d'un service dans le même processus");

            serviceAdministered = new ServiceInsider(id, configurationLocation);

        } else if (creationType === "newProcess") {

            LOGGER.debug("newProcess : Création d'un service dans un autre processus");

            serviceAdministered = new ServiceProcess(id, configurationLocation);

        } else if (creationType === "findByURI") {

            LOGGER.error("Type de création non implémentée. Impossible de créer le service.");
            return false;

        } else {

            // Cela ne devrait pas arriver 
            LOGGER.error("Le type de creation du service n'est pas valide. Impossible de créer un service");
            return false;

        }

        LOGGER.info("Service créé " + id);

        // On le démarre par le même appel, qu'importe son type de création
        LOGGER.info("Démarrage du service " + id);
        if (!(await serviceAdministered.loadService(options))) {
            LOGGER.error("Impossible de charger le service " + id);
            return false;
        }

        // Sauvegarde du service dans le manager
        LOGGER.info("Service démarré. Sauvegarde dans le serviceManager...");
        this._loadedServiceAdministeredCatalog[id] = serviceAdministered;
        this._loadedServiceConfLocations[id] = configurationLocation;

        return true;

    }

    /**
     *
     * @function
     * @name stopService
     * @description Arrêt d'un service
     * @param {string} creationType - Type de création pour le service. Permet d'indiquer si on est dans le même process ou pas, voir sur une autre machine en théorie. 
     * @param {string} id - Id du service pour l'administrateur
     * @param {string} configurationLocation - Emplacement de la configuration du service à charger
     * @param {object} options - Contenu optionnel pour le chargement de certains types de services
     * @return {boolean} response - Retourne si le service a bien été arrêté
     * 
     */
    async stopService(id) {

        LOGGER.info("Arrêt du service " + id);

        // On récupère le service administré
        const administeredService = this._loadedServiceAdministeredCatalog[id];
        if (!administeredService) {
            LOGGER.error("Aucun service associé à cet ID: " + serviceId);
            throw errorManager.createError("Unknown service : " + serviceId);
        }

        if (!(await administeredService.stopService())) {
            LOGGER.error("Impossible d'arrêter le service " + id);
            return false;
        }

        return true;

    }

    /**
     *
     * @function
     * @name restartService
     * @description Redémarrage d'un service
     * @param {string} creationType - Type de création pour le service. Permet d'indiquer si on est dans le même process ou pas, voir sur une autre machine en théorie. 
     * @param {string} id - Id du service pour l'administrateur
     * @param {string} configurationLocation - Emplacement de la configuration du service à charger
     * @param {object} options - Contenu optionnel pour le chargement de certains types de services
     * 
     */
    async restartService(creationType, id, configurationLocation, options) {

        LOGGER.info("Redémarrage du service " + id);

        // Arrêt du service
        if (!await this.stopService(id)) {
            LOGGER.error("Impossible d'arrêter le service : " + id);
            return false;
        } else {
            LOGGER.info("Le service " + id + " a été arrêté correctement");
        }

        // Lancement du service
        if (!await this.loadService(creationType, id, configurationLocation, options)) {
            LOGGER.error("Impossible de démarrer le service : " + id);
            return false;
        } else {
            LOGGER.info("Le service " + id + " a été démarré correctement");
        }

        return true;

    }

    /**
     *
     * @function
     * @name computeRequest
     * @description Gestion d'une requête pour un service 
     * La requête est envoyé au service puis la réponse du service est retournée
     * @param {string} serviceId - Id du service selon l'administrateur
     * @param {object} request - Instance fille de la classe Request 
     * 
     */
    async computeRequest(serviceId, request) {

        LOGGER.info("computeRequest...");

        // Quelques vérifications
        if (!serviceId) {
            throw errorManager.createError("Aucun id de service");
        } 
        if (typeof(serviceId) !== "string") {
            throw errorManager.createError("L'id de service n'est pas une string");
        } else {
            LOGGER.debug("serviceId: " + serviceId);
        }
        if (!request) {
            throw errorManager.createError("Aucune requête");
        } 
        if (typeof(request) !== "object") {
            throw errorManager.createError("La requête n'est pas un objet");
        } else {
            LOGGER.debug("request:");
            LOGGER.debug(request);
        }

        // On récupère le service administré
        let administeredService = this._loadedServiceAdministeredCatalog[serviceId];
        if (!administeredService) {
            LOGGER.error("Aucun service associé à cet ID: " + serviceId);
            throw errorManager.createError("Unknown service : " + serviceId);
        }

        // On envoit la requête et renvoit la réponse 
        let response = await administeredService.computeRequest(request);

        return response;

    }

}