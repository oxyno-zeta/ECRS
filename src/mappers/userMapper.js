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
function build(data) {
	return new User(data);
}

/**
 * Format to api.
 * @param userInstance
 * @returns {{id: *, username: (*|string), email: (*|Person.email|{type, required, index}), github: {id: *, profileUrl: *}}}
 */
function formatToApi(userInstance) {
	return {
		id: userInstance._id,
		username: userInstance.username,
		email: userInstance.email,
		role: userInstance.role,
		github: {
			id: userInstance.github.id,
			profileUrl: userInstance.github.profileUrl
		}
	}
}

