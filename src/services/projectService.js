/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 10/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const projectDao = require('../dao/projectDao');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	findById: findById,
	findByIds: findByIds,
	findAll: findAll,
	save: save,
	update: update
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

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
 * Update in database.
 * @param projectObject {Object} Project object
 * @returns {Promise} Promise
 */
function update(projectObject) {
	return projectDao.update(projectObject);
}

/**
 * Save.
 * @param projectObject {Object} Project Object
 * @returns {Promise} Promise
 */
function save(projectObject) {
	return projectDao.save(projectObject);
}

/**
 * Find by Id.
 * @param id {String} Object id
 * @returns {Promise}
 */
function findById(id) {
	return projectDao.findById(id);
}

