'use strict';

var path = require('path');
var fs = require('fs');
var log4js = require('log4js');
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

      var userFile = "log4js.json";
      if (file) {
        userFile = file;
      }

      var fileName = path.resolve(__dirname, userFile);

      var logsConf = JSON.parse(fs.readFileSync(fileName));

      log4js.configure(logsConf);
      LOGGER = log4js.getLogger();
      
    } else {

    }

  }

}
