'use strict';


const express = require('express');
const log4js = require('log4js');

var LOGGER = log4js.getLogger("SIMPLE");
var router = express.Router();


// Accueil de l'API
router.all("/", function(req, res) {
  res.send("Road2 via l'API simple 1.0.0");
});

module.exports = router;
