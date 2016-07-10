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
function findById(id){
	return new Promise(function(resolve, reject){
		CrashLog.findById(id, (err, crashLogObject) =>{
			if (err){
				reject(err);
			}
			else {
				resolve(crashLogObject);
			}
		});
	});
}

/**
 * Save.
 * @param crashLogObject {Object} CrashLog Object
 * @returns {Promise} Promise
 */
function save(crashLogObject){
	return new Promise(function(resolve, reject){
		crashLogObject.save((err, crashLog) => {
			if (err){
				reject(err);
			}
			else {
				resolve(crashLog);
			}
		})
	});
}
