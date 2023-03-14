const { setWorldConstructor } = require("cucumber");
const path = require('path');
const fs = require('fs');
const turf = require('@turf/turf');
const axios = require('axios');
const tunnel = require('tunnel');
const https = require('https');
const polyline = require('@mapbox/polyline');


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

        // On stocke la configuration complète pour certains tests 
        this._configuration = {};

        // Url du service par défaut
        this._url  = "";

        // Port par défaut
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

        this._configuration = configuration;

        this._url = configuration.url;

        this._port = configuration.port;

        this._protocol = configuration.protocol;

        this._apisUrl = configuration.apisUrl;

        this._defaultParameters = configuration.defaultParameters; 

    }

    createRequest(method, path) {

        // on réinitialise certains paramètres qui peuvent changer mais qui ont de valeurs par défaut dans la conf 
        this._url = this._configuration.url;
        this._port = this._configuration.port;
        this._protocol = this._configuration.protocol;

        this._method = method;
        this._path = path;

    }

    changeUrl(url) {

        this._url = url;

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

    setPathParameters(parametersToAdd) {

        for(let i = 0; i < parametersToAdd.length; i++) {
            if (this._path.includes(`<${parametersToAdd[i].key}>`)) {
                this._path = this._path.replace(`<${parametersToAdd[i].key}>`, parametersToAdd[i].value)
            }
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

    getConfigurationValueof(key) {

        let response = this.getJsonContentByKey(this._configuration, key);
        if (response.status === "found") {
            return response.content;
        } else {
            return false;
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

                let result = this.getJsonContentByKey(responseJSON, key);
                if (result.status === "found") {
                    if (result.content.includes(value)) {
                        return true;
                    } else {
                        return false;
                    }
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

                let result = this.getJsonContentByKey(responseJSON, key);
                if (result.status === "found") {
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

                let result = this.getJsonContentByKey(responseJSON, key);
                if (result.status = "found") {
                    if (typeof result.content === "string") {
                        return true;
                    } else {
                        return false;
                    }
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

        let returnObject = {
            status: "not found",
            content: {}
        };

        let keysTable = new Array();

        keysTable = key.split('.');

        let tmpJson = jsonContent;

        for (let i = 0; i < keysTable.length; i++) {
            let response = this.getJsonContentByKeyLO(tmpJson, keysTable[i]);
            // Gérer le cas vide
            if (response.status === "not found") {
                returnObject.status = "not found";
                returnObject.content = {};
                return returnObject;
            } else {
                returnObject.status = "found";
                returnObject.content = response.content;
                tmpJson = response.content;
            }
        }

        return returnObject;

    }

    getJsonContentByKeyLO(jsonContent, key) {

        let returnObject = {
            status: "not found",
            content: {}
        };

        // Gérer les tableaux 
        if (Array.isArray(jsonContent)) {

            let indiceTable = key.match(/[\d+]/g);
            
            if (indiceTable.length === 1) {

                let indiceNum = parseInt(indiceTable[0]);
                if (jsonContent.length > indiceNum) {
                    returnObject.status = "found";
                    returnObject.content = jsonContent[indiceNum];
                    return returnObject;
                } else {
                    return returnObject;
                }

            } else {
                return returnObject;
            }

        } else {

            for (let tmpKey in jsonContent) {
                if (tmpKey === key) {
                    returnObject.status = "found";
                    returnObject.content = jsonContent[tmpKey];
                    return returnObject;
                }
            }

        }

        return returnObject;

    }

    checkCompleteRoad() {

        if (!this.checkResponseAttribut("resource")) {
            return 1;
        }
        if (!this.checkResponseAttribut("profile")) {
            return 2;
        }
        if (!this.checkResponseAttribut("optimization")) {
            return 3;
        }
        if (!this.checkResponseAttribut("distanceUnit")) {
            return 4;
        }
        if (!this.checkResponseAttribut("timeUnit")) {
            return 5;
        }
        if (!this.checkResponseAttribut("crs")) {
            return 6;
        }
        if (!this.checkResponseAttribut("geometry")) {
            return 7;
        }
        if (!this.checkResponseAttribut("bbox")) {
            return 8;
        }
        if (!this.checkResponseAttribut("distance")) {
            return 9;
        }
        if (!this.checkResponseAttribut("duration")) {
            return 10;
        }
        if (!this.checkResponseAttribut("portions.[0]")) {
            return 11;
        }
        if (!this.checkResponseAttribut("portions.[0].start")) {
            return 12;
        }
        if (!this.checkResponseAttribut("portions.[0].end")) {
            return 13;
        }
        if (!this.checkResponseAttribut("portions.[0].distance")) {
            return 14;
        }
        if (!this.checkResponseAttribut("portions.[0].duration")) {
            return 15;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0]")) {
            return 16;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0].geometry")) {
            return 17;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0].attributes")) {
            return 18;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0].distance")) {
            return 19;
        }
        if (!this.checkResponseAttribut("portions.[0].steps.[0].duration")) {
            return 20;
        }

        return true; 

    }

    checkCompleteIso() {

        if (!this.checkResponseAttribut("point")) {
            return 1;
        }
        if (!this.checkResponseAttribut("resource")) {
            return 2;
        }
        if (!this.checkResponseAttribut("resourceVersion")) {
            return 3;
        }
        if (!this.checkResponseAttribut("profile")) {
            return 4;
        }
        if (!this.checkResponseAttribut("costType")) {
            return 5;
        }
        if (!this.checkResponseAttribut("costValue")) {
            return 6;
        }
        if (!this.checkResponseAttribut("crs")) {
            return 7;
        }
        if (!this.checkResponseAttribut("geometry")) {
            return 8;
        }
        if (!this.checkResponseAttribut("direction")) {
            return 9;
        }
        
        return true; 

    }

    checkCompleteNearest() {

        if (!this.checkResponseAttribut("resource")) {
            return "no resource";
        }
        if (!this.checkResponseAttribut("resourceVersion")) {
            return "no resourceVersion";
        }
        if (!this.checkResponseAttribut("coordinates")) {
            return "no coordinates";
        }
        if (!this.checkResponseAttribut("points")) {
            return "no points";
        }
        if (!this.checkResponseAttribut("points.[0].id")) {
            return "no points.[0].id";
        }
        if (!this.checkResponseAttribut("points.[0].geometry")) {
            return "no points.[0].geometry";
        }
        if (!this.checkResponseAttribut("points.[0].distance")) {
            return "no points.[0].distance";
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
        let tablePoint = new Array();
        let curPoint = {};
                
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

        tablePoint = referenceRoad.start.split(",");
        curPoint = turf.point([Number(tablePoint[0]), Number(tablePoint[1])]);
        let bufferStart = turf.buffer(curPoint, 0.01, {units: "kilometers"});

        tablePoint = responseJSON.start.split(",");
        curPoint = turf.point([Number(tablePoint[0]), Number(tablePoint[1])]);
        
        if (!turf.booleanWithin(curPoint, bufferStart)) {
            return "Start is out of the buffer";
        }

        tablePoint = referenceRoad.end.split(",");
        curPoint = turf.point([Number(tablePoint[0]), Number(tablePoint[1])]);
        let bufferEnd = turf.buffer(curPoint, 0.01, {units: "kilometers"});

        tablePoint = responseJSON.end.split(",");
        curPoint = turf.point([Number(tablePoint[0]), Number(tablePoint[1])]);

        if (!turf.booleanWithin(curPoint, bufferEnd)) {
            return "End is out of the buffer";
        }

        let bufferGeometry = turf.buffer(referenceRoad.geometry, 0.1, {units: "kilometers"});

        if (!turf.booleanWithin(responseJSON.geometry, bufferGeometry)) {
            return "Gemetry is out of the buffer";
        }

        return true;
        
    }

    checkIsoContent(filePath) {

        let referenceResponse = {};
        let responseJSON = {};

                
        if (typeof this._response === "string") {
            responseJSON = JSON.parse(this._response);
        } else {
            responseJSON = this._response;
        }

        try {
            referenceResponse = JSON.parse(fs.readFileSync(path.resolve(__dirname,filePath)));
        } catch (error) {
            return "Can't parse JSON file";
        }

        let refIso = referenceResponse.geometry;
        let curIso = this._response.geometry;

        if (typeof(refIso) === "string") {

            if (refIso === curIso) {
                return true;
            }

            // On part du principe que c'est du polyline
            refIso = turf.polygon(polyline.decode(refIso));
            curIso = turf.polygon(polyline.decode(curIso));

        } else {

            // On part du principe que c'est du GeoJSON
            // TODO : ajouter la gestion du polyline
            if (curIso.coordinates) {

                refIso = turf.polygon(refIso.coordinates);
                try {
                    curIso = turf.polygon(curIso.coordinates);
                } catch(error) {
                    return "Can't convert curIso into polygon with turfJS";
                }

            } else {
                return "curIso doesn't have coordinates";
            }
            
        }

        let buffer = turf.buffer(refIso, 0.1, {units: 'kilometers'});

        if (!turf.booleanWithin(curIso, buffer)) {
            return "Iso is out of the buffer";
        } else {
            return true;
        }

    }

}


setWorldConstructor(road2World);