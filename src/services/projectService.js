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
	create: create
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

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

