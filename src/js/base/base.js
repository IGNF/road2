'use strict';

const log4js = require('log4js');
const errorManager = require('../utils/errorManager');
const { Pool } = require('pg');

// Création du LOGGER
const LOGGER = log4js.getLogger("BASE");

/**
*
* @class
* @name base
* @description Classe modélisant la connexion à une base de données PostgreSQL.
*
*/
module.exports = class Base {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe Base
  * @param{json} configuration - Configuration nécessaire pour un Pool pg (voir le module 'pg')
  *
  */
  constructor(configuration) {

    // Pool de clients PostgreSQL
    this._pool = new Pool(configuration);

    // État de la connexion
    this._connected = false;

  }

  /**
  *
  * @function
  * @name get pool
  * @description Récupérer le pool de la base
  *
  */
  get pool () {
    return this._pool;
  }

  /**
  *
  * @function
  * @name getConnected
  * @description Récupérer l'état de connexion de la source
  *
  */
  get connected() {
    return this._connected;
  }

  /**
  *
  * @function
  * @name connect
  * @description Connection à la base PostgreSQL
  *
  */
  async connect() {

    // Connection à la base de données
    LOGGER.info("Connection a la base de données");
    try {

      await this._pool.connect();
      LOGGER.info("Connecte a la base de données");
      this._connected = true;

    } catch (err) {
      LOGGER.error("connection error", err.stack)
      throw errorManager.createError("Cannot connect to database");
    }

  }

  /**
  *
  * @function
  * @name disconnect
  * @description Déconnection à la base pgRouting
  *
  */
  async disconnect() {

    try {
      LOGGER.info("Deconnection de la base...");
      await this._pool.end(() => {
        LOGGER.info("Deconnection du pool effectuee");
      });
      this._connected = false;
    } catch(err) {
      throw errorManager.createError("Cannot disconnect to database");
    }

  }


}
