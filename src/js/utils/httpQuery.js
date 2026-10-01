const log4js = require('log4js');
const { HttpsProxyAgent } = require('https-proxy-agent');

var LOGGER = log4js.getLogger("HTTPQUERY");

// got est distribué uniquement en ESM, il doit donc être chargé dynamiquement depuis ce module CommonJS
let gotPromise = null;
function loadGot() {
    if (!gotPromise) {
        gotPromise = import('got').then((module) => module.default);
    }
    return gotPromise;
}

module.exports = class httpQuery {

    /**
    *
    * @function
    * @name constructor
    * @description Constructeur de la classe httpQuery
    * @param {object} options - Options
    *
    */
    constructor(options) {
        const defaultOptions = {
            headers: {
                "Referer": "road2"
            },
            /* TODO: à voir si on peut remplacer par autre chose ? à tester sur l'infra */
            https: {
              rejectUnauthorized: false
            }
        };

        this._options = {...defaultOptions, ...options};

        if (process.env.HTTP_PROXY) {
            this._options.agent = {https: new HttpsProxyAgent(process.env.HTTP_PROXY)}
        }
    }

    /**
    *
    * @function
    * @name get
    * @description Effectue une requête http avec la méthode GET
    * @param {string} query - query url
    * @param {object} options - query options
    * @return {Promise}
    *
    */
    get(query, options) {

        LOGGER.debug("http query :");
        LOGGER.debug(query);
        const _options = {...this._options, ...options};
        LOGGER.debug("with options :");
        LOGGER.debug(_options);
        return loadGot().then((got) => got(query, _options));
    }

    /**
    *
    * @function
    * @name post
    * @description Effectue une requête http avec la méthode POST
    * @param {string} url - url
    * @param {object} options - query options
    * @return {Promise}
    *
    */
     post(url, options) {
        //WARNING: fonction non testée
        const _options = {...this._options, ...options};
        return loadGot().then((got) => got.post(url, _options));
    }

    /**
    *
    * @function
    * @name post
    * @description Méthode simplifiée pour une requête http avec la méthode POST en mode JSON
    * @param {string} url - url
    * @param {object | Array | number | string | boolean | null} json - JSON-serializable value
    * @return {Promise}
    *
    */
     postJson(url, json) {
        //WARNING: fonction non testée
        let options = {
            json,
            responseType: 'json',
            resolveBodyOnly: true
        };
        const _options = {...this._options, ...options};
        return loadGot().then((got) => got.post(url, _options));
    }
}
