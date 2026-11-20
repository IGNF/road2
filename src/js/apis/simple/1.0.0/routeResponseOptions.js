'use strict';

const errorManager = require('../../../utils/errorManager');

const METADATA_ONLY_PARAMETER = 'metadataOnly';

function readMetadataOnly(parameters, method) {
  if (!parameters || !Object.hasOwn(parameters, METADATA_ONLY_PARAMETER)) {
    return false;
  }

  const value = parameters[METADATA_ONLY_PARAMETER];
  if (method === 'GET') {
    if (value === 'true' || value === 'false') {
      return value === 'true';
    }
  } else if (typeof value === 'boolean') {
    return value;
  }

  throw errorManager.createError(` Parameter '${METADATA_ONLY_PARAMETER}' is invalid: expected true or false. `, 400);
}

module.exports = { METADATA_ONLY_PARAMETER, readMetadataOnly };
