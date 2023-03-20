'use strict';

const https = require('https');
const http = require('http');
const fs = require('fs');
const errorManager = require('../utils/errorManager');
const assert = require('assert');

const log4js = require('log4js');

// Création du LOGGER
const LOGGER = log4js.getLogger("SERVER");

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
  constructor(id, app, host, port, httpsOption, options) {

    // ID
    this._id = id;

    // Express app
    this._app = app;

    // Hosts
    this._host = host;

    // Port
    this._port = port;

    // https
    this._enableHttps = httpsOption;

    // Options pour le HTTPS
    this._options = options;

    // serveur
    //TODO: enlever cette partie du constructeur, qu'il ne puisse pas y avoir d'erreurs possibles 
    if (this._enableHttps === "true") {

      let optionsContent = {};
      try {
        optionsContent.key = fs.readFileSync(this._options.key, "utf-8");
        optionsContent.cert = fs.readFileSync(this._options.cert, "utf-8");

        this._server = https.createServer(optionsContent, this._app);
      } catch (err) {
        LOGGER.fatal("Impossible de lire les certificats")
        throw errorManager.createError("Certificate not found");
      }

    } else {

      this._server = http.createServer(this._app);

    }

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
  async start() {

    // si le serveur n'existe pas, on le crée
    try {
      assert.deepStrictEqual(this._server, {});

      // serveur
      if (this._enableHttps === "true") {

        let options = {};
        options.key = fs.readFileSync(this._options.key, "utf-8");
        options.cert = fs.readFileSync(this._options.cert, "utf-8");

        this._server = https.createServer(options, this._app);

      } else {

        this._server = http.createServer(this._app);

      }

    } catch (err) {
      // tout va bien
    }

    // on lance l'écoute du serveur
    await this._server.listen(this._port, this._host);
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
  stop() {

    return new Promise((resolve, reject) => {
      this._server.close((err) => {
        if (err) {
          LOGGER.error(`Erreur lors de l'arrêt du serveur : ${err}`);
          reject();
        } else {
          LOGGER.debug(`Le serveur a été arrêté.`);
          resolve();
        }
      })
    });

  }

}
