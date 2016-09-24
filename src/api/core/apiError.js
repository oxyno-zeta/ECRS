/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 17/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const APIResponse = require('./APIResponse');
const APICodes = require('./APICodes');
const logger = require('../../shared/logger')('[Error API]');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    middleware: {
        errorCleaner,
    },
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Error cleaner middleware.
 * @returns {Function}
 */
function errorCleaner() {
    return (err, req, res, next) => {
        // Log error
        if (_.has('stack')) {
            logger.error(err.stack);
        } else {
            logger.error(err);
        }
        // Response
        let statusCode = err.statusCode || err.status || 500;

        // Special code for upload file
        if (err && err.code && _.isEqual('LIMIT_FILE_SIZE', err.code)) {
            statusCode = 413;
        }

        const body = APIResponse.getDefaultResponseBody();
        APIResponse.sendResponse(res, body, APICodes.ALL_BY_CODES[statusCode]);
    };
}
