/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const nodemailer = require('nodemailer');
const _ = require('lodash');
const logger = require('../../shared/logger')('[MailCoreService]');
const configurationService = require('./configurationService');
let transporter;

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	initialize: initialize,
	getTransporter: getTransporter
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
			return resolve();
		}


		let smtpConfiguration = {
			pool: configurationService.mail.isPool(),
			host: configurationService.mail.getHost(),
			port: configurationService.mail.getPort(),
			secure: configurationService.mail.isSecure(), // use SSL
			auth: {},
			logger: false
		};

		// Put auth if possible
		let userAuth = configurationService.mail.auth.getUser();
		if (!_.isEqual(userAuth, '')) {
			smtpConfiguration.auth.user = userAuth;
		}
		let passAuth = configurationService.mail.auth.getPass();
		if (!_.isEqual(passAuth, '')) {
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
	return (_.isNull(configurationService.mail.getHost()) ||
	_.isNull(configurationService.mail.getPort()) || _.isEqual('', configurationService.mail.getHost()) || _.isEqual(0, configurationService.mail.getPort()));
}

