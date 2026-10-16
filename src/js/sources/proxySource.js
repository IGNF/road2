'use strict';

const Source = require('./source');
const proxyMapper = require('./proxyMapper');
const responseWriter = require('./proxyResponseWriter');
const httpQuery = require('../utils/httpQuery');
const errorManager = require('../utils/errorManager');

const log4js = require('log4js');
const LOGGER = log4js.getLogger("PROXYSOURCE");

const DEFAULT_TIMEOUT = 30000;

/**
*
* @class
* @name proxySource
* @description Classe modélisant une source qui délègue le calcul à un service HTTP distant.
* Les paramètres de l'API Road2 sont traduits grâce à un mapping configurable.
*
*/
module.exports = class proxySource extends Source {

  /**
  *
  * @function
  * @name constructor
  * @description Constructeur de la classe proxySource
  * @param {json} sourceJsonObject - Description de la source
  *
  */
  constructor(sourceJsonObject) {

    super(sourceJsonObject.id, "proxy", sourceJsonObject.description, sourceJsonObject.projection, sourceJsonObject.bbox);

    this._configuration = sourceJsonObject;

    this._url = sourceJsonObject.proxy.url.replace(/\/+$/, "");
    this._timeout = sourceJsonObject.proxy.timeout || DEFAULT_TIMEOUT;

    // Le mapping peut être donné en ligne ou par un chemin de fichier
    const mapping = sourceJsonObject.proxy.mapping;
    this._mapping = typeof mapping === "string" ? proxyMapper.loadMappingFile(mapping) : mapping;

    this._httpQuery = new httpQuery();

    // Correspondance profile/optimization et profile/costType vers la configuration du coût
    this._costs = {};
    for (const cost of sourceJsonObject.costs) {
      this._costs[cost.profile + "|" + cost.optimization] = cost;
      this._costs[cost.profile + "|" + cost.costType] = cost;
    }

  }

  get configuration() {
    return this._configuration;
  }

  set configuration(conf) {
    this._configuration = conf;
  }

  /**
  *
  * @function
  * @name isOperationMapped
  * @description Savoir si le mapping gère une opération
  * @param {string} operation - Id de l'opération
  * @return {boolean}
  *
  */
  isOperationMapped(operation) {
    return !!this._mapping[operation];
  }

  async connect() {
    this._connected = true;
  }

  async disconnect() {
    this._connected = false;
  }

  /**
  *
  * @function
  * @name computeRequest
  * @description Traiter une requête en la traduisant pour le service distant.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @return {Promise}
  *
  */
  computeRequest(request) {

    LOGGER.debug("computeRequest()");

    const operation = request.operation;

    if (!this.isOperationMapped(operation)) {
      return Promise.reject(errorManager.createError(" Operation not available for this source ", 400));
    }

    const operationMapping = this._mapping[operation];

    let context;
    try {
      context = this.buildContext(request);
    } catch (error) {
      return Promise.reject(error);
    }

    const method = operationMapping.method || "POST";
    const url = this._url + proxyMapper.render(operationMapping.path, context);

    const options = {
      responseType: "json",
      resolveBodyOnly: true,
      timeout: { request: this._timeout }
    };

    if (operationMapping.headers) {
      options.headers = proxyMapper.render(operationMapping.headers, context);
    }
    if (operationMapping.query) {
      options.searchParams = this.toSearchParams(proxyMapper.render(operationMapping.query, context));
    }

    let call;
    if (method === "GET") {
      call = this._httpQuery.get(url, options);
    } else {
      if (operationMapping.body) {
        options.json = proxyMapper.render(operationMapping.body, context);
      }
      call = this._httpQuery.post(url, options);
    }

    LOGGER.info(method + " " + url);

    return call.then((body) => {

      this.state = "green";
      LOGGER.debug(body);

      let engineResponse = body;
      if (operationMapping.response.root) {
        engineResponse = proxyMapper.resolvePath(body, operationMapping.response.root);
      }

      if (operation === "route") {
        return responseWriter.writeRouteResponse(request, engineResponse, this.projection, operationMapping.response.polylinePrecision || 5);
      }
      return responseWriter.writeIsochroneResponse(request, engineResponse, this.projection);

    }, (error) => {

      LOGGER.error("proxy error for " + operation + " :");
      LOGGER.error(error);

      if (error && error.response) {
        // Le service a répondu : il est joignable mais n'a pas pu traiter la requête
        this.state = "green";
        return Promise.reject(errorManager.createError(" No path found ", 404));
      }

      this.state = "red";
      return Promise.reject("Internal PROXY error");

    });

  }

  /**
  *
  * @function
  * @name buildContext
  * @description Construire les variables disponibles dans le mapping à partir de la requête.
  * @param {Request} request - Objet Request ou dérivant de la classe Request
  * @return {object}
  *
  */
  buildContext(request) {

    const cost = this._costs[request.profile + "|" + (request.operation === "route" ? request.optimization : request.costType)];

    const context = {
      resource: request.resource,
      operation: request.operation,
      profile: request.profile,
      projection: this.projection,
      date_time: request.date_time,
      cost: cost && cost.parameters ? cost.parameters : {},
      constraints: (request.constraints || []).filter((c) => c.type === "banned").map((c) => c.field)
    };

    if (request.operation === "route") {

      const intermediates = (request.intermediates || []).map((p) => p.getCoordinatesIn(this.projection));

      context.optimization = request.optimization;
      context.start = request.start.getCoordinatesIn(this.projection);
      context.end = request.end.getCoordinatesIn(this.projection);
      context.intermediates = intermediates;
      context.coordinates = [context.start, ...intermediates, context.end];

    } else {

      context.costType = request.costType;
      context.costValue = request.costValue;
      context.direction = request.direction;
      context.point = request.point.getCoordinatesIn(this.projection);

    }

    return context;

  }

  /**
  *
  * @function
  * @name toSearchParams
  * @description Convertir un objet en paramètres d'URL (les tableaux sont joints par des virgules).
  * @param {object} query - Paramètres
  * @return {object}
  *
  */
  toSearchParams(query) {
    const params = {};
    for (const key of Object.keys(query)) {
      const value = query[key];
      params[key] = Array.isArray(value) ? value.join(",") : (typeof value === "object" ? JSON.stringify(value) : value);
    }
    return params;
  }

}
