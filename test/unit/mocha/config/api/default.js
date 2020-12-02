'use strict';

const express = require('express');

var router = express.Router();


// Accueil de l'API
router.all("/", function(req, res) {
  res.send("Router default 0.0.1");
});

module.exports = router;
