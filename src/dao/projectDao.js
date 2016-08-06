/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 10/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const moment = require('moment');
const {Project} = require('../models/projectModel');
const crashLogDao = require('./crashLogDao');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	save: save,
	findById: findById,
	findByIds: findByIds,
	findAll: findAll,
	findByName: findByName,
	statisticsNumberByVersion: statisticsNumberByVersion,
	statisticsNumberByDate: statisticsNumberByDate,
	statisticsNumberByVersionByDate: statisticsNumberByVersionByDate,
	statisticsNumberByVersionByDateAndStartDate: statisticsNumberByVersionByDateAndStartDate,
	getAllVersions: getAllVersions
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * format Statistics For Number By Version By Date.
 * @param results {Array} Project list
 * @returns {{}}
 */
function formatStatisticsForNumberByVersionByDate(results) {
	let statistics = {};

	// All date to midnight
	results = results.map((item) => {
		// Update date
		item.date = moment(item.date).millisecond(0).second(0).minute(0).hours(0).toDate();
		return item;
	});

	// Create statistics
	results.forEach((item) => {
		let date = item.date.getTime();
		let version = item._version;
		if (_.isUndefined(statistics[version])) {
			statistics[version] = {};
		}

		if (_.isUndefined(statistics[version][date])) {
			statistics[version][date] = 0;
		}
		statistics[version][date]++;
	});

	return statistics;
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get all versions for project.
 * @param projectId {String} Project id
 * @returns {Promise}
 */
function getAllVersions(projectId) {
	return new Promise(function (resolve, reject) {
		crashLogDao.findByProjectId(projectId).then(function (results) {
			let versions = [];
			// Add versions
			results.forEach(function (item) {
				// Check if exists in array
				if (versions.indexOf(item._version) === -1) {
					versions.push(item._version);
				}
			});

			resolve(versions);
		}, reject);
	});
}

/**
 * Statistics number by version by date.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @returns {Promise}
 */
function statisticsNumberByVersionByDate(projectId, versions) {
	return new Promise(function (resolve, reject) {
		crashLogDao.findAllByProjectIdAndVersions(projectId, versions).then(function (results) {
			resolve(formatStatisticsForNumberByVersionByDate(results));
		}, reject);
	});
}

/**
 * Statistics number by version by date.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @param startDate {Integer} Start date (in timestamp ms)
 * @returns {Promise}
 */
function statisticsNumberByVersionByDateAndStartDate(projectId, versions, startDate) {
	return new Promise(function (resolve, reject) {
		crashLogDao.findAllByProjectIdAndVersionsAndStartDate(projectId, versions, startDate).then(function (results) {
			resolve(formatStatisticsForNumberByVersionByDate(results));
		}, reject);
	});
}

/**
 * Statistics Number By Date
 * @param projectId {String} Project Id
 * @param startDate {Integer} Start date in timestamp (in ms)
 * @returns {Promise}
 */
function statisticsNumberByDate(projectId, startDate) {
	return new Promise(function (resolve, reject) {
		crashLogDao.findAllByProjectIdAndStartDate(projectId, startDate).then(function (results) {
			let statistics = {};

			// All date to midnight
			results = results.map((item) => {
				// Update date
				item.date = moment(item.date).millisecond(0).second(0).minute(0).hours(0).toDate();
				return item;
			});

			// Create statistics
			results.forEach((item) => {
				let date = item.date.getTime();
				if (_.isUndefined(statistics[date])) {
					statistics[date] = 0;
				}
				statistics[date]++;
			});

			resolve(statistics);
		}, reject);
	});
}

/**
 * Statistics Number By Version.
 * @param project {Object} Project
 * @returns {Promise}
 */
function statisticsNumberByVersion(project) {
	return new Promise(function (resolve, reject) {
		let statistics = {};

		// Check if crashLog list exists or not empty
		if (_.isNull(project.crashLogList) || project.crashLogList.length === 0) {
			resolve(statistics);
			return;
		}

		// Find all crash logs
		crashLogDao.findByIds(project.crashLogList).then(function (crashLogList) {
			// Separate by version
			crashLogList.forEach(function (crashLog) {
				if (_.isUndefined(statistics[crashLog._version])) {
					statistics[crashLog._version] = 0;
				}
				statistics[crashLog._version]++;
			});

			resolve(statistics);
		}).catch(reject);
	});
}

/**
 * Find by name.
 * @param name {String} name
 * @returns {*}
 */
function findByName(name) {
	return Project.findOne({name: name});
}

/**
 * Find all.
 * @returns {*}
 */
function findAll() {
	return Project.find();
}

/**
 * Find by ids.
 * @param ids {Array} Array of id.
 * @returns {Promise}
 */
function findByIds(ids) {
	// Promise storage
	let promises = [];
	// Find by id for all ids
	promises = ids.map(findById);

	// Return all
	return Promise.all(promises);
}

/**
 * Find by Id.
 * @param id {String} Object id
 * @returns {Promise}
 */
function findById(id) {
	return Project.findById(id);
}

/**
 * Save.
 * @param projectObject {Object} Project Object
 * @returns {Promise} Promise
 */
function save(projectObject) {
	return projectObject.save();
}
