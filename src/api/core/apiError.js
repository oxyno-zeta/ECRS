/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 17/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const APIResponse = require('./APIResponse');
const APICodes = require('./APICodes');
const logger = require('../../shared/logger')('[Error API]');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	middleware: {
		errorCleaner: errorCleaner
	}
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
	return function (err, req, res, next) {
		// Log error
		logger.error(err);
		// Response
		let statusCode = err.statusCode || err.status || 500;
		let body = APIResponse.getDefaultResponseBody();
		APIResponse.sendResponse(res, body, APICodes.ALL_BY_CODES[statusCode]);
	}
}
