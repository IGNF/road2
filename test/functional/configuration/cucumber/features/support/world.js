const { setWorldConstructor } = require("cucumber");
const path = require('path');
const fs = require('fs');

/**
*
* @class
* @name road2World
* @description Classe utile pour Cucumber afin de réaliser les tests fonctionnels sur la configuration de Road2
*
*/

class road2World {

    /**
     *
     * @function
     * @name constructor
     * @description Constructeur de la classe road2World
     *
     */
    constructor() {

        // Emplacement du server.json par défaut
        this._defaultServerConfiguration = "";

        // Emplacement du road2.js pour lancer le serveur
        this._road2 = "";

        // Contenu du server.json
        this._serverConf = {};

        // Contenu du log4js.json
        this._logConf = {};

        // Contenu des projections
        this._projConf = {};

        // Contenu des ressources 
        this._resourceConf = {};

    }

    // Lecture de la configuration des tests 
    loadConfiguration() {

        let configurationPath = path.resolve(__dirname, "../../configurations/local.json");
        let configuration = {};

        try {

            configuration = JSON.parse(fs.readFileSync(configurationPath));
            this._defaultServerConfiguration = configuration.defaultServerConfiguration;
            this._road2 = configuration.road2;

            return true;

        } catch(error) {
            return false;
        }

    }

    // Lecture de la configuration de Road2 
    readServerConfigurationFiles() {

        let projDirFiles = new Array();
        let resourceDirFiles = new Array();

        // Lecture du server.json
        try {
            this._serverConf = JSON.parse(fs.readFileSync(this._defaultServerConfiguration));
        } catch(error) {
            return false;
        }

        // Lecture du log4js.json
        try {
            this._logConf = JSON.parse(fs.readFileSync(this._serverConf.application.logs.configuration));
        } catch(error) {
            return false;
        }

        // Lecture des projections 
        let projDir = this._serverConf.application.projections.directory;

        try {
            projDirFiles = fs.readdirSync(projDir);
        } catch(error) {
            return false;
        }

        for (let i = 0; i < projDirFiles.length; i++) {
            this._projConf[projDirFiles[i]] = JSON.parse(fs.readFileSync(projDirFiles[i]));
        }

        // Lecture des ressources 
        let resourceDir = this._serverConf.application.resources.directories;

        // Pour chaque dossier, on récupère l'ensemble des fichiers 
        for (let i = 0; i < resourceDir.length; i++) {

            try {
                resourceDirFiles = fs.readdirSync(resourceDir[i]);
                for (let j = 0; j < resourceDirFiles.length; j++) {
                    this._resourceConf[resourceDir[i]] = {};
                    this._resourceConf[resourceDir[i]][resourceDirFiles[j]] = JSON.parse(fs.readFileSync(resourceDirFiles[j]));
                }
            } catch(error) {
                return false;
            }

        }
        
        
        
    }
 
}


setWorldConstructor(road2World);