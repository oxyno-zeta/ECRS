/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 12/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const mongoose = require('mongoose');
const logger = require('../../shared/logger')('[DatabaseService]');
const configurationService = require('./configurationService');
const userService = require('../userService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    initDatabase,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Initialize database.
 * @returns {Promise}
 */
function initDatabase() {
    return new Promise((resolve, reject) => {
        logger.debug('Begin initialize database...');

        logger.debug('Put new promise system');
        // Put new Promise system
        mongoose.Promise = Promise;

        const options = {};
        const login = configurationService.database.getLogin();
        if (login) {
            options.user = login;
        }

        const password = configurationService.database.getPassword();
        if (password) {
            options.pass = password;
        }

        mongoose.connect(configurationService.database.getUrl(), options);

        mongoose.connection.on('connected', () => {
            logger.debug(`Mongoose connection open to ${configurationService.database.getUrl()}`);
            userService.initialize().then(() => {
                logger.debug('End initialize database');
                resolve();
            }).catch(reject);
        });

        // If the connection throws an error
        mongoose.connection.on('error', (err) => {
            logger.error('Mongoose connection error');
            reject(err);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', () => {
            logger.debug('Mongoose default connection disconnected');
        });
    });
}

