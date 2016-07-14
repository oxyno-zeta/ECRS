/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 12/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var mongoose = require('mongoose');
var logger = require('../../shared/logger')('[DatabaseService]');
var configurationService = require('./configurationService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	initDatabase: initDatabase
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Initialize database.
 * @returns {Promise}
 */
function initDatabase() {
	return new Promise(function (resolve, reject) {
		logger.debug('Begin initialize database...');

		logger.debug('Put new promise system');
		// Put new Promise system
		mongoose.Promise = Promise;

		var options = {};
		if ("" !== configurationService.database.getLogin())
			options.user = configurationService.database.getLogin();

		if ("" !== configurationService.database.getPassword())
			options.pass = configurationService.database.getPassword();

		mongoose.connect(configurationService.database.getUrl(), options);

		mongoose.connection.on('connected', function () {
			logger.debug('Mongoose connection open to ' + configurationService.database.getUrl());
			logger.debug('End initialize database');
			resolve();
		});

		// If the connection throws an error
		mongoose.connection.on('error', function (err) {
			logger.error('Mongoose connection error');
			reject(err);
		});

		// When the connection is disconnected
		mongoose.connection.on('disconnected', function () {
			logger.debug('Mongoose default connection disconnected');
		});
	});
}

