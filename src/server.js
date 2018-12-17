'use strict';

const express = require('express');
const OSRM = require("osrm");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const osrm = new OSRM("/home/docker/data/corse-latest.osrm");

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world !! \n');
  osrm.route({coordinates: [[ 9.479455,42.546907], [9.435853,42.619204]]}, function(err, result) {
    if(err) {
      throw err;
    }
    console.log(result.waypoints); // array of Waypoint objects representing all waypoints in order
    console.log(result.routes); // array of Route objects ordered by descending recommendation rank
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
