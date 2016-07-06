/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */

const winston = require('winston');
const _ = require('lodash');
const configurationService = require('../services/configurationService');

// Configuration
const configBase = {
	file: {
		filename: 'all-logs.log',
		json: false,
		level: configurationService.getLogLevel()
	},
	console: {
		colorize: true,
		level: configurationService.getLogLevel()
	}
};

// Create logger
const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(_.assignIn({}, configBase.console)),
		new winston.transports.File(_.assignIn({name: 'logs'}, configBase.file))
	],
	exceptionHandlers: [
		new (winston.transports.Console)(_.assignIn({}, configBase.console)),
		new winston.transports.File(_.assignIn({name: 'exceptions'}, configBase.file))
	]
});

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	debug: logger.debug,
	info: logger.info,
	error: logger.error,
	warn: logger.warn
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

