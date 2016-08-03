/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 10/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const projectDao = require('../dao/projectDao');
const projectMapper = require('../mappers/projectMapper');

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
	getAllVersions: getAllVersions
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

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
 * @returns {Promise}
 */
function create(data) {
	// Create project instance
	let project = projectMapper.build(data);

	return projectDao.save(project);
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

