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
	findByGithubId: findByGithubId,
	findByUsernameWithLocalHashNotNull: findByUsernameWithLocalHashNotNull,
	findAllByRole: findAllByRole
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Find all by role.
 * @param role {String} role
 * @returns {*}
 */
function findAllByRole(role) {
	return User.find({role: role});
}

/**
 * Find By Username With Local Hash Not Null.
 * @param username {String} Username
 * @returns {*}
 */
function findByUsernameWithLocalHashNotNull(username) {
	return User.findOne({username: username, 'local.hash': {$ne: null}});
}

/**
 * Find By Github id.
 * @param githubId {String} Github id
 * @returns {*}
 */
function findByGithubId(githubId) {
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
