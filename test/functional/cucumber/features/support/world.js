const { setWorldConstructor } = require("cucumber");
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

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

        // Port 
        this._port = 8080;

        // Chemin du service 
        this._path = "";

        // Protocole de la requête 
        this._protocol = "";

        // Méthode de la requête 
        this._method = "";

        // Paramètres par défaut disponibles 
        this._defaultParameters = new Array();

        // Body contenant l'ensemble des paramètres
        // Au moment de la requête, ce body sera envoyé si c'est du POST et traduit dans l'url si c'est du GET
        this._body = {};

        // Réponse
        this._response = {};

        // status de la réponse 
        this._status;

        // header de la réponse
        this._header = {}; 

        //chaine aditionnelle pour l'url
        this._adendumUrl = "";

    }

    loadConfiguration() {

        let configurationPath = path.resolve(__dirname, "../../configurations/local.json");

        let configuration = JSON.parse(fs.readFileSync(configurationPath));

        this._url = configuration.url;

        this._port = configuration.port;

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

                this._body = this._defaultParameters[i].parameters;
                
                return true;

            } else {
                // on continue
            }
        }
        
        return false;

    }

    unsetQueryParameters(parametersToDelete) {

        for(let i = 0; i < parametersToDelete.length; i++) {
            if (this._body[parametersToDelete[i].key]) {
                this._body[parametersToDelete[i].key] = "";
            } else {
                // le parametre n'existe pas
            }
        }

    }

    setQueryParameters(parametersToAdd) {

        for(let i = 0; i < parametersToAdd.length; i++) {
            this._body[parametersToAdd[i].key] = parametersToAdd[i].value;
        }

    }

    setTableParameters(key, valuesToAdd) {
        
        let arrayParameters = new Array();
        for(let i = 0; i < valuesToAdd.length; i++) {
            arrayParameters.push(valuesToAdd[i].value);
        }
        this._body[key] = arrayParameters;
        
    }

    setTableOfObjectParameters(key, valuesToAdd) {
        
        let arrayParameters = new Array();
        for(let i = 0; i < valuesToAdd.length; i++) {
            arrayParameters.push(JSON.parse(valuesToAdd[i].value));
        }
        this._body[key] = arrayParameters;
        
    }

    setStringToUrl(key) {

        this._adendumUrl = this._adendumUrl + key;

    }

    sendRequest() {

        let finalOptions = {};

        if (this._method === "GET") {

            // Traduction du body dans l'url 
            let currentProtocol = this._protocol.toLowerCase();
            let finalUrl = currentProtocol + "://" + this._url;

            if (currentProtocol === "https") {
                finalUrl += this._path + "?";
            } else if (currentProtocol === "http") {
                finalUrl += ":" + this._port + this._path + "?";
            } else {
                throw "Protocol unknown: " + currentProtocol;
            }

            for(let param in this._body) {
                finalUrl +=  "&" + param + "=" + this._body[param].toString();
            }
            finalUrl += this._adendumUrl;

            if (currentProtocol === "https") {

                let options = {
                    rejectUnauthorized: false
                }

                // Retour d'une promesse pour gérer l'asynchronisme du http.get
                return new Promise ( (resolve, reject) => {

                    https.get(finalUrl, options, (response) => {

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

            } else if (currentProtocol === "http") {
                
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

            } else {
                throw "Protocol unknown: " + currentProtocol;
            }

        } else if (this._method === "POST") {

            let currentProtocol = this._protocol.toLowerCase();

            finalOptions = {
                protocol: currentProtocol + ":",
                host: this._url + this._adendumUrl,
                path: this._path,
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                rejectUnauthorized: false
            };

            if (currentProtocol === "https") {

                // Retour d'une promesse pour gérer l'asynchronisme du http.get
                return new Promise ( (resolve, reject) => {

                    let request = https.request(finalOptions, (response) => {

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

                    // Envoie de la requête
                    request.write(JSON.stringify(this._body));
                    request.end();
                    

                });

            } else if (currentProtocol === "http") {

                finalOptions.port = this._port;

                // Retour d'une promesse pour gérer l'asynchronisme du http.get
                return new Promise ( (resolve, reject) => {

                    let request = http.request(finalOptions, (response) => {

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

                    // Envoie de la requête
                    request.write(JSON.stringify(this._body));
                    request.end();
                    

                });

            } else {
                throw "Protocol unknown: " + currentProtocol;
            }
            
        } else {
            
        }

        

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

    checkResponseAttributString(key) {

        if (this.checkHeaderContent("content-type","application/json")) {
            try {

                let responseJSON = JSON.parse(this._response);

                let jsonValue = this.getJsonContentByKey(responseJSON, key);
                
                if (typeof jsonValue === "string") {
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