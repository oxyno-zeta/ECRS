/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 09/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const {CrashLog} = require('../models/crashLogModel');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	save: save,
	findById: findById,
	findByIds: findByIds,
	findAllByProjectIdAndStartDate: findAllByProjectIdAndStartDate,
	findAllByProjectIdAndVersions: findAllByProjectIdAndVersions,
	findAllByProjectIdAndVersionsAndStartDate: findAllByProjectIdAndVersionsAndStartDate,
	findByProjectId: findByProjectId
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Find by project id.
 * @param projectId {String} project id
 * @returns {*}
 */
function findByProjectId(projectId) {
	return CrashLog.find({
		project: projectId
	});
}

/**
 * Find all by project id and versions.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @returns {*}
 */
function findAllByProjectIdAndVersions(projectId, versions) {
	return CrashLog.find({
		project: projectId,
		_version: {$in: versions}
	});
}

/**
 * Find all by project id, versions and startDate.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @param startDate {Integer} Start date (in timestamp ms)
 * @returns {*}
 */
function findAllByProjectIdAndVersionsAndStartDate(projectId, versions, startDate) {
	return CrashLog.find({
		project: projectId,
		_version: {$in: versions},
		date: {$gt: startDate}
	});
}

/**
 * Find all by project id and start date.
 * @param projectId {String} Project id
 * @param startDate {Integer} Start date (in timestamp ms)
 * @returns {*}
 */
function findAllByProjectIdAndStartDate(projectId, startDate) {
	return CrashLog.find({
		project: projectId,
		date: {$gt: startDate}
	});
}

/**
 * Find by ids.
 * @param idList {Array} id List
 * @returns {Promise}
 */
function findByIds(idList) {
	return Promise.all(idList.map(findById));
}

/**
 * Find by id.
 * @param id {String} id
 * @returns {Promise} Promise
 */
function findById(id) {
	return CrashLog.findById(id);
}

/**
 * Save.
 * @param crashLogObject {Object} CrashLog Object
 * @returns {Promise} Promise
 */
function save(crashLogObject) {
	return crashLogObject.save();
}
