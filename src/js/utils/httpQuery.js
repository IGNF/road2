const log4js = require('log4js');
const got = require('got');
const HttpsProxyAgent = require('https-proxy-agent');

var LOGGER = log4js.getLogger("HTTPQUERY");

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
        const _options = {...this._options, ...options};
        return got(query, _options);
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
        return got.post(url, _options);
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
        return got.post(url, _options);
    }
}