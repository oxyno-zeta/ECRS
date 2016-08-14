/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 10/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const projectDao = require('../dao/projectDao');
const projectMapper = require('../mappers/projectMapper');
const crashLogService = require('./crashLogService');
const userService = require('./userService');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	findById: findById,
	findByIds: findByIds,
	findAll: findAll,
	findByName: findByName,
	create: create,
	statisticsNumberByVersion: statisticsNumberByVersion,
	statisticsNumberByDate: statisticsNumberByDate,
	statisticsNumberByVersionByDate: statisticsNumberByVersionByDate,
	statisticsNumberByVersionByDateAndStartDate: statisticsNumberByVersionByDateAndStartDate,
	getAllVersions: getAllVersions,
	deleteRecursivelyById: deleteRecursivelyById
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Delete recursively by id.
 * @param id {String} id
 * @returns {*}
 */
function deleteRecursivelyById(id) {
	return new Promise((resolve, reject) => {
		projectDao.findById(id).then(function (project) {
			let promises = [];
			// Add promises
			project.crashLogList.forEach(function (id) {
				promises.push(new Promise((resolve, reject) => {

					function removeFromArray() {
						_.remove(project.crashLogList, function (id2) {
							return _.isEqual(id, id2);
						});
					}

					crashLogService.deleteById(id).then(function () {
						// Success => Remove from array
						removeFromArray();
						resolve();
					}).catch(reject);
				}));
			});

			Promise.all(promises).then(function () {
				// Remove all crash logs done
				// Remove project now
				projectDao.deleteById(id).then(resolve).catch(reject);
			}).catch(function (err) {
				// Save updated project
				projectDao.save(project).finally(function () {
					// Saved
					reject(err);
				});
			});
		}).catch(reject);
	});
}

/**
 * Get all versions for project.
 * @param projectId {String} Project id
 * @returns {Promise}
 */
function getAllVersions(projectId) {
	return projectDao.getAllVersions(projectId);
}

/**
 * Statistics number by version by date.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @returns {Promise}
 */
function statisticsNumberByVersionByDate(projectId, versions) {
	return projectDao.statisticsNumberByVersionByDate(projectId, versions);
}

/**
 * Statistics number by version by date.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @param startDate {Integer} Start date (in timestamp ms)
 * @returns {Promise}
 */
function statisticsNumberByVersionByDateAndStartDate(projectId, versions, startDate) {
	return projectDao.statisticsNumberByVersionByDateAndStartDate(projectId, versions, startDate);
}

/**
 * Statistics Number By Date
 * @param projectId {String} Project Id
 * @param startDate {Integer} Start date in timestamp (in ms)
 * @returns {Promise}
 */
function statisticsNumberByDate(projectId, startDate) {
	return projectDao.statisticsNumberByDate(projectId, startDate);
}

/**
 * Statistics Number By Version.
 * @param project {Object} Project
 * @returns {Promise}
 */
function statisticsNumberByVersion(project) {
	return projectDao.statisticsNumberByVersion(project);
}

/**
 * Create project.
 * @param data {Object} project data
 * @param userInstance {Object} user instance
 * @returns {Promise}
 */
function create(data, userInstance) {
	return new Promise((resolve, reject) => {
		// Create project instance
		let project = projectMapper.build(data);

		projectDao.save(project).then(function () {
			// Project added in database
			userInstance.projects.push(project._id);
			userService.saveForInstance(userInstance).then(function () {
				resolve(project);
			}).catch(function (err) {
				// Need to try to delete project
				projectDao.deleteById(project._id);
				reject(err);
			});
		}).catch(reject);
	});
}

/**
 * Find by name.
 * @param name {String} name
 * @returns {*}
 */
function findByName(name) {
	return projectDao.findByName(name);
}

/**
 * Find all.
 * @returns {*}
 */
function findAll() {
	return projectDao.findAll();
}

/**
 * Find by ids.
 * @param ids {Array} Array of id.
 * @returns {Promise}
 */
function findByIds(ids) {
	return projectDao.findByIds(ids);
}

/**
 * Find by Id.
 * @param id {String} Object id
 * @returns {Promise}
 */
function findById(id) {
	return projectDao.findById(id);
}

