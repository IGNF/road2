'use strict';

const path = require('path');
const fs = require('fs');
const log4js = require('log4js');
const nconf = require('nconf');
var LOGGER;

module.exports = {

  /**
  *
  * @function
  * @name manageLogs
  * @description Gestion des logs pour les tests
  * @param {string} file - Fichier de configuration des logs
  *
  */

  manageLogs: function(file) {

    if (process.env.DEBUG) {

      let userFile = "./config/log4js.json";
      if (file) {
        userFile = file;
      }

      let fileName = path.resolve(__dirname, userFile);

      let logsConf = JSON.parse(fs.readFileSync(fileName));

      log4js.configure(logsConf.mainConf);
      LOGGER = log4js.getLogger();

    } else {

    }

  },

  /**
  *
  * @function
  * @name getHttpConf
  * @description Gestion des logs http pour les tests
  * @param {string} file - Fichier de configuration des logs
  *
  */

  getHttpConf: function(file) {

    let userFile = "./config/log4js.json";
    if (file) {
      userFile = file;
    }

    let fileName = path.resolve(__dirname, userFile);

    let logsConf = JSON.parse(fs.readFileSync(fileName));

    return logsConf.httpConf;

  },

  /**
  *
  * @function
  * @name getLogsConf
  * @description Récupération de la configuration des logs
  * @param {string} file - Fichier de configuration des logs
  *
  */

  getLogsConf: function(file) {

    let userFile = "./config/log4js.json";
    if (file) {
      userFile = file;
    }

    let fileName = path.resolve(__dirname, userFile);

    let logsConf = JSON.parse(fs.readFileSync(fileName));

    return logsConf;

  }

}
