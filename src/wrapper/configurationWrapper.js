/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const nconf = require('nconf');
const _ = require('lodash');
const path = require('path');

// Variables
const CONSTANTS = {
	PORT: 'CRASH_REPORTER_PORT',
	LOG_LEVEL: 'CRASH_REPORTER_LOG_LEVEL',
	LOG_UPLOAD_DIR: 'CRASH_REPORTER_LOG_UPLOAD_DIR',
	LOG_APP_CRASH_DIR: 'CRASH_REPORTER_LOG_APP_CRASH_DIR'
};
const LOG_LEVELS = {
	DEBUG: 'debug',
	INFO: 'info',
	ERROR: 'error',
	WARN: 'warn'
};

// Default configuration
const DEFAULT_CONFIG = {
	'CRASH_REPORTER_PORT': 2000,
	'CRASH_REPORTER_LOG_LEVEL': LOG_LEVELS.INFO,
	'CRASH_REPORTER_LOG_UPLOAD_DIR': path.join(process.cwd(), 'upload-logs/'),
	'CRASH_REPORTER_LOG_APP_CRASH_DIR': path.join(process.cwd(), 'app-crash-logs/')
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
