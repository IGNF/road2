'use strict';

const express = require('express');
const log4js = require('log4js');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const assert = require('assert').strict;
const serverManager = require('../server/serverManager');
const serviceManager = require('../service/serviceManager');
const apisManager = require('../apis/apisManager');
const HealthResponse = require('../responses/healthResponse');
const errorManager = require('../utils/errorManager');

// Création du LOGGER
const LOGGER = log4js.getLogger("ADMINISTRATOR");

/**
*
* @class
* @name Administrator
* @description Pour chaque démarrage de Road2, il y a un Administrateur qui gère les services rendus. C'est un serveur qui écoute sur un port différent des serveurs des services. 
*
*/

module.exports = class Administrator {

    /**
     *
     * @function
     * @name constructor
     * @description Constructeur de la classe Administrator
     *
     */

    constructor() {

        // Manager des serveurs, il contient la liste des serveurs diponibles
        this._serverManager = new serverManager();

        // APIs utilisées pour parler avec l'administrateur
        this._apisManager = new apisManager();

        // Manager des services gérés par l'administrateur
        this._serviceManager = new serviceManager();

        // Configuration de l'administration
        this._configuration = {};

        // Chemin absolu de la configuration
        this._configurationPath = "";

        // Configuration des logs
        this._logConfiguration = {};


    }

    /**
     *
     * @function
     * @name checkAdminConfiguration
     * @description Vérifier la partie administration de la configuration
     * @param {json} configuration - Configuration de Road2 (contenu du server.json)
     *
     */

    checkAdminConfiguration(configuration) {

        LOGGER.info("Verification de la configuration de l'administrateur...");

        // Fichier complet
        if (!configuration) {
            LOGGER.error("Configuration absente");
            return false;
        } else {
            LOGGER.debug("Configuration présente");
        }

        // Partie administration 
        if (!configuration.administration) {
            LOGGER.error("Mauvaise configuration: 'administration' absent.");
            return false;
        } else {
            LOGGER.debug("configuration.administration présent");
        }

        // Services à administrer
        if (!configuration.administration.services) {
            LOGGER.error("Mauvaise configuration: 'administration.services' absent.");
            return false;
        } else {
            LOGGER.debug("configuration.administration.services présent");

            if (!Array.isArray(configuration.administration.services)) {
                LOGGER.error("Mauvaise configuration: 'administration.services' n'est pas un tableau.");
                return false;
            } else {

                LOGGER.debug("configuration.administration.services est bien un tableau");

                if (configuration.administration.services.length === 0) {
                    LOGGER.error("Mauvaise configuration: 'administration.services' est un tableau vide.");
                    return false;
                } else {
                    LOGGER.debug("configuration.administration.services est bien un tableau qui contient des éléments");
                }

            }
        }

        // On ne veut pas que les Id soient réutilisés
        let checkedServiceId = new Array();
        let checkedServiceConf = new Array();
        let checkedServiceConfLocation = new Array();

        for (let i = 0; i < configuration.administration.services.length; i++) {

            let curServiceConf = configuration.administration.services[i];

            let configurationLocation = "";
            let configurationContent = {};

            if (!curServiceConf.id) {
                LOGGER.error("Mauvaise configuration: 'id' absent.");
                return false;
            } else {

                if (typeof(curServiceConf.id) !== "string") {
                    LOGGER.error("Mauvaise configuration: 'id' n'est pas une string.");
                    return false;
                }
                if (curServiceConf.id === "") {
                    LOGGER.error("Mauvaise configuration: 'id' est une string vide.");
                    return false;
                }

                LOGGER.debug("Id présent : " + curServiceConf.id);

                // On vérifie que l'id n'est pas déjà pris 
                if (checkedServiceId.length === 0) {
                    // On continue la suite de la vérification
                } else {

                    for (let j = 0; j < checkedServiceId.length; j++) {
                        if (curServiceConf.id === checkedServiceId[j]) {
                            LOGGER.error("Id de service déjà pris : " + curServiceConf.id);
                            return false;
                        } 
                    }

                }

            }

            if (!curServiceConf.configuration) {
                LOGGER.error("Mauvaise configuration: 'configuration' absent.");
                return false;
            } else {
    
                LOGGER.debug("configuration présent");
                                
                try {
                    configurationLocation =  path.resolve(path.dirname(this._configurationPath), curServiceConf.configuration);
                    LOGGER.debug("Chemin absolu du fichier de configuration du service : " + configurationLocation);
                } catch (error) {
                    LOGGER.error("Can't get absolute path of service configuration: " + curServiceConf.configuration);
                    LOGGER.error(error);
                    return false;
                }

                // On vérifie que ce chemin n'est pas déjà utilisé 
                if (checkedServiceConfLocation.length !== 0) {
                    for (let cs = 0; cs < checkedServiceConfLocation.length; cs++) {
                        if (configurationLocation === checkedServiceConfLocation[cs]) {
                            LOGGER.error("La configuration indiquée est déjà vérifiée. Elle ne peut être utilisée pour un autre service géré par cet administrateur.");
                            return false;
                        }
                    }
                }

                try {
                // Il s'agit juste de savoir si le fichier est lisible par Road2, il sera exploité plus tard 
                configurationContent = JSON.parse(fs.readFileSync(configurationLocation));
                LOGGER.debug("Le contenu du fichier est accessible par Road2");
                } catch (error) {
                LOGGER.error("Mauvaise configuration: impossible de lire ou de parser le fichier de configuration du service: " + configurationLocation);
                LOGGER.error(error);
                return false;
                }

                // On vérifie que ce contenu n'est pas déjà utilisé
                if (checkedServiceConf.length !== 0) {
                    for (let cs = 0; cs < checkedServiceConf.length; cs++) {
                        try {
                            assert.deepStrictEqual(configurationContent, checkedServiceConf[cs]);
                            LOGGER.error("Le contenu de configuration indiqué est déjà vérifié pour un autre service. Il ne peut être utilisée pour plus d'un service géré par cet administrateur.");
                            return false;
                        } catch (err) {
                            LOGGER.debug("Les deux configuration de service ne sont pas identiques.");
                        }
                    }
                }

                  
    
            }
    
            if (!curServiceConf.creationType) {
                LOGGER.error("Mauvaise configuration: 'creationType' absent.");
                return false;
            } else {
    
                LOGGER.debug("configuration.creationType présent");
    
                if (!["sameProcess","newProcess","findByURI"].includes(curServiceConf.creationType)) {
                    LOGGER.error("Mauvaise configuration: 'creationType' doit être parmi 'sameProcess', 'newProcess', 'findByURI'.");
                    return false;
                } else {
                    LOGGER.debug("configuration.creationType bien configuré");
                }
    
            }
    
            LOGGER.debug("Vérification du service en cours terminée");
            checkedServiceId.push(curServiceConf.id);
            checkedServiceConf.push(configurationContent);
            checkedServiceConfLocation.push(configurationLocation);


        }

        LOGGER.debug("Vérification des services terminée");

        // API utilisée pour administrer
        if (!configuration.administration.api) {
            LOGGER.fatal("Mauvaise configuration: 'administration.api' absent.");
            return false;
        } else {
            LOGGER.debug("configuration.administration.api présent");
        }

        if (!this._apisManager.checkApiConfiguration(configuration.administration.api)) {
            LOGGER.fatal("Mauvaise configuration: 'administration.api' mal configuré.");
            return false;
        } else {
            LOGGER.debug("configuration.administration.api bien configuré");
        }
        
        // Partie network de l'administrateur
        if (!configuration.administration.network) {
            LOGGER.fatal("Mauvaise configuration: 'administration.network' absent.");
            return false;
        } else {
            LOGGER.debug("configuration.administration.network présent");
        }

        if (!configuration.administration.network.server) {
            LOGGER.fatal("Mauvaise configuration: 'administration.network.server' absent.");
            return false;
        } else {
            LOGGER.debug("configuration.administration.network.server présent");
        }

        if (!this._serverManager.checkServerConfiguration(configuration.administration.network.server)){
            LOGGER.fatal("Mauvaise configuration: 'administration.network.server' mal configuré.");
            return false;
        } else {
            LOGGER.debug("configuration.administration.network.server bien configuré");
        }

        LOGGER.info("La configuration de l'administrateur est correcte");
        return true;

    }

    /**
     *
     * @function
     * @name saveAdminConfiguration
     * @description Sauvegarder la partie administration de la configuration
     * @param {json} configuration - Configuration de Road2 (contenu du server.json)
     * @param {string} configurationPath - Chemin de la configuration de Road2 (chemin du server.json)
     * @param {json} logConfiguration - Configuration des logs Road2 (contenu du log4js-administrator.json)
     *
     */

    saveAdminConfiguration(configuration, configurationPath, logConfiguration) {

        LOGGER.info("Sauvegarde de la configuration de l'administrateur dans son instance...");

        this._configuration = configuration;
        this._configurationPath = configurationPath;
        this._logConfiguration = logConfiguration;

    }

    /**
     *
     * @function
     * @name createServer
     * @description Création et démarrage du serveur pour l'administration
     *
     */

    createServer() {

        LOGGER.info("Creation de l'application web Express...");

        // Application Express
        let administrator = express();

        // Stockage de l'instance Administrator dans l'app expressJS afin que les informations soient accessibles par les requêtes
        administrator.set("administrator", this);

        // Gestion des en-têtes avec helmet selon les préconisations d'ExpressJS
        administrator.use(helmet());

        // Pour le log des requêtes reçues sur le service avec la syntaxe
        LOGGER.info("Instanciation du logger pour les requêtes...");

        try {

            administrator.use(log4js.connectLogger(log4js.getLogger('request'), {
                level: this._logConfiguration.httpConf.level,
                format: (req, res, format) => format(this._logConfiguration.httpConf.format)
            }));

        } catch (error) {
            LOGGER.fatal("Impossible de connecter le logger pour les requetes: ");
            LOGGER.error(this._logConfiguration.httpConf)
            LOGGER.error(error);
            return false;
        }

        // Chargement de l'API
        LOGGER.info("Chargement de l'API d'administration...");
        if (!this._apisManager.loadApiConfiguration(administrator, this._configuration.administration.api)) {
            LOGGER.error("Erreur lors du chargement de l'API.");
            return false;
        } else {
            LOGGER.debug("API chargée");
        }
    
        administrator.all('/', (req, res) => {
            res.send('Road2 Administrator');
        });
    
        // Création du serveur
        LOGGER.info("Création du serveur d'administration...");
        if (!this._serverManager.loadServerConfiguration(administrator, this._configuration.administration.network.server)) {
            LOGGER.fatal("Impossible de creer le serveur d'administration.");
            return false;
        } else {
            LOGGER.debug("Serveur d'administration créé");
        }
    
        // Démarrage du serveur
        LOGGER.info("Démarrage du serveur d'administration...");
        if (!this._serverManager.startAllServers()) {
            LOGGER.fatal("Impossible de démarrer le serveur d'administration.");
            return false;
        } else {
            LOGGER.debug("Serveur d'administration démarré");
        }

        return true;

    }

    /**
     *
     * @function
     * @name checkServicesConfiguration
     * @description Vérification de la configuration des services indiqués dans server.json
     *
     */

    async checkServicesConfiguration() {

        LOGGER.info("Vérification de la configuration des services...");

        for (let i = 0; i < this._configuration.administration.services.length; i++) {

            let curIASConf = this._configuration.administration.services[i];
            LOGGER.debug("Vérification du service : " + curIASConf.id);

            // Récupération de la configuration
            let file = path.resolve(path.dirname(this._configurationPath), curIASConf.configuration);
            let serviceConfiguration = JSON.parse(fs.readFileSync(file));

            // Vérification
            if (!(await this._serviceManager.checkServiceConfiguration(serviceConfiguration, file))) {
                LOGGER.error("La configuration du service "+ curIASConf.id +" est incorrecte");
                return false;
            } else {
                LOGGER.info("La configuration du service "+ curIASConf.id +" est correcte");
            }


        }

        return true;

    }

    /**
     *
     * @function
     * @name createServices
     * @description Création des services gérés par cet administrateur 
     *
     */

    async createServices() {

        LOGGER.info("Vérification et création des services");

        // Pour chaque service, on vérifie sa configuration puis on le démarre 

        for (let i = 0; i < this._configuration.administration.services.length; i++) {

            let curIASConf = this._configuration.administration.services[i];
            LOGGER.debug("Analyse du service : " + curIASConf.id);

            // Récupération de la configuration
            LOGGER.info("Récupération de la configuration du service");
            let serviceConfLocation = path.resolve(path.dirname(this._configurationPath), curIASConf.configuration);
            let serviceConfiguration = JSON.parse(fs.readFileSync(serviceConfLocation));

            // Vérification de la configuration 
            LOGGER.info("Vérification de la configuration...");
            if (!(await this._serviceManager.checkServiceConfiguration(serviceConfiguration, serviceConfLocation))) {
                LOGGER.error("La configuration du service "+ curIASConf.id +" est incorrecte");
                return false;
            } else {
                LOGGER.info("La configuration du service "+ curIASConf.id +" est correcte");
            }

            // Chargement du service
            let options = {adminLogConfiguration: this._logConfiguration};
            LOGGER.info("Chargement du service...");
            if (!await this._serviceManager.loadService(curIASConf.creationType, curIASConf.id, serviceConfLocation, options)) {
                LOGGER.error("Impossible de créer le service "+ curIASConf.id);
                // On essaye les suivants
                continue;
            } else {
                LOGGER.info("Le service " + curIASConf.id + " a été lancé correctement");
            }

        }

        return true;

    }

    /**
     *
     * @function
     * @name computeHealthRequest
     * @description Gestion de la requête d'état du serveur 
     * Cette fonction ne suit pas le m$eme chemin que les autres car elle est globale 
     * et ne concerne pas un service particulier
     * Elle renvoit une healthResponse complète et c'est au niveau de l'API qu'on peut la modifier
     * @param {HealthRequest} healthRequest - Instance de la classe HealthRequest
     *
     */

    async computeHealthRequest(healthRequest) {

        LOGGER.info("computeHealthRequest...");

        let gotOrange = false;
        let gotRed = false;

        let healthResponse = new HealthResponse();

        // Étant donné que l'administrateur est en train de répondre, on le met au vert 
        // À voir s'il y a des fonctionnalités qui pourraient le mettre à l'orange ou au rouge
        // Dans ce cas là, il faudra que l'administrator ait un attribut d'état et que celui-ci soit lu dans cette fonction
        healthResponse.adminState = "green";

        // Pour chaque service, on demande au serviceManager l'état du service
        for (let i = 0; i < this._configuration.administration.services.length; i++) {

            let curServiceId = this._configuration.administration.services[i].id;
            LOGGER.debug("Demande de l'état du service : " + curServiceId);

            // Le passage potentiel par IPC fait perdre les méthodes donc dans la suite, on est obligé de prendre les attributs avec _
            let curHealthResponse = await this._serviceManager.computeRequest(curServiceId, healthRequest);

            if (curHealthResponse._type !== "healthResponse") {
                // Ce n'est pas normal, on renvoit une erreur pour ce service
                // et on met le flag rouge
                LOGGER.error("Le service " + curServiceId + " n'a pas donné de réponse du bon type");
                gotRed = true;
                healthResponse.serviceStates.push({"serviceId":curServiceId,"state":"unknown"});
                continue;
            }

            if (!curHealthResponse._serviceStates[0]) {
                // Ce n'est pas normal, on renvoit une erreur pour ce service
                // et on met le flag rouge
                LOGGER.error("Le service " + curServiceId + " n'a pas donné de réponse");
                gotRed = true;
                healthResponse.serviceStates.push({"serviceId":curServiceId,"state":"unknown"});
                continue;
            }

            if (!curHealthResponse._serviceStates[0].state) {
                // Ce n'est pas normal, on renvoit une erreur pour ce service
                // et on met le flag rouge
                LOGGER.error("Le service " + curServiceId + " n'a pas donné d'état");
                gotRed = true;
                healthResponse.serviceStates.push({"serviceId":curServiceId,"state":"unknown"});
                continue;
            }

            // Pour la suite, on note la présence d'orange et de rouge dans les services
            if (curHealthResponse._serviceStates[0].state === "orange") {
                LOGGER.debug("Le service " + curServiceId + " est orange");
                gotOrange = true;
            } else if (curHealthResponse._serviceStates[0].state === "red") {
                LOGGER.debug("Le service " + curServiceId + " est red");
                gotRed = true;
            } else if (curHealthResponse._serviceStates[0].state === "green") {
                // Tout va bien, rien à faire
                LOGGER.debug("Le service " + curServiceId + " est green");
            } else {
                // Cela ne devrait pas arriver, on renvoit une erreur pour ce service
                // et on met le flag rouge
                LOGGER.error("Le service " + curServiceId + " est dans un état inconnu");
                gotRed = true;
                healthResponse.serviceStates.push({"serviceId":curServiceId,"state":"unknown"});
                continue;
            }

            // On stocke le retour de ce service 
            curHealthResponse._serviceStates[0].id = curServiceId;
            healthResponse.serviceStates.push(curHealthResponse._serviceStates[0]);

        }

        // En fonction des états définis précédemment, on va définir l'état global 
        // Pour faire simple : 
        // - global est orange si un des services est orange
        // - global est rouge si un des services est rouge
        if (gotRed) {
            healthResponse.globalState = "red";
        } else {
            if (gotOrange) {
                healthResponse.globalState = "orange";
            } else {
                healthResponse.globalState = "green";
            }
        }

        return healthResponse;

    }


    /**
     *
     * @function
     * @name getServicesConfigurations
     * @description Récupération de la configuration des services
     * @param {json} response - Reponse json contenant les configuration de services
     *
     */

    getServicesConfigurations(parameters) {

        LOGGER.info("getServicesConfigurations...");

        let responses = new Array();

        // Pour chaque service, on récupère la configuration depuis le fichier de configuration
        for (let i = 0; i < this._configuration.administration.services.length; i++) {            
            const configuration = this.readServiceConfiguration(this._configuration.administration.services[i]);
            responses.push(configuration);
        }        

        return responses;
    }

    /**
     *
     * @function
     * @name getServiceConfiguration
     * @description Récupération de la configuration d'un service
     * @param {json} response - Reponse json contenant la configuration du service
     *
     */

    getServiceConfiguration(parameters) {

        LOGGER.info("getServiceConfiguration...");

        const service = this._configuration.administration.services.find(service => service.id == parameters.service)

        if (service) {
            return this.readServiceConfiguration(service);
        } else {
            throw errorManager.createError(`Can't find service ${parameters.serviceId}`, 404)
        }      

    }

    /**
     *
     * @function
     * @name readServiceConfiguration
     * @description Lecture de la configuration d'un service
     * @param {json} configuration - Configuration du service
     *
     */

    readServiceConfiguration(service) {

        LOGGER.info(`readServiceConfiguration...`);

        LOGGER.debug(`Lecture fichier de configuration du service : ${service.id}`);
        try {
            const serviceConf = service.configuration
            const configurationLocation =  path.resolve(path.dirname(this._configurationPath), serviceConf);
            let configuration = JSON.parse(fs.readFileSync(configurationLocation));

            // Ajout de l'id
            configuration.id = service.id
            
            return configuration

        } catch (error) {
            throw errorManager.createError(`Can't read service configuration file : ${error}`, 500)
        }

    }

}




