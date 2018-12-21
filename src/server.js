'use strict';

const express = require('express');
// const OSRM = require("osrm");
const log4js = require('log4js');
const nconf = require('nconf');
const path = require('path');
const fs = require('fs');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
// const osrm = new OSRM("/home/docker/data/corse-latest.osrm");

// App
const app = express();

//Configuration
// on lit en priorité les arguments de la ligne de commande puis les variables d'environnement
nconf.argv().env('ROAD2_CONF_FILE');
if (nconf.get('ROAD2_CONF_FILE')) {
  nconf.file({ file: path.resolve(__dirname,nconf.get('ROAD2_CONF_FILE')) });
} else {
  nconf.file({ file: path.resolve(__dirname,'./config/road2.json') });
}

//Lecture du fichier de configuration des logs
var logsConf = JSON.parse(fs.readFileSync(path.resolve(__dirname,nconf.get("application:logs:configuration"))));

// Configuration du logger
log4js.configure(logsConf.mainConf);

//Instanciation du logger
var logger = log4js.getLogger('SERVER');

// Pour le log des requêtes reçues sur le service avec la syntaxe
app.use(log4js.connectLogger(log4js.getLogger('request'), {
  level: logsConf.httpConf.level,
  format: (req, res, format) => format(logsConf.httpConf.format)
}));

app.get('/', (req, res) => {
  res.send('Hello world !! \n');
  // osrm.route({coordinates: [[ 9.479455,42.546907], [9.435853,42.619204]]}, function(err, result) {
  //   if(err) {
  //     throw err;
  //   }
  //   console.log(result.waypoints); // array of Waypoint objects representing all waypoints in order
  //   console.log(result.routes); // array of Route objects ordered by descending recommendation rank
  // });
});

app.listen(PORT, HOST);
logger.info(`Running on http://${HOST}:${PORT}`);
