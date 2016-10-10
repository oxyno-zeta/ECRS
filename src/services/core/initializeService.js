/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 08/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const fs = require('fs');
const configurationService = require('./configurationService');
const logger = require('../../shared/logger')('[InitializeService]');
const databaseService = require('./databaseService');
const mailCoreService = require('./mailCoreService');
const apiAuth = require('../../api/core/apiAuth');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    run,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Create directory.
 * @param path {String} Path to create
 * @returns {Promise} Promise
 */
function createDirectory(path) {
    return new Promise((resolve, reject) => {
        logger.debug(`Create directory: Check if directory "${path}" exists`);
        fs.exists(path, (exists) => {
            if (exists) {
                // Already exists
                resolve();
            } else {
                logger.debug(`Create directory: Create directory "${path}"`);
                fs.mkdir(path, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Run initialize.
 * @returns {Promise} Promise
 */
function run() {
    return new Promise((resolve, reject) => {
        logger.debug('Run initialize service');

        // Promise storage
        const promises = [];

        // Add promise
        promises.push(createDirectory(configurationService.getAppCrashLogDirectory()));
        promises.push(createDirectory(configurationService.getLogUploadDirectory()));
        promises.push(databaseService.initDatabase());
        promises.push(apiAuth.initAuth());
        promises.push(mailCoreService.initialize());

        Promise.all(promises).then(resolve).catch(reject);
    });
}
