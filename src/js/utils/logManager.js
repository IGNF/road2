'use strict';

const log4js = require('log4js');

// Création du LOGGER
const LOGGER = log4js.getLogger("LOGMANAGER");

module.exports = {

    /**
     *
     * @function
     * @name checkLogConfiguration
     * @description Vérification de la configuration d'un logger
     * @param {object} userLogConfiguration - Configuration du logger
     * @return {boolean}
     *
     */

    checkLogConfiguration: function(userLogConfiguration) {

        LOGGER.info("Vérification de la configuration du logger...");

        if (!userLogConfiguration) {

            LOGGER.error("Aucune configuration pour les logs.");
            return false;

        } else {

            if (!userLogConfiguration.mainConf) {
                LOGGER.error("Mausvaise configuration pour les logs: 'mainConf' absent.");
                return false;
            } else {

                if (!userLogConfiguration.mainConf.appenders) {
                    LOGGER.error("Mausvaise configuration pour les logs: 'mainConf.appenders' absent.");
                    return false;
                }

                if (!userLogConfiguration.mainConf.categories) {
                    LOGGER.error("Mausvaise configuration pour les logs: 'mainConf.categories' absent.");
                    return false;
                }

            }

            if (!userLogConfiguration.httpConf) {

                LOGGER.error("Mausvaise configuration pour les logs: 'httpConf' absent.");
                return false;

            } else {

                if (!userLogConfiguration.httpConf.level) {
                    LOGGER.error("Mausvaise configuration pour les logs: 'httpConf.level' absent.");
                    return false;
                } else {

                    if (typeof userLogConfiguration.httpConf.level !== "string") {
                        LOGGER.error("Mausvaise configuration pour les logs: 'httpConf.level' n'est pas une chaine de caracteres");
                        return false;
                    }

                }

                if (!userLogConfiguration.httpConf.format) {

                    LOGGER.error("Mausvaise configuration pour les logs: 'httpConf.format' absent.");
                    return false;

                } else {

                    if (typeof userLogConfiguration.httpConf.format !== "string") {
                        LOGGER.error("Mausvaise configuration pour les logs: 'httpConf.format' n'est pas une chaine de caracteres");
                        return false;
                    }

                }

            } 

        } 

        LOGGER.info("Vérification des logs terminée");
        return true;

    }

}