'use strict';

const express = require('express');
// const OSRM = require("osrm");
const log4js = require('log4js');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
// const osrm = new OSRM("/home/docker/data/corse-latest.osrm");

// App
const app = express();

// Configuration du logger
log4js.configure({
 appenders: {
   console: { type: 'console', layout: {type: 'pattern', pattern: '%[[%d] [%p] %c %z -%] %m'} },
   file: { type: 'file', filename: 'road2.log', layout: {type: 'pattern', pattern: '[%d] [%p] %c %z - %m%n'} },
   http: { type: 'file', filename: 'access.log'}
 },
 categories: {
   default: { appenders: ['console','file'], level: 'info' },
   request: { appenders: ['http'], level: 'info' }
 },
 //pour que les logs apparaissent dans tous les cas
 disableClustering: true
});

var logger = log4js.getLogger('SERVER');

// Pour le log des requêtes reçues sur le service avec la syntaxe
app.use(log4js.connectLogger(log4js.getLogger('request'), {
  level: 'info',
  // include the Express request ID in the logs
  format: (req, res, format) => format(`:remote-addr - ${req.id} - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`)
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
