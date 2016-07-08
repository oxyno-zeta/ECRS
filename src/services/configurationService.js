/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const configurationWrapper = require('../wrapper/configurationWrapper');
const configuration = configurationWrapper.getConfig();
const {CONSTANTS} = configurationWrapper;

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	getPort: getPort,
	getLogLevel: getLogLevel,
	getLogUploadDirectory: getLogUploadDirectory,
	getAppCrashLogDirectory: getAppCrashLogDirectory
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get app crash logs directory.
 * @returns {*}
 */
function getAppCrashLogDirectory(){
	return configuration[CONSTANTS.LOG_APP_CRASH_DIR];
}

/**
 * Get log upload directory.
 * @returns {*}
 */
function getLogUploadDirectory(){
	return configuration[CONSTANTS.LOG_UPLOAD_DIR];
}

/**
 * Get Log Level.
 * @returns {*}
 */
function getLogLevel(){
	return configuration[CONSTANTS.LOG_LEVEL];
}

/**
 * Get Server Port.
 * @returns {*}
 */
function getPort(){
	return configuration[CONSTANTS.PORT];
}


