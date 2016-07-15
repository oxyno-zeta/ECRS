/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 15/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const {User} = require('../models/userModel');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	formatToApi: formatToApi,
	build: build
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Build.
 * @param data {Object} User data
 * @returns {*}
 */
function build(data){
	return new User(data);
}

/**
 * Format to api.
 * @param userInstance
 * @returns {{id: *, name: *, email: (*|Person.email|{type, required, index})}}
 */
function formatToApi(userInstance) {
	return {
		id: userInstance._id,
		name: userInstance.name,
		email: userInstance.email
	}
}

