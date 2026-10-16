'use strict';

const valhallaResource = require('./valhallaResource');
const log4js = require('log4js');

var LOGGER = log4js.getLogger("PROXYRESOURCE");

/**
*
* @class
* @name proxyResource
* @description Classe modélisant une ressource qui délègue les calculs à des sources de type proxy.
* La sélection de la source suit la même logique que valhallaResource (profile/optimization ou profile/costType).
*
*/
module.exports = class proxyResource extends valhallaResource {

  /**
  *
  * @function
  * @name initResource
  * @description Créer les liens entre la ressource et ses sources proxy
  * @param {SourceManager} sourceManager - Manager des sources du service
  * @return {boolean}
  *
  */
  initResource(sourceManager) {

    for (const sourceId of this._configuration.sources) {

      if (!sourceManager.isLoadedSourceAvailable(sourceId)) {
        LOGGER.error("La source n'a pas été chargée");
        return false;
      }

      const source = sourceManager.getSourceById(sourceId);

      if (source.type !== "proxy") {
        LOGGER.error("La source n'est pas de type 'proxy'");
        return false;
      }

      for (const operation of this._configuration.availableOperations) {
        if (!source.isOperationMapped(operation.id)) {
          LOGGER.error("L'opération " + operation.id + " n'est pas définie dans le mapping de la source " + sourceId);
          return false;
        }
      }

      for (const cost of source.configuration.costs) {
        this._linkedSource[cost.profile + cost.optimization] = source.configuration.id;
        this._linkedSource[cost.profile + cost.costType] = source.configuration.id;
      }

    }

    return true;

  }

}
