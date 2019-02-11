'use strict';

var path = require('path');
var fs = require('fs');
var log4js = require('log4js');
var nconf = require('nconf');
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

      var userFile = "./config/log4js.json";
      if (file) {
        userFile = file;
      }

      var fileName = path.resolve(__dirname, userFile);

      var logsConf = JSON.parse(fs.readFileSync(fileName));

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

    var userFile = "./config/log4js.json";
    if (file) {
      userFile = file;
    }

    var fileName = path.resolve(__dirname, userFile);

    var logsConf = JSON.parse(fs.readFileSync(fileName));

    return logsConf.httpConf;

  }

}
