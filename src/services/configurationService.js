/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var configurationWrapper = require('../wrapper/configurationWrapper');
var configuration = configurationWrapper.getConfig();

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	getPort: getPort,
	getLogLevel: getLogLevel
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get Log Level.
 * @returns {*}
 */
function getLogLevel(){
	return configuration[configurationWrapper.CONSTANTS.LOG_LEVEL];
}

/**
 * Get Server Port.
 * @returns {*}
 */
function getPort(){
	return configuration[configurationWrapper.CONSTANTS.PORT];
}


