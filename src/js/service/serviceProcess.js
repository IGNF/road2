'use strict';

const log4js = require('log4js');
const { fork } = require('child_process');

const ServiceAdministered = require('./serviceAdministered');
const errorManager = require('../utils/errorManager');
const healthResponse = require('../responses/healthResponse');
const {
    setInterval,
  } = require('node:timers/promises');

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

        // Compteur des requêtes envoyées effectivement au service
        this._requestCount = 0;

        // Liste des réponses en attente de lecture
        this._unReadResponses = {};

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

        this._serviceInstance = fork("./src/js/service/main.js", [this._configurationLocation, "child"], serviceOptions);

        LOGGER.info("Processus enfant créé");

        // Puisqu'un processus enfant a été créé et qu'il y a un canal IPC entre eux, on instancie la gestion des messages
        this._serviceInstance.on("message", (response) => {

            LOGGER.debug("Parent got message:");
            LOGGER.debug(response);

            // On stocke la réponse 
            this._unReadResponses[response._uuid] = response;

        });

        return true;

    }

    /**
     *
     * @function
     * @name stopService
     * @description Arrêter un service administré via une instanciation de la classe Service
     * @return {boolean} status - Retourne si le service s'est bien arrêté
     *
     */
    async stopService() {

        LOGGER.debug("Arrêt d'un service dans un autre processus");

        // Envoi du signal SIGTERM
        this._serviceInstance.kill();

        // Toutes les 10ms on va voir si le child s'est éteint
        const interval = 1000;

        // On attend que le child soit killed pour récupérer son exit code
        for await (const startTime of setInterval(interval, Date.now())) {

            let exitCode = this._serviceInstance.exitCode;
            LOGGER.debug(`exitCode = ${exitCode}`)
            if (exitCode !== null) {
                this._serviceInstance = null;
                return (exitCode == 0);
            }

            // Gestion du timeout : 20sec
            const now = Date.now();
            if ((now - startTime) > 20000) {
                LOGGER.info("Timeout atteint pour l'attente du code d'exit");
                throw errorManager.createError("Kill envoyé au processus child mais pas de code de retour");
            }

        }
    
    }

    /**
     *
     * @function
     * @name computeRequest
     * @description Fonction pour utiliser pour envoyer une requête à un service selon le mode adaptée à la classe fille. Elle doit être ré-écrite dans chaque classe fille.
     * @param {object} request - Instance fille de la classe Request 
     * 
     */
    async computeRequest(request) {

        LOGGER.info("computeRequest...");

        // On vérifie que le child est toujours connecté
        if (!this._serviceInstance.connected) {
            throw errorManager.createError("Impossible d'envoyer une requête au service car non connecté");
        } else {

            LOGGER.debug("Le service child est connecté");

            // On crée un UUID qui va permettre de faire le lien avec la réponse
            // TODO : que se passe-t-il si l'instance tourne longtemps, y'a-t-il une limite ?
            this._requestCount++;
            request._uuid = this._requestCount.toString();
            LOGGER.debug("Création d'un UUID:" + request._uuid);

            // On envoit la requête au child
            if (!this._serviceInstance.send(request)) {
                throw errorManager.createError("Erreur lors de l'envoie de la requête");
            }

            // On attend la réponse et on la renvoit
            let response = await this.waitResponse(request._uuid);
            
            return response;

        }

    }

    /**
     *
     * @function
     * @name waitResponse
     * @description Fonction pour utiliser pour récupérer la réponse d'une requête une fois qu'elle est arrivée
     * @param {string} uuid - UUID de la requête 
     * 
     */
    async waitResponse(uuid) {

        LOGGER.info("waitResponse...");

        let response = {};

        // Toutes les 10ms on va voir si la réponse est disponible
        const interval = 10;

        for await (const startTime of setInterval(interval, Date.now())) {

            // Est-ce que la réponse est disponible ?
            if (this._unReadResponses[uuid]) {
                LOGGER.debug("Response found for uuid: " + uuid);
                response = this._unReadResponses[uuid];
                LOGGER.debug(response);
                // On supprime la réponse de l'objet pour libérer la mémoire
                delete this._unReadResponses[uuid];
                LOGGER.debug(this._unReadResponses);
                break;
            }

            // Gestion du timeout : 1min
            const now = Date.now();
            if ((now - startTime) > 60000) {
                LOGGER.info("Timeout atteint pour l'attente de la réponse");
                response = errorManager.createError("Pas de réponse reçue dans le temps imparti");
                break;
            }

        }

        return response;

    }

}
