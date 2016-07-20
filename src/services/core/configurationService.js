/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const configurationWrapper = require('../../wrapper/configurationWrapper');
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
	},
	auth: {
		getJwtSecret: getJwtSecret,
		github: {
			isEnabled: isGithubEnabled,
			getClientId: getGithubClientId,
			getClientSecret: getGithubClientSecret
		},
		local: {
			isEnabled: isLocalEnabled
		}
	},
	isLocalRegisterEnabled: isLocalRegisterEnabled
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Is local register enabled.
 * @returns {*}
 */
function isLocalRegisterEnabled() {
	return configuration[CONSTANTS.LOCAL_REGISTER_ENABLED];
}

/**
 * Is local auth enabled.
 * @returns {*}
 */
function isLocalEnabled() {
	return configuration[CONSTANTS.LOCAL_AUTH_ENABLED];
}

/**
 * Get Jwt Secret.
 * @returns {*}
 */
function getJwtSecret() {
	return configuration[CONSTANTS.JWT_SECRET];
}

/**
 * Get Github Client Secret.
 * @returns {*}
 */
function getGithubClientSecret() {
	return configuration[CONSTANTS.GITHUB_CLIENT_SECRET];
}

/**
 * Get Github Client id.
 * @returns {*}
 */
function getGithubClientId() {
	return configuration[CONSTANTS.GITHUB_CLIENT_ID];
}

/**
 * Is Github enabled.
 * @returns {*}
 */
function isGithubEnabled() {
	return configuration[CONSTANTS.GITHUB_OAUTH_ENABLED];
}

/**
 * Get database password.
 * @returns {*}
 */
function getPassword() {
	return configuration[CONSTANTS.DATABASE_PASSWORD];
}

/**
 * Get database login.
 * @returns {*}
 */
function getLogin() {
	return configuration[CONSTANTS.DATABASE_LOGIN];
}

/**
 * Get database url.
 * @returns {*}
 */
function getUrl() {
	return configuration[CONSTANTS.DATABASE_URL];
}

/**
 * Get app crash logs directory.
 * @returns {*}
 */
function getAppCrashLogDirectory() {
	return configuration[CONSTANTS.LOG_APP_CRASH_DIR];
}

/**
 * Get log upload directory.
 * @returns {*}
 */
function getLogUploadDirectory() {
	return configuration[CONSTANTS.LOG_UPLOAD_DIR];
}

/**
 * Get Log Level.
 * @returns {*}
 */
function getLogLevel() {
	return configuration[CONSTANTS.LOG_LEVEL];
}

/**
 * Get Server Port.
 * @returns {*}
 */
function getPort() {
	return configuration[CONSTANTS.PORT];
}


