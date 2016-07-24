/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 10/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const {Project} = require('../models/projectModel');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	save: save,
	findById: findById,
	findByIds: findByIds,
	findAll: findAll,
	findByName: findByName
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

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
	return new Promise(function (resolve, reject) {
		Project.findById(id, (err, project) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(project);
			}
		});
	});
}

/**
 * Save.
 * @param projectObject {Object} Project Object
 * @returns {Promise} Promise
 */
function save(projectObject) {
	return new Promise(function (resolve, reject) {
		projectObject.save((err, project) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(project);
			}
		});
	});
}
