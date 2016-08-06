/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 09/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const logger = require('../shared/logger')('[CrashLogService]');
const crashLogMapper = require('../mappers/crashLogMapper');
const crashLogDao = require('../dao/crashLogDao');
const projectDao = require('../dao/projectDao');
const configurationService = require('./core/configurationService');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	saveNewCrashLog: saveNewCrashLog,
	save: save,
	findById: findById
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Find by id.
 * @param id {String} id
 * @returns {Promise} Promise
 */
function findById(id) {
	return crashLogDao.findById(id);
}

/**
 * Save.
 * @param crashLogObject {Object} CrashLog Object
 * @returns {Promise} Promise
 */
function save(crashLogObject) {
	return crashLogDao.save(crashLogObject);
}

/**
 * Save new crash log.
 * @param crashLogApiData
 * @param projectObject
 * @returns {Promise}
 */
function saveNewCrashLog(crashLogApiData, projectObject) {
	return new Promise(function (resolve, reject) {
		// Build CrashLog object
		let crashLog = crashLogMapper.build(crashLogApiData);

		logger.debug(`Build database object : ${crashLog.toString()}`);

		// Add project to crash log object and other way
		crashLog.project = projectObject._id;
		projectObject.crashLogList.push(crashLog._id);

		// Save and update
		let promises = [];
		promises.push(crashLogDao.save(crashLog));
		promises.push(projectDao.save(projectObject));
		Promise.all(promises).then(function ([crashLogSaved]) {
			resolve(crashLogSaved);
		}).catch(function (err) {
			logger.error(err);
			reject(err);
		});
	});
}
