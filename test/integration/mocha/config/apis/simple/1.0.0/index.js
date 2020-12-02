'use strict';

const express = require('express');
const log4js = require('log4js');

var LOGGER = log4js.getLogger("SIMPLE");
var router = express.Router();


// Accueil de l'API
router.all("/", function(req, res) {
  res.send("success");
});

module.exports = router;
