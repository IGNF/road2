const { setWorldConstructor } = require("cucumber");
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

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

        // Nettoyage du dossier temporaire avec chaque test 
        this._cleanTmpDirectories = true;

        // Parametre pour la ligne de commande par défaut
        this._defaultCLParameter = "";

        // Parametres pour la ligne de commande pour le test en cours 
        this._commandLineParameters = {};

        // Contenu du server.json pour le test en cours
        this._serverConf = {};

        // Contenu du service.json pour le test en cours
        this._serviceConf = {};

        // Boolean pour savoir si le fichier de conf sera lisible ou pas 
        this._serverReadable = true;

        // Contenu du log4js-administration.json pour le test en cours
        this._logAdminConf = {};

        // Contenu du log4js-service.json pour le test en cours
        this._logServiceConf = {};

        // Contenu du cors.json pour le test en cours
        this._corsConf = {};

        // Contenu des projections pour le test en cours
        this._projConf = {};

        // Contenu des operations pour le test en cours
        this._operationsConf = {};

        // Contenu des parametres pour le test en cours
        this._parametersConf = {};

        // Contenu des ressources pour le test en cours
        this._resourceConf = {};

        // Dossier temporaire pour le test en cours
        this._tmpDirConf = "";

        // Instance de childProcess pour le test en cours
        this._childProcess;

        // Code de retour de Road2 pour le test en cours
        this._code;

        // stdout de Road2 pour le test en cours
        this._stdout = "";

        // stderr de Road2 pour le test en cours
        this._stderr = "";

    }

    // Lecture de la configuration des tests 
    loadTestConfiguration() {

        let configurationPath = path.resolve(__dirname, "../../configurations/local.json");
        let configuration = {};

        try {

            configuration = JSON.parse(fs.readFileSync(configurationPath));

        } catch(error) {
            return error;
        }

        // On sauvegarde les paramètres qui ne vont pas changés durant tout les tests
        this._defaultServerConfiguration = configuration.defaultServerConfiguration;
        this._road2 = configuration.road2;
        this._tmpDirectory = configuration.tmpDirectory;
        this._defaultCLParameter = configuration.defaultCLParameter;
        this._cleanTmpDirectories = configuration.cleanTmpDirectories;

        return true;

    }

    // Modification des paramètres de la ligne de commande 
    modifyCommandLineParameter(commandParameterValue, commandeParameterKey, modificationType) {

        if (modificationType === "modify") {
            Object.defineProperty(this._commandLineParameters, commandeParameterKey, { value: commandParameterValue, configurable: true, enumerable: true, writable: true });
        } else if (modificationType === "delete") {
            delete this._commandLineParameters[commandeParameterKey];
        } else {
            return false;
        }

        return true;

    }

    // Modification de l'objet serverConf pour que le fichier ne soit pas lisible pendant le test
    nonReadableServerConfiguration() {
        this._serverReadable = false;
    }

    // Lecture de la configuration de Road2 
    readServerConfigurationFiles() {

        let projDirFiles = new Array();
        let operationsDirFiles = new Array();
        let parametersDirFiles = new Array();
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
            throw "Can't parse server conf: "  + error;
        }

        // Lecture du log4js-administration.json
        try {
            this._logAdminConf = JSON.parse(fs.readFileSync(this._serverConf.administration.logs.configuration));
        } catch(error) {
            throw "Can't parse log4js admin conf: "  + error;
        }

        // Lecture du service.json
        try {
            this._serviceConf = JSON.parse(fs.readFileSync(this._serverConf.administration.services[0].configuration));
        } catch(error) {
            throw "Can't parse log conf: "  + error;
        }

        // Lecture du log4js-service.json
        try {
            this._logServiceConf = JSON.parse(fs.readFileSync(this._serviceConf.application.logs.configuration));
        } catch(error) {
            throw "Can't parse log conf: "  + error;
        }

        // Lecture du cors.json
        try {
            this._corsConf = JSON.parse(fs.readFileSync(this._serviceConf.application.network.cors.configuration));
        } catch(error) {
            throw "Can't parse cors conf: "  + error;
        }

        // Lecture des projections 
        let projDir = this._serviceConf.application.projections.directory;

        try {
            projDirFiles = fs.readdirSync(projDir);
        } catch(error) {
            throw "Can't read proj dir: "  + error;
        }

        for (let i = 0; i < projDirFiles.length; i++) {
            try {
                this._projConf[projDirFiles[i]] = JSON.parse(fs.readFileSync(path.join(projDir, projDirFiles[i])));
            } catch(error) {
                throw "Can't read projection file: " + error;
            }
        }

        // Lecture des operations 
        let operationsDir = this._serviceConf.application.operations.directory;

        try {
            operationsDirFiles = fs.readdirSync(operationsDir);
        } catch(error) {
            throw "Can't read operations dir: "  + error;
        }

        for (let i = 0; i < operationsDirFiles.length; i++) {
            try {
                this._operationsConf[operationsDirFiles[i]] = JSON.parse(fs.readFileSync(path.join(operationsDir, operationsDirFiles[i])));
            } catch(error) {
                throw "Can't read operations file: " + error;
            }
        }

        // Lecture des parametres 
        let parametersDir = this._serviceConf.application.operations.parameters.directory;

        try {
            parametersDirFiles = fs.readdirSync(parametersDir);
        } catch(error) {
            throw "Can't read parameters dir: "  + error;
        }

        for (let i = 0; i < parametersDirFiles.length; i++) {
            try {
                this._parametersConf[parametersDirFiles[i]] = JSON.parse(fs.readFileSync(path.join(parametersDir, parametersDirFiles[i])));
            } catch(error) {
                throw "Can't read parameters file: " + error;
            }
        }

        // Lecture des ressources 
        let resourceDir = this._serviceConf.application.resources.directories;

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
                throw "Can't read resources dir or files: "  + error;
            }

        }

        // 3. On modifie la configuration pour qu'elle puisse être copiée dans l'espace temporaire 
        // mais elle pourra de nouveau être modifiée dans la suite du scénario

        // Emplacement du service.json
        this._serverConf.administration.services[0].configuration = path.join(this._tmpDirConf, "service.json");

        // Emplacement du log4js-administration.json
        this._serverConf.administration.logs.configuration = path.join(this._tmpDirConf, "log4js-administration.json");

        // Emplacement du log4js-service.json
        this._serviceConf.application.logs.configuration = path.join(this._tmpDirConf, "log4js-service.json");

        // Emplacement des ressources 
        this._serviceConf.application.resources.directories = newResourcesDirectories;

        // Emplacement des projections 
        let curProjDir = path.join(this._tmpDirConf, "projections");
        this._serviceConf.application.projections.directory = curProjDir;
        if (!fs.existsSync(curProjDir)) {
            fs.mkdirSync(curProjDir, {recursive: true, mode: "766"});
        }

        // Emplacement des operations 
        let curOperationsDir = path.join(this._tmpDirConf, "operations");
        this._serviceConf.application.operations.directory = curOperationsDir;
        if (!fs.existsSync(curOperationsDir)) {
            fs.mkdirSync(curOperationsDir, {recursive: true, mode: "766"});
        }

        // Emplacement des parameters 
        let curParametersDir = path.join(this._tmpDirConf, "parameters");
        this._serviceConf.application.operations.parameters.directory = curParametersDir;
        if (!fs.existsSync(curParametersDir)) {
            fs.mkdirSync(curParametersDir, {recursive: true, mode: "766"});
        }

        // Emplacement du fichier server.json 
        this._commandLineParameters[this._defaultCLParameter] = path.join(this._tmpDirConf, "server.json");;


        return true;

    }

    // Modification de la configuration stockée en mémoire
    modifyServerConfiguration(attributeValue, attributeSchema, configurationId, configurationType, modificationType) {

        let modification;
        let attributesTable = new Array();

        // 1. On commence par déterminer sur quelle élément de la configuration on va faire des modifications
        if (configurationType === "server") {
            modification = this._serverConf;
        } else if (configurationType === "log-admin") {
            modification = this._logAdminConf;
        } else if (configurationType === "service") {
            modification = this._serviceConf;
        } else if (configurationType === "log-service") {
            modification = this._logServiceConf;
        } else if (configurationType === "cors") {
            modification = this._corsConf;
        } else if (configurationType === "projection") {
            modification = this._projConf[configurationId];
        } else if (configurationType === "resource") {
            for(const directoryName in this._resourceConf) {
                if (this._resourceConf[directoryName][configurationId]) {
                    modification = this._resourceConf[directoryName][configurationId];
                }
            }
        } else if (configurationType === "operations") {
            modification = this._operationsConf[configurationId];
        } else if (configurationType === "parameters") {
            modification = this._parametersConf[configurationId];
        } else {
            throw "Modification configurationType is unknown for this test: " + configurationType;
        }

        if (!modification) {
            throw "Objet a modifie incorrect";
        }

        // 2. On modifie l'objet 
        attributesTable = attributeSchema.split(".");
        if (attributesTable.length === 0) {
            throw "AttributeSchema is empty";
        }

        let currentObject = modification;

        // Pour chaque attribut, on va voir s'il existe et le rajouter sinon 
        for (let i = 0; i < attributesTable.length; i++) {

            // Analyse de l'attribut courant pour son nom ou son indice
            let attributeName;

            let attributeProperties = attributesTable[i].match(/^\[\d+\]$/g);
            if (attributeProperties !== null) {
                attributeName = parseInt(attributeProperties[0].slice(1, attributeProperties[0].length -1));
            } else {
                attributeName = attributesTable[i];
            }

            // Si c'est le dernier attribut alors on met la valeur
            if (i === attributesTable.length - 1) {

                if (typeof currentObject === "object" && typeof attributeName === "string" ) {
                    
                    if (modificationType === "delete") {
                        delete currentObject[attributeName];
                    } else if (modificationType === "modify") {
                        Object.defineProperty(currentObject, attributeName, { value: attributeValue, configurable: true, enumerable: true, writable: true });
                    } else {
                        throw "modificationType is unknown: " + modificationType;
                    }
                    return true;

                } else if (Array.isArray(currentObject) && typeof attributeName === "number" ) {

                    if (attributeName < currentObject.length) {

                        if (modificationType === "delete") {
                            currentObject.splice(attributeName, 1);
                        } else if (modificationType === "modify") {
                            currentObject.splice(attributeName, 1, attributeValue);
                        } else {
                            throw "modificationType is unknown: " + modificationType;
                        }
                        return true;

                    } else if (attributeName === currentObject.length) {
                        currentObject.push(attributeValue);
                        return true;
                    } else {
                        throw "Problem with last array length";
                    }

                } else {
                    throw "Last object type is unknown";
                }
                
            } else {

                // Si ce n'est pas le dernier attribut 
                // On regarde s'il est déjà dans l'objet courant (cette vérification dépend de son type)
                
                if (typeof currentObject === "object" && typeof attributeName === "string" ) {

                    let currentObjectTable = Object.keys(currentObject);

                    if (currentObjectTable.includes(attributeName)) {
                        currentObject = currentObject[attributeName];
                        continue;           
                    } else {

                        // On va créer l'attribut dans l'objet (selon son type, donné par l'analyse de l'attribut suivant)
                        let nextProperties = attributesTable[i+1].match(/\[\d+\]/g);
                        if (nextProperties !== null) {
                            Object.defineProperty(currentObject, attributeName, { value: new Array(), configurable: true, enumerable: true, writable: true });
                        } else {
                            Object.defineProperty(currentObject, attributeName, { value: new Object(), configurable: true, enumerable: true, writable: true });
                        }
                        currentObject = currentObject[attributeName];
                        continue;
                        
                    }

                } else if (Array.isArray(currentObject) && typeof attributeName === "number" ) {

                    if (attributeName < currentObject.length) {
                        currentObject = currentObject[attributeName];
                        continue;
                    } else if ( attributeName === currentObject.length) {

                        // On va créer l'attribut dans l'objet (selon son type, donné par l'analyse de l'attribut suivant)
                        let nextProperties = attributesTable[i+1].match(/\[\d+\]/g);
                        if (nextProperties !== null) {
                            currentObject.push(new Array());
                        } else {
                            currentObject.push(new Object());
                        }
                        currentObject = currentObject[attributeName];
                        continue;

                    } else {
                        throw "Problem with current array length";
                    }

                } else {
                    throw "Current object type is unknown";
                }

            }
   
        }

        return false;

    }

    // Creation de fichiers reabable ou pas 
    createFile(relativeFilePath, contentFile, readable) {

        try {
            fs.writeFileSync(path.join(this._tmpDirConf, relativeFilePath), contentFile);
        } catch(error) {
            throw "Can't write file " + relativeFilePath + " : " + error;
        }

        if (!readable) {
            // On ne veut pas que le fichier soit lisible 
            try {
                fs.chmodSync(path.join(this._tmpDirConf, relativeFilePath), "077");
                return true;
            } catch (error) {
                throw "Can't chmod file " + relativeFilePath + " : " + error;
            }

        } else {
            return true;
        }

    }

    // Creation de répertoire
    createDir(dirname) {
        try {
            fs.mkdirSync(path.join(this._tmpDirConf, dirname));
        } catch(error) {
            throw "Can't create directory " + dirname + " : " + error;
        }
        return true
    }

    createWrongJSONFile(relativeFilePath) {

        try {
            fs.writeFileSync(path.join(this._tmpDirConf, relativeFilePath), "{'a': 1,}");
        } catch(error) {
            throw "Can't write file " + relativeFilePath + " : " + error;
        }

    }

    // Test de la configuration stockée 
    testConfiguration() {

        // On écrit la configuration dans l'espace temporaire
        try {
            fs.writeFileSync(path.join(this._tmpDirConf, "server.json"), JSON.stringify(this._serverConf));
        } catch(error) {
            throw "Can't write server.json : " + error;
        }

        if (!this._serverReadable) {
            // On ne veut pas que le fichier soit lisible 
            try {
                fs.chmodSync(path.join(this._tmpDirConf, "server.json"), "077");
            } catch (error) {
                throw "Can't chmod file " + relativeFilePath + " : " + error;
            }

        } 

        try {
            fs.writeFileSync(path.join(this._tmpDirConf, "log4js-administration.json"), JSON.stringify(this._logAdminConf));
        } catch(error) {
            throw "Can't write log4js-administration.json : " + error;
        }

        try {
            fs.writeFileSync(path.join(this._tmpDirConf, "service.json"), JSON.stringify(this._serviceConf));
        } catch(error) {
            throw "Can't write service.json : " + error;
        }

        try {
            fs.writeFileSync(path.join(this._tmpDirConf, "log4js-service.json"), JSON.stringify(this._logServiceConf));
        } catch(error) {
            throw "Can't write log4js-service.json : " + error;
        }

        try {
            fs.writeFileSync(path.join(this._tmpDirConf, "cors.json"), JSON.stringify(this._corsConf));
        } catch(error) {
            throw "Can't write cors.json : " + error;
        }

        let curProjDir = path.join(this._tmpDirConf, "projections");
        Object.keys(this._projConf).forEach( projFile => {
            try {
                fs.writeFileSync(path.join(curProjDir, projFile), JSON.stringify(this._projConf[projFile]));
            } catch(error) {
                throw "Can't write " + projFile + " in " + curProjDir + " : " + error;
            }
        });

        let curOperationsDir = path.join(this._tmpDirConf, "operations");
        Object.keys(this._operationsConf).forEach( operationsFile => {
            try {
                fs.writeFileSync(path.join(curOperationsDir, operationsFile), JSON.stringify(this._operationsConf[operationsFile]));
            } catch(error) {
                throw "Can't write " + operationsFile + " in " + curOperationsDir + " : " + error;
            }
        });

        let curParametersDir = path.join(this._tmpDirConf, "parameters");
        Object.keys(this._parametersConf).forEach( parametersFile => {
            try {
                fs.writeFileSync(path.join(curParametersDir, parametersFile), JSON.stringify(this._parametersConf[parametersFile]));
            } catch(error) {
                throw "Can't write " + parametersFile + " in " + curParametersDir + " : " + error;
            }
        });

        Object.keys(this._resourceConf).forEach( resourceDir => {
            Object.keys(this._resourceConf[resourceDir]).forEach( resourceFile => {
                try {
                    fs.writeFileSync(path.join(resourceDir, resourceFile), JSON.stringify(this._resourceConf[resourceDir][resourceFile]));
                } catch(error) {
                    throw "Can't write " + resourceFile + " in " + resourceDir + " : " + error;
                }
            });
        });

        // -- On prépare les arguments de la ligne de commande 
        let options = new Array();

        // Fichier main de Road2
        options.push(this._road2);

        // Pour le moment, on utilise toujours configCheck
        options.push("--configCheck");

        // On ajoute le contenu les command line parameters
        for (let key in this._commandLineParameters) {
            let command = "--" + key;

            if (this._commandLineParameters[key] !== "") {
                command = command + "=" + this._commandLineParameters[key];
            }

            options.push(command);
        }

        // --

        // On lance l'analyse de la conf par Road2 
        return new Promise ( (resolve, reject) => {

            this._childProcess = spawn("node", options);

            this._childProcess.stdout.on("data", (data) => {
                this._stdout += data.toString();
            });
              
            this._childProcess.stderr.on("data", (data) => {
                this._stderr += data.toString();
            });

            this._childProcess.on("error", (err) => {
                reject(err);
            });
              
            this._childProcess.on("close", (code) => {
                this._code = code;
                resolve();
            });


        });
        
    }

    // Analyse du code de retour de la commande 
    verifyCommandExitCode(code) {
        
        if (code === this._code) {
            return true;
        } else {
            return this._code;
        }

    }

    // Analyse des logs 
    findInServerLog(message) {

        if (this._stdout.includes(message)) {
            return true;
        } else {
            if (this._stderr.includes(message)) {
                return true;
            } else {
                return false;
            }
        }

    }

    // Nettoyage du dossier temporaire 
    cleanTmpDirectory() {

        if (this._cleanTmpDirectories) {

            fs.rm(this._tmpDirConf, {
                "recursive": true
            }, (err) => { return err;});
            
        } else {

        }
        
    }

    // Gestion du processus enfant 
    // killChildProcess() {

    //     if (this._childProcess.exitCode === null) {
    //         // On va killer le process pour passer au test suivant 
    //         this._childProcess.kill(9);
    //     } else {
    //         // Le processus est déjà mort, donc il n'y a rien à faire
    //     }

    // }
 
}


setWorldConstructor(road2World);