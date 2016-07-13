/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 08/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const fs = require('fs');
const configurationService = require('./configurationService');
const logger = require('../shared/logger');
const databaseService = require('./databaseService');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	run: run
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Create directory.
 * @param path {String} Path to create
 * @returns {Promise} Promise
 */
function createDirectory(path){
	return new Promise(function(resolve, reject){
		logger.debug(`Create directory: Check if directory "${path}" exists`);
		fs.exists(path, function(exists){
			if (exists){
				// Already exists
				resolve();
			}
			else {
				logger.debug(`Create directory: Create directory "${path}"`);
				fs.mkdir(path, function(err){
					if (err){
						reject(err);
					}
					else {
						resolve();
					}
				});
			}
		});
	});
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Run initialize.
 * @returns {Promise} Promise
 */
function run(){
	return new Promise(function(resolve, reject){
		logger.debug('Run initialize service');

		// Promise storage
		let promises = [];

		// Add promise
		promises.push(createDirectory(configurationService.getAppCrashLogDirectory()));
		promises.push(createDirectory(configurationService.getLogUploadDirectory()));
		promises.push(databaseService.initDatabase());

		Promise.all(promises).then(resolve, reject);
	});
}
