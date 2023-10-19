'use strict';

const log4js = require('log4js');
const errorManager = require('../utils/errorManager');

try {
  var { Pool } = require('pg');
} catch(error) {
  Pool = null;
}

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
    if (Pool) {
      this._pool = new Pool(configuration);
    } else {
      this._pool = null;
    }

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

      if (this._pool) {
        await this._pool.connect();
        LOGGER.info("Pool connecté à la base");
        this._connected = true;
      } else {
        throw errorManager.createError("PG is not available");
      }

      // TODO : supprimer le return si pas utile
      // return new Promise();

    } catch (err) {
      LOGGER.error("connection error", err.stack)
      throw errorManager.createError("Cannot connect to database");
    }


  }

  /**
  *
  * @function
  * @name disconnect
  * @description Déconnexion à la base pgRouting
  *
  */
  async disconnect() {

    try {

      LOGGER.info("Déconnexion de la base...");

      if (this._pool) {

        await this._pool.end(() => {
          LOGGER.info("Déconnexion du pool effectuee");
        });

        this._connected = false;

      } else {
        throw errorManager.createError("PG is not available");
      }
      
    } catch(err) {
      throw errorManager.createError("Cannot disconnect to database");
    }

  }


}
