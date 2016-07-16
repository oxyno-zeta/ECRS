/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/07/16
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
	save: save,
	findFromGithubId: findFromGithubId
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Find From Github id.
 * @param githubId {String} Github id
 * @returns {*}
 */
function findFromGithubId(githubId) {
	return User.findOne({'github.id': githubId});
}

/**
 * Save.
 * @param userInstance {User} User Instance
 * @returns {*|Promise}
 */
function save(userInstance) {
	return userInstance.save();
}
