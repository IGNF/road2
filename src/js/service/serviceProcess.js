'use strict';

const log4js = require('log4js');
const { fork } = require('child_process');

const ServiceAdministered = require('./serviceAdministered');

// Création du LOGGER
const LOGGER = log4js.getLogger("SERVICEPRO");

/**
*
* @class
* @name ServiceProcess
* @description Classe modélisant un service administré mais qui se situe dans un autre processus que celui de l'administrateur qui le gère.
*
*/

module.exports = class ServiceProcess extends ServiceAdministered {


    /**
     *
     * @function
     * @name constructor
     * @description Constructeur de la classe ServiceProcess
     * @param {string} id - Identifiant du service pour l'administrateur
     * @param {string} location - Localisation de la configuration du service
     * 
     */
    constructor(id, location) {

        // Constructeur parent
        super(id, "newProcess");

        // Emplacement de la configuration
        this._configurationLocation = location;

        // Instance de childProcess quand le processus est lancé
        this._serviceInstance = {};

    }

    /**
     *
     * @function
     * @name loadService
     * @description Créer un service administré via un fork de processus
     *
     */
    loadService() {

    LOGGER.info("Création et lancement d'un service dans un autre processus");

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

        // On prépare les options 
        let serviceOptions = {};

        if (process.env.NODE_ENV === "debug") {
            serviceOptions.execArgv = new Array();
            serviceOptions.execArgv.push("--inspect=0.0.0.0:9230");
            LOGGER.debug("Options du service : ");
            LOGGER.debug(serviceOptions);
        } else {
            LOGGER.info("Pas d'options liées au debug");
        }

        // Création du service via un fork : on lance simplement service/main.js
        LOGGER.info("Fork du processus pour créer le service...");

        this._serviceInstance = fork("./src/js/service/main.js", [this._configurationLocation], serviceOptions);

        LOGGER.info("Processus enfant créé");

        return true;

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

    }

}
