/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const nodemailer = require('nodemailer');
const logger = require('../../shared/logger')('[MailCoreService]');
const configurationService = require('./configurationService');

let transporter;

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    initialize,
    getTransporter,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get mail transporter.
 * @returns {*}
 */
function getTransporter() {
    return transporter;
}

/**
 * Initialize.
 * @returns {Promise}
 */
function initialize() {
    return new Promise((resolve) => {
        logger.debug('Begin initialize mail system...');
        // Check email service is disabled
        if (isDisabled()) {
            logger.debug('Mail system disabled => nothing to do');
            resolve();
            return;
        }

        const smtpConfiguration = {
            pool: configurationService.mail.isPool(),
            host: configurationService.mail.getHost(),
            port: configurationService.mail.getPort(),
            secure: configurationService.mail.isSecure(), // use SSL
            auth: {},
            logger: false,
        };

        // Put auth if possible
        const userAuth = configurationService.mail.auth.getUser();
        if (userAuth) {
            smtpConfiguration.auth.user = userAuth;
        }
        const passAuth = configurationService.mail.auth.getPass();
        if (passAuth) {
            smtpConfiguration.auth.pass = passAuth;
        }

        transporter = nodemailer.createTransport(smtpConfiguration);

        logger.debug('End initialize mail system');
        resolve();
    });
}

/**
 * Is email disabled.
 * @returns {boolean}
 */
function isDisabled() {
    const host = configurationService.mail.getHost();
    const port = configurationService.mail.getPort();
    return host || port;
}

