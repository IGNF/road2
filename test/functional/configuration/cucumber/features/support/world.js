const { setWorldConstructor } = require("cucumber");
const path = require('path');
const fs = require('fs');
const os = require('os');

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

        // Espace temporaire pour stocker les configurations de chaque test
        this._tmpDirectory = os.tmpdir();

        // Contenu du server.json
        this._serverConf = {};

        // Contenu du log4js.json
        this._logConf = {};

        // Contenu des projections
        this._projConf = {};

        // Contenu des ressources 
        this._resourceConf = {};

        // Dossier temporaire pour le test en cours
        this._tmpDirConf = "";

    }

    // Lecture de la configuration des tests 
    loadTestConfiguration() {

        let configurationPath = path.resolve(__dirname, "../../configurations/local.json");
        let configuration = {};

        try {

            configuration = JSON.parse(fs.readFileSync(configurationPath));
            this._defaultServerConfiguration = configuration.defaultServerConfiguration;
            this._road2 = configuration.road2;
            this._tmpDirectory = configuration.tmpDirectory;

            return true;

        } catch(error) {
            return false;
        }

    }

    // Lecture de la configuration de Road2 
    readServerConfigurationFiles() {

        let projDirFiles = new Array();
        let resourceDirFiles = new Array();
        let newResourcesDirectories = new Array();

        // 1. On créé l'espace temporaire pour la configuration du scénario en cours
        if (!fs.existsSync(this._tmpDirectory)) {
            fs.mkdirSync(this._tmpDirectory, {recursive: true, mode: "766"});
        }

        try {
            this._tmpDirConf = fs.mkdtempSync(path.join(this._tmpDirectory, 'road2-'));
        } catch(error) {
            throw "Can't create tmp directory for this test: " + error;
        }

        // 2. On lit la configuration par défaut
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
            this._projConf[projDirFiles[i]] = JSON.parse(fs.readFileSync(path.join(projDir, projDirFiles[i])));
        }

        // Lecture des ressources 
        let resourceDir = this._serverConf.application.resources.directories;

        // Pour chaque dossier, on récupère l'ensemble des fichiers 
        for (let i = 0; i < resourceDir.length; i++) {

            let directoryName = path.join(this._tmpDirConf, "resources-" + i);
            newResourcesDirectories.push(directoryName);

            if (!fs.existsSync(directoryName)) {
                fs.mkdirSync(directoryName, {recursive: true, mode: "766"});
            }

            try {

                resourceDirFiles = fs.readdirSync(resourceDir[i]);

                for (let j = 0; j < resourceDirFiles.length; j++) {
                    this._resourceConf[directoryName] = {};
                    this._resourceConf[directoryName][resourceDirFiles[j]] = JSON.parse(fs.readFileSync(path.join(resourceDir[i], resourceDirFiles[j])));
                }

            } catch(error) {
                return false;
            }

        }

        // 3. On modifie la configuration pour qu'elle puisse être copiée dans l'espace temporaire 
        // mais elle pourra de nouveau être modifiée dans la suite du scénario

        // Emplacement du log4js.json
        this._serverConf.application.logs.configuration = path.join(this._tmpDirConf, "log4js.json");

        // Emplacement des ressources 
        this._serverConf.application.resources.directories = newResourcesDirectories;

        return true;

    }

    // Test de la configuration stockée 
    testConfiguration() {

        // On écrit la configuration dans l'espace temporaire
        try {
            fs.writeFileSync(path.join(this._tmpDirConf, "server.json"), JSON.stringify(this._serverConf));
        } catch(error) {
            throw "Can't write server.json : " + error;
        }

        try {
            fs.writeFileSync(path.join(this._tmpDirConf, "log4js.json"), JSON.stringify(this._logConf));
        } catch(error) {
            throw "Can't write log4js.json : " + error;
        }

        Object.keys(this._resourceConf).forEach( resourceDir => {
            Object.keys(this._resourceConf[resourceDir]).forEach( resourceFile => {
                try {
                    fs.writeFileSync(path.join(resourceDir, resourceFile), JSON.stringify(this._resourceConf[resourceDir][resourceFile]));
                } catch(error) {
                    throw "Can't write " + resourceFile + " in " + resourceDir + " : " + error;
                }
            });
        });
        
    }
 
}


setWorldConstructor(road2World);