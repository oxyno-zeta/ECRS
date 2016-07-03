/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */

var winston = require('winston');
var _ = require('lodash');
var configurationService = require('../services/configurationService');

// Configuration
var configBase = {
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
var logger = new (winston.Logger)({
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

