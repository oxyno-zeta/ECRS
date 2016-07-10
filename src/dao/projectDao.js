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
	findById: findById
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Find by Id.
 * @param id {String} Object id
 * @returns {Promise}
 */
function findById(id){
	return new Promise(function(resolve, reject){
		Project.findById(id, (err, project) => {
			if (err){
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
function save(projectObject){
	return new Promise(function(resolve, reject){
		projectObject.save((err, project) => {
			if (err){
				reject(err);
			}
			else {
				resolve(project);
			}
		});
	});
}
