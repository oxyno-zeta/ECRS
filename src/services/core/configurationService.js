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
const {
    CONSTANTS,
    } = configurationWrapper;

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    getPort,
    getLogLevel,
    getLogUploadDirectory,
    getAppCrashLogDirectory,
    database: {
        getUrl,
        getLogin,
        getPassword,
    },
    auth: {
        getJwtSecret,
        github: {
            isEnabled: isGithubEnabled,
            getClientId: getGithubClientId,
            getClientSecret: getGithubClientSecret,
        },
        local: {
            isEnabled: isLocalEnabled,
        },
    },
    isLocalRegisterEnabled,
    getBackendUrl,
    mail: {
        isPool: isMailPool,
        getHost: getMailHost,
        getPort: getMailPort,
        isSecure: isMailSecure,
        auth: {
            getUser: getMailAuthUser,
            getPass: getMailAuthPass,
        },
        getMailFrom,
    },
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Is mail pool.
 * @returns {*}
 */
function isMailPool() {
    return configuration[CONSTANTS.MAIL_POOL];
}

/**
 * Get mail host.
 * @returns {*}
 */
function getMailHost() {
    return configuration[CONSTANTS.MAIL_HOST];
}

/**
 * Get mail port.
 * @returns {*}
 */
function getMailPort() {
    return configuration[CONSTANTS.MAIL_PORT];
}

/**
 * Is mail secure.
 * @returns {*}
 */
function isMailSecure() {
    return configuration[CONSTANTS.MAIL_SECURE];
}

/**
 * Get mail auth user.
 * @returns {*}
 */
function getMailAuthUser() {
    return configuration[CONSTANTS.MAIL_AUTH_USER];
}

/**
 * Get mail auth pass.
 * @returns {*}
 */
function getMailAuthPass() {
    return configuration[CONSTANTS.MAIL_AUTH_PASS];
}

/**
 * Get mail from.
 * @returns {*}
 */
function getMailFrom() {
    return configuration[CONSTANTS.MAIL_FROM];
}

/**
 * Get Backend URL.
 * @returns {*}
 */
function getBackendUrl() {
    return configuration[CONSTANTS.BACKEND_URL];
}

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
