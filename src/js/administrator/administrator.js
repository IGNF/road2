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
    
            if (!curServiceConf.onStart) {
                LOGGER.error("Mauvaise configuration: 'onStart' absent.");
                return false;
            } else {
    
                LOGGER.debug("configuration.onStart présent");
    
                if (curServiceConf.onStart !== "true" && curServiceConf.onStart !== "false") {
                    LOGGER.error("Mauvaise configuration: 'onStart' doit être 'true' ou 'false'.");
                    return false;
                } else {
                    LOGGER.debug("configuration.onStart bien configuré");
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
     * @name createServicesOnStart
     * @description Création des services gérés par cet administrateur dont la création a été demandé au démarrage de l'administrateur
     *
     */

    async createServicesOnStart() {

        LOGGER.info("Vérification et création des services onStart=true...");

        // Pour chaque service, on va voir s'il doit être démarré 
        // Si oui, on vérifie sa configuration puis on le démarre 

        for (let i = 0; i < this._configuration.administration.services.length; i++) {

            let curIASConf = this._configuration.administration.services[i];
            LOGGER.debug("Analyse du service : " + curIASConf.id);

            if (curIASConf.onStart === "false") {
                // il n'y a rien à faire
                LOGGER.debug("Le service " + curIASConf.id + " n'est à démarrer tout de suite");
                continue;
            } else {
                LOGGER.info("Le service " + curIASConf.id + " est à démarrer");
            }

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
            LOGGER.info("Chargement du service...");
            if (!this._serviceManager.loadService(curIASConf.creationType, curIASConf.id, serviceConfLocation, serviceConfiguration)) {
                LOGGER.error("Impossible de créer le service "+ curIASConf.id);
                // On essaye les suivants
                continue;
            } else {
                LOGGER.info("Le service " + curIASConf.id + " a été lancé correctement");
            }

        }

        return true;

    }

}


