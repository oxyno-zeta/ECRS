/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var nconf = require('nconf');
var _ = require('lodash');

// Variables
var CONSTANTS = {
	PORT: 'CRASH_REPORTER_PORT',
	LOG_LEVEL: 'CRASH_REPORTER_LOG_LEVEL'
};
var LOG_LEVELS = {
	DEBUG: 'debug',
	INFO: 'info',
	ERROR: 'error',
	WARN: 'warn'
};

// Default configuration
var DEFAULT_CONFIG = {
	'CRASH_REPORTER_PORT': 2000,
	'CRASH_REPORTER_LOG_LEVEL': LOG_LEVELS.INFO
};

/**
 * 1) Default
 * 2) Configuration file
 * 3) Env variables
 * 4) Command line
 */
// Configuration file => no config file for the moment
// nconf.file({file: 'config.json'});
// Environment variables
nconf.env();
// Command line
nconf.argv();
// Default
nconf.defaults(DEFAULT_CONFIG);

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	CONSTANTS: CONSTANTS,
	getConfig: getConfig
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get configuration.
 * @returns {{}}
 */
function getConfig(){
	var config = {};

	var key;
	for (key in DEFAULT_CONFIG){
		if (DEFAULT_CONFIG.hasOwnProperty(key)) {
			config[key] = nconf.get(key);
		}
	}

	// Valid log level
	if (!_.includes(LOG_LEVELS, config[CONSTANTS.LOG_LEVEL])){
		config[CONSTANTS.LOG_LEVEL] = LOG_LEVELS.INFO;
	}

	// Change type if necessary
	if (!_.isInteger(config[CONSTANTS.PORT])){
		config[CONSTANTS.PORT] = _.parseInt(config[CONSTANTS.PORT]);
	}

	return config;
}
