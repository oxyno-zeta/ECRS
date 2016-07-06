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
	getLogUploadDirectory: getLogUploadDirectory
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

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


