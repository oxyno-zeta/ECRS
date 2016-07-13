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
	getAppCrashLogDirectory: getAppCrashLogDirectory,
	database: {
		getUrl: getUrl,
		getLogin: getLogin,
		getPassword: getPassword
	}
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get database password.
 * @returns {*}
 */
function getPassword(){
	return configuration[CONSTANTS.DATABASE_PASSWORD];
}

/**
 * Get database login.
 * @returns {*}
 */
function getLogin(){
	return configuration[CONSTANTS.DATABASE_LOGIN];
}

/**
 * Get database url.
 * @returns {*}
 */
function getUrl(){
	return configuration[CONSTANTS.DATABASE_URL];
}

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


