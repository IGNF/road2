const { setWorldConstructor } = require("cucumber");
const path = require('path');
const fs = require('fs');
const http = require('http');

/**
*
* @class
* @name road2World
* @description Classe utile pour Cucumber afin de réaliser les tests fonctionnels des APIs de Road2
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

        // Url du service 
        this._url  = "";

        // Chemin du service 
        this._path = "";

        // Protocole de la requête 
        this._protocol = "";

        // Méthode de la requête 
        this._method = "";

        // Paramètres par défaut disponibles 
        this._defaultParameters = new Array();

        // Paramètres utilisés
        this._parameters = {};

        // Réponse
        this._response = {};

        // status de la réponse 
        this._status;

        // header de la réponse
        this._header = {}; 

    }

    loadConfiguration() {

        let configurationPath = path.resolve(__dirname, "../../configurations/local.json");

        let configuration = JSON.parse(fs.readFileSync(configurationPath));

        this._url = configuration.url;

        this._defaultParameters = configuration.defaultParameters; 

    }

    createRequest(protocol, method, path) {

        this._protocol = protocol;
        this._method = method;
        this._path = path;

    }

    useDefaultQueryParameters(operation) {

        if (this._defaultParameters.length === 0) {
            return false;
        }

        for(let i = 0; i < this._defaultParameters.length; i++) {

            if (this._defaultParameters[i].id === operation) {

                for(let param in this._defaultParameters[i].parameters) {
                    this._parameters[param] = this._defaultParameters[i].parameters[param];
                }

                return true;

            } else {
                // on continue
            }
        }
        
        return false;

    }

    unsetQueryParameters(parametersToDelete) {

        for(let i = 0; i < parametersToDelete.length; i++) {
            if (this._parameters[parametersToDelete[i].key]) {
                this._parameters[parametersToDelete[i].key] = "";
            } else {
                // le parametre n'existe pas
            }
        }

    }

    setQueryParameters(parametersToAdd) {

        for(let i = 0; i < parametersToAdd.length; i++) {
            this._parameters[parametersToAdd[i].key] = parametersToAdd[i].value;
        }

    }

    sendRequest() {

        // Url finale 
        let finalUrl = this._protocol + "://" + this._url + this._path + "?";

        for(let param in this._parameters) {
            finalUrl = finalUrl + "&" + param + "=" + this._parameters[param];
        }

        // Retour d'une promesse pour gérer l'asynchronisme du http.get
        return new Promise ( (resolve, reject) => {

            http.get(finalUrl, (response) => {

                this._status = response.statusCode;
                this._header = response.headers;

                // il faut passer par cet objet intermédiaire
                let rawResponse = "";

                // Stockage progressif 
                response.on('data', (data) => {
                    rawResponse += data;
                });

                // Stockage final
                response.on('end', () => {
                    this._response = rawResponse;
                    resolve();
                });

            // Si erreur lors de la requête 
            }).on('error', (err) => {
                reject(err);
            });

        });

    }

    verifyResponseStatus(status) {
        if (this._status !== status) {
            return false;
        } else {
            return true;
        }
    }

    verifyRawResponseContent(message) {
        if (this._response.includes(message)) {
            return true;
        } else {
            return false;
        }
    }

    checkHeaderContent(key, value) {

        if (!this._header[key]) {
            return false;
        } else {
            if (!this._header[key].includes(value)) {
                return false;
            } else {
                return true;
            }
        }

    }

    checkResponseContent(key, value) {

        if (this.checkHeaderContent("content-type","application/json")) {
            try {

                let responseJSON = JSON.parse(this._response);

                let jsonValue = this.getJsonContentByKey(responseJSON, key);

                if (jsonValue.includes(value)) {
                    return true;
                } else {
                    return false;
                }

            } catch(error) {
                return false;
            }
            
        }
        
        return false;

    }

    checkResponseAttribut(key) {

        if (this.checkHeaderContent("content-type","application/json")) {
            try {

                let responseJSON = JSON.parse(this._response);

                let jsonValue = this.getJsonContentByKey(responseJSON, key);
                
                if (jsonValue) {
                    return true;
                } else {
                    return false;
                }

            } catch(error) {
                return false;
            }
            
        }
        
        return false;

    }

    getJsonContentByKey(jsonContent, key) {

        let keysTable = new Array();

        keysTable = key.split('.');

        let tmpJson = jsonContent;

        for (let i = 0; i < keysTable.length; i++) {
            tmpJson = this.getJsonContentByKeyLO(tmpJson, keysTable[i]);
            // Gérer le cas vide
            if (tmpJson === false) {
                return false;
            }
        }
        // à enlever
        return tmpJson;

    }

    getJsonContentByKeyLO(jsonContent, key) {

        // Gérer les tableaux 
        if (Array.isArray(jsonContent)) {

            let indiceTable = key.match(/[\d+]/g);
            
            if (indiceTable.length === 1) {

                let indiceNum = parseInt(indiceTable[0]);
                if (jsonContent.length > indiceNum) {
                    return jsonContent[indiceNum];
                } else {
                    return false;
                }

            } else {
                return false;
            }

        } else {

            for (let tmpKey in jsonContent) {
                if (tmpKey === key) {
                    return jsonContent[tmpKey];
                }
            }

        }

        return false;

    }



}


setWorldConstructor(road2World);