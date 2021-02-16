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

        // Parametre pour la ligne de commande par défaut
        this._defaultCLParameter = "";

        // Parametres pour la ligne de commande pour le test en cours 
        this._commandLineParameters = {};

        // Contenu du server.json pour le test en cours
        this._serverConf = {};

        // Boolean pour savoir si le fichier de conf sera lisible ou pas 
        this._serverReadable = true;

        // Contenu du log4js.json pour le test en cours
        this._logConf = {};

        // Contenu du cors.json pour le test en cours
        this._corsConf = {};

        // Contenu des projections pour le test en cours
        this._projConf = {};

        // Contenu des ressources pour le test en cours
        this._resourceConf = {};

        // Dossier temporaire pour le test en cours
        this._tmpDirConf = "";

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

        // Lecture du log4js.json
        try {
            this._logConf = JSON.parse(fs.readFileSync(this._serverConf.application.logs.configuration));
        } catch(error) {
            throw "Can't parse log conf: "  + error;
        }

        // Lecture du cors.json
        try {
            this._corsConf = JSON.parse(fs.readFileSync(this._serverConf.application.network.cors.configuration));
        } catch(error) {
            throw "Can't parse cors conf: "  + error;
        }

        // Lecture des projections 
        let projDir = this._serverConf.application.projections.directory;

        try {
            projDirFiles = fs.readdirSync(projDir);
        } catch(error) {
            throw "Can't read proj dir: "  + error;
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
                throw "Can't read resources dir or files: "  + error;
            }

        }

        // 3. On modifie la configuration pour qu'elle puisse être copiée dans l'espace temporaire 
        // mais elle pourra de nouveau être modifiée dans la suite du scénario

        // Emplacement du log4js.json
        this._serverConf.application.logs.configuration = path.join(this._tmpDirConf, "log4js.json");

        // Emplacement des ressources 
        this._serverConf.application.resources.directories = newResourcesDirectories;

        // Emplacement des projections 
        let curProjDir = path.join(this._tmpDirConf, "projections");
        this._serverConf.application.projections.directory = curProjDir;
        if (!fs.existsSync(curProjDir)) {
            fs.mkdirSync(curProjDir, {recursive: true, mode: "766"});
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
        } else if (configurationType === "log") {
            modification = this._logConf;
        } else if (configurationType === "cors") {
            modification = this._corsConf;
        } else if (configurationType === "projection") {
            modification = this._projConf[configurationId];
        } else if (configurationType === "resource") {

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
            fs.writeFileSync(path.join(this._tmpDirConf, "log4js.json"), JSON.stringify(this._logConf));
        } catch(error) {
            throw "Can't write log4js.json : " + error;
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

            const command = spawn("node", options);

            command.stdout.on("data", (data) => {
                this._stdout += data.toString();
            });
              
            command.stderr.on("data", (data) => {
                this._stderr += data.toString();
            });

            command.on("error", (err) => {
                reject(err);
            });
              
            command.on("close", (code) => {
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
            return false;
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
 
}


setWorldConstructor(road2World);