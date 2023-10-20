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

    // Configuration pour se connecter à la base 
    this._configuration = configuration;

    // Pool de clients PostgreSQL
    this._pool = null;

    // État de la connexion
    this._connected = false;

  }

  /**
  *
  * @function
  * @name get configuration
  * @description Récupérer la configuration de la base
  *
  */
  get configuration () {
    return this._configuration;
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

    // On crée le Pool ici car c'est à cet appel qu'il se connecte à la base
    if (Pool) {

      this._pool = new Pool(this._configuration);
      this._connected = true;

      // On ajoute la gestion des events ici 
      // From the PG module doc : 
      // the pool will emit an error on behalf of any idle clients
      // it contains if a backend error or network partition happens
      // The client will be automatically terminated and removed from the pool, it is only passed to the error handler in case you want to inspect it.
      this._pool.on('error', (err, client) => {
        LOGGER.error('Unexpected error on idle client', err);
      });

    } else {
      throw errorManager.createError("PG is not available");
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
