'use strict';


const path = require('path');
const express = require('express');
const log4js = require('log4js');
const controller = require('./controller/controller');
const errorManager = require('../../../utils/errorManager');
const swaggerUi = require('swagger-ui-express');

let LOGGER = log4js.getLogger("OSRM");
let router = express.Router();

// API entrypoint
router.all("/", function(req, res) {
  LOGGER.debug("request on /osrm/1.0.0/");
  res.send("Road2 via OSRM API 1.0.0");
});


// swagger-ui
let apiJsonPath = path.join(__dirname, '..', '..', '..','..','..', 'documentation','apis','osrm', '1.0.0', 'api.json');
LOGGER.info("using file '"+ apiJsonPath + "' to initialize swagger-ui for OSRM API version 1.0.0");
let swaggerDocument = require(apiJsonPath);
router.use('/openapi', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GetCapabilities
router.all("/resources", function(req, res, next) {

  LOGGER.debug("request on /osrm/1.0.0/resources?");
  return next(errorManager.createError("Not Implemented", 501));

});

// Route: routing request
router.route("/:resource/:profile/:optimization/route/v1/_/:coordinates")

  .get(async function(req, res, next) {

    LOGGER.debug("GET request on /osrm/1.0.0/:resource");
    LOGGER.debug(req.originalUrl);

    // get service instance
    let service = req.app.get("service");

    // check if operation is permitted on this service instance
    if (!service.verifyAvailabilityOperation("route")) {
      return next(errorManager.createError(" Operation not permitted on this service ", 400));
    }

    // get request parameters, both from path and query
    let path_parameters = req.params
    let query_parameters = req.query;
    let parameters = {}
    for (const key in query_parameters) {
      parameters[key] = query_parameters[key]
    }
    for (const key in path_parameters) {
      parameters[key] = path_parameters[key]
    }
    LOGGER.debug(parameters);

    try {

      // Check request parameters
      const routeRequest = controller.checkRouteParameters(parameters, service, "GET");
      LOGGER.debug(routeRequest);
      // Send to service and get response object
      const routeResponse = await service.computeRequest(routeRequest);
      LOGGER.debug(routeResponse);
      // Format response
      const userResponse = controller.writeRouteResponse(routeRequest, routeResponse, service);
      LOGGER.debug(userResponse);

      res.set('content-type', 'application/json');
      res.status(200).json(userResponse);

    } catch (error) {
      return next(error);
    }
  });


// Error management
// This part must be placed after normal routes definitions
// ---
router.use(logError);
router.use(sendError);
// This must be the last item to send an HTTP 404 error if evry route calls next.
router.use(notFoundError);
// ---

/**
*
* @function
* @name logError
* @description Callback to log error
*
*/

function logError(err, req, res, next) {

  let message = {
    request: req.originalUrl,
    query: req.query,
    body: req.body,
    error: {
      errorType: err.code,
      message: err.message,
      stack: err.stack
    }
  };

  if (err.status) {
    LOGGER.debug(message);
  } else {
    LOGGER.error(message);
  }
  
  next(err);
}

/**
*
* @function
* @name sendError
* @description Callback to send error to client
*
*/

function sendError(err, req, res, next) {
  // Behaviour should differ between production and development environments
  if (process.env.NODE_ENV === "production") {
    if (err.status) {
      // if error has a status, this error should be sent to the client
      res.status(err.status);
      res.json({code: err.code, message: err.message});
    } else {
      // if error has no status, this error's details should not be sent to the client
      res.status(500);
      res.json({code: "internal", message: "Internal Server Error"});
    }
  } else if ((process.env.NODE_ENV === "debug")) {
      res.status(err.status || 500);
      res.json({code: err.code,
        message: err.message,
        stack: err.stack,
        // useful for SQL errors
        more: err
      });
  } else {
    // in the development environment, every error should be sent to clients
    res.status(err.status || 500);
    res.json({code: err.code, message: err.message});
  }

}

/**
*
* @function
* @name sendError
* @description Callback to send HTTP "Not Found" error to client
*
*/

function notFoundError(req, res) {
  res.status(404);
  res.send({ error: "Not found" });
}

module.exports = router;
