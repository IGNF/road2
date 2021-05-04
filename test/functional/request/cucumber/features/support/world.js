const { setWorldConstructor } = require("cucumber");
const path = require('path');
const fs = require('fs');
const turf = require('@turf/turf');
const axios = require('axios');
const tunnel = require('tunnel');
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
        this._port = 80;

        // Objet contenant la liste des url par api
        this._apisUrl= {};

        // Chemin de la requête
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

    loadConfiguration(configurationPath) {

        let absolutePath = path.resolve(__dirname, configurationPath);

        let configuration = JSON.parse(fs.readFileSync(absolutePath));

        this._url = configuration.url;

        this._port = configuration.port;

        this._protocol = configuration.protocol;

        this._apisUrl = configuration.apisUrl;

        this._defaultParameters = configuration.defaultParameters; 

    }

    createRequest(method, path) {

        this._method = method;
        this._path = path;

    }

    createRequestOnApi(method, operationId, apiId, version) {

        this._method = method;

        if (this._apisUrl[apiId]) {

            if (this._apisUrl[apiId][version]) {

                if (this._apisUrl[apiId][version][operationId]) {
                    this._path = this._apisUrl[apiId][version][operationId];
                } else {
                    return "operationId inconnu";
                }

            } else {
                return "version inconnue";
            }

        } else {
            return "apiId inconnu";
        }

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

        // Objet qui contient la requête
        let finalRequest = {};

        // Gestion du protocol 
        let currentProtocol = this._protocol.toLowerCase();

        // Gestion du port 
        let currentPort = this._port;

        // Gestion de l'url  
        let finalUrl = currentProtocol + "://" + this._url + ":" + currentPort + this._path + "?";
        finalRequest.url = finalUrl;

        // Gestion de la méthode 
        finalRequest.method = this._method.toLocaleLowerCase();

        // Gestion des paramètres de la requête 
        if (finalRequest.method === "get") {
            for(let param in this._body) {
                finalRequest.url +=  "&" + param + "=" + this._body[param].toString();
            }
            finalRequest.url += this._adendumUrl;
        } else if (finalRequest.method === "post") {
            finalRequest.data = this._body;
            finalRequest.url += this._adendumUrl;
            finalRequest.headers = {
                'Content-Type': 'application/json'
            }
        } else {

        }

        // Gestion du proxy 
        if (process.env.HTTP_PROXY === "") {

            finalRequest.proxy = false;

            if (currentProtocol === "https") {
                finalRequest.httpsAgent = new https.Agent({
                    rejectUnauthorized: false
                });
            } else {
                // rien à ajouter 
            }

        } else {
            // on a un proxy http 

            // on le décompose 
            let proxy = process.env.HTTP_PROXY.split(":");
            let proxyHost = proxy[1].replace(/\//g,"");
            let proxyPort = proxy[2];

            if (currentProtocol === "https") {
                // on spécifie le proxy via tunnel et pas axios 
                finalRequest.proxy = false;

                let tunnelApp = tunnel.httpsOverHttp({
                    proxy: {
                        host: proxyHost,
                        port: proxyPort
                    },
                });

                finalRequest.httpsAgent = tunnelApp;

            } else {
                // rien à ajouter car axios le prend déjà en compte 
            }

        }

        return axios(finalRequest);

    }

    saveResponse(response) {

        this._status = response.status;
        this._header = response.headers;
        this._response = response.data;

    }

    verifyResponseStatus(status) {
        if (this._status !== status) {
            return "Wrong status: " + this._status;
        } else {
            return true;
        }
    }

    verifyRawResponseContent(message) {
        if (JSON.stringify(this._response).includes(message)) {
            return true;
        } else {
            return "Message is not in response: " + this._response;
        }
    }

    checkHeaderContent(key, value) {

        if (!this._header[key]) {
            return "Key is not in header";
        } else {
            if (!this._header[key].includes(value)) {
                return "Key doesn't contain the good value";
            } else {
                return true;
            }
        }

    }

    checkResponseContent(key, value) {

        if (this.checkHeaderContent("content-type","application/json")) {
            try {

                let responseJSON = {};
                
                if (typeof this._response === "string") {
                    responseJSON = JSON.parse(this._response);
                } else {
                    responseJSON = this._response;
                }

                let jsonValue = this.getJsonContentByKey(responseJSON, key);

                if (jsonValue.includes(value)) {
                    return true;
                } else {
                    return false;
                }

            } catch(error) {
                console.log(error);
                return false;
            }
            
        }
        
        return false;

    }

    checkResponseAttribut(key) {

        if (this.checkHeaderContent("content-type","application/json")) {
            try {

                let responseJSON = {};
                
                if (typeof this._response === "string") {
                    responseJSON = JSON.parse(this._response);
                } else {
                    responseJSON = this._response;
                }

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

                let responseJSON = {};
                
                if (typeof this._response === "string") {
                    responseJSON = JSON.parse(this._response);
                } else {
                    responseJSON = this._response;
                }

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

    checkCompleteRoad() {

        if (!this.checkResponseAttribut("resource")) {
            return false;
        }
        if (!this.checkResponseAttribut("profile")) {
            return false;
        }
        if (!this.checkResponseAttribut("optimization")) {
            return false;
        }
        if (!this.checkResponseAttribut("distanceUnit")) {
            return false;
        }
        if (!this.checkResponseAttribut("timeUnit")) {
            return false;
        }
        if (!this.checkResponseAttribut("crs")) {
            return false;
        }
        if (!this.checkResponseAttribut("geometry")) {
            return false;
        }
        if (!this.checkResponseAttribut("bbox")) {
            return false;
        }
        if (!this.checkResponseAttribut("distance")) {
            return false;
        }
        if (!this.checkResponseAttribut("duration")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0]")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0].start")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0].end")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0].distance")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0].duration")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0]")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0].geometry")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0].attributes")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0].distance")) {
            return false;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0].duration")) {
            return false;
        }

        return true; 

    }

    checkCompleteIso() {

        if (!this.checkResponseAttribut("point")) {
            return false;
        }
        if (!this.checkResponseAttribut("resource")) {
            return false;
        }
        if (!this.checkResponseAttribut("resourceVersion")) {
            return false;
        }
        if (!this.checkResponseAttribut("profile")) {
            return false;
        }
        if (!this.checkResponseAttribut("costType")) {
            return false;
        }
        if (!this.checkResponseAttribut("costValue")) {
            return false;
        }
        if (!this.checkResponseAttribut("crs")) {
            return false;
        }
        if (!this.checkResponseAttribut("geometry")) {
            return false;
        }
        if (!this.checkResponseAttribut("direction")) {
            return false;
        }
        
        return true; 

    }

    checkRoadContent(filePath) {

        let referenceRoad = {};
        let refDistanceMin = 0;
        let refDistanceMax = 0;
        let refDurationMin = 0;
        let refDurationMax = 0;
        let responseJSON = {};
                
        if (typeof this._response === "string") {
            responseJSON = JSON.parse(this._response);
        } else {
            responseJSON = this._response;
        }

        try {
            referenceRoad = JSON.parse(fs.readFileSync(path.resolve(__dirname,filePath)));
        } catch (error) {
            return "Can't parse JSON file";
        }

        if (referenceRoad.distance > 100 ) {
            refDistanceMin = referenceRoad.distance - 100;
        }
        refDistanceMax = referenceRoad.distance + 100;

        if (referenceRoad.duration > 2 ) {
            refDurationMin = referenceRoad.duration - 2;
        }
        refDurationMax = referenceRoad.duration + 2;


        if (responseJSON.distance < refDistanceMin || responseJSON.distance > refDistanceMax) {
            return "Distance is out of boundaries";
        }

        if (responseJSON.distance < refDistanceMin || responseJSON.distance > refDistanceMax) {
            return "Duration is out of boundaries";
        }

        let bufferStart = turf.buffer(turf.point(referenceRoad.start.split(",")), 0.01, {units: "kilometers"});

        if (!turf.booleanWithin(turf.point(responseJSON.start.split(",")), bufferStart)) {
            return "Start is out of the buffer";
        }

        let bufferEnd = turf.buffer(turf.point(referenceRoad.end.split(",")), 0.01, {units: "kilometers"});

        if (!turf.booleanWithin(turf.point(responseJSON.end.split(",")), bufferEnd)) {
            return "End is out of the buffer";
        }

        let bufferGeometry = turf.buffer(referenceRoad.geometry, 0.1, {units: "kilometers"});

        if (!turf.booleanWithin(responseJSON.geometry, bufferGeometry)) {
            return "Gemetry is out of the buffer";
        }

        return true;
        
    }



}


setWorldConstructor(road2World);