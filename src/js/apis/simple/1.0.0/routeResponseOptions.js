'use strict';

const errorManager = require('../../../utils/errorManager');

const RETURN_GEOMETRY_PARAMETER = 'returnGeometry';

function readReturnGeometry(parameters, method) {
  if (!parameters || !Object.hasOwn(parameters, RETURN_GEOMETRY_PARAMETER)) {
    return true;
  }

  const value = parameters[RETURN_GEOMETRY_PARAMETER];
  if (method === 'GET') {
    if (value === 'true' || value === 'false') {
      return value === 'true';
    }
  } else if (typeof value === 'boolean') {
    return value;
  }

  throw errorManager.createError(` Parameter '${RETURN_GEOMETRY_PARAMETER}' is invalid: expected true or false. `, 400);
}

module.exports = { RETURN_GEOMETRY_PARAMETER, readReturnGeometry };
