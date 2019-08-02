'use strict';

var https = require('https');
var http = require('http');

const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("SERVER");

/**
*
* @class
* @name Server
* @description Il peut y avoir plusieurs server par instance. Un server est une instance du serveur NodeJS (retour de app.listen d'ExpressJS) et plusieurs autres informations utiles.
*
*/

module.exports = class Server {


    /**
    *
    * @function
    * @name constructor
    * @description Constructeur de la classe Server
    * @param{string} id - Id du serveur 
    * @param{object} app - Instance d'ExpressJS
    * @param{string} host - Host
    * @param{int} port - Port
    * @param{string} https - Activer le HTTPS
    * @param{object} options - Options pour le HTTPS
    *
    */
    constructor(id, app, host, port, https, options) {

        // ID
        this._id = id;

        // Express app 
        this._app = app;

        // Hosts 
        this._host = host;

        // Port 
        this._port = port;

        // serveur
        if (this._enableHttps === "true") {
            this._server = https.createServer(this._options, this._app);
        } else {
            this._server = http.createServer(this._options, this._app);
        }

        // https
        this._enableHttps = https;

        // Options pour le HTTPS
        this._options = options;

    }

    /**
     *
     * @function
     * @name get id
     * @description Récupérer l'ensemble des ressources
     *
     */
    get id () {
        return this._id;
    }


    /**
    *
    * @function
    * @name start
    * @description Démarer un serveur
    *
    */
    start() {

        // si le serveur n'existe pas, on le crée
        try {
            assert.deepStrictEqual(this._server, {});

            if (this._enableHttps === "true") {
                this._server = https.createServer(this._options, this._app);
            } else {
                this._server = http.createServer(this._options, this._app);
            }

        } catch (err) {
            // tout va bien
        }

        // on lance l'écoute du serveur 
        this._server.listen(this._port, this._host);
        LOGGER.info(this._host + ":" + this._port);

        return true;

    }

        /**
    *
    * @function
    * @name stop
    * @description Arrêter un serveur
    *
    */
    stop(callback) {

        this._server.close(callback);
        return true;

    }

}