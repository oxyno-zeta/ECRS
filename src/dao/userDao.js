/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const {User} = require('../models/userModel');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	save: save,
	findByGithubId: findByGithubId,
	findByUsernameWithLocalHashNotNull: findByUsernameWithLocalHashNotNull,
	findAllByRole: findAllByRole,
	findById: findById,
	findAllWithPagination: findAllWithPagination,
	countAll: countAll
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Count all users.
 * @returns {*}
 */
function countAll() {
	return User.find().count();
}

/**
 * Find all with pagination.
 * @param limit {Integer} limit
 * @param skip {Integer} skip
 * @param sort {Object} sort object
 * @returns {*}
 */
function findAllWithPagination(limit, skip, sort) {
	let promise = User.find();

	if (!_.isUndefined(limit)) {
		promise.limit(limit);
	}

	if (!_.isUndefined(skip)) {
		promise.skip(skip);
	}

	if (!_.isUndefined(sort)) {
		promise.sort(sort);
	}

	return promise;
}

/**
 * Find by id.
 * @param id {String} id
 * @returns {*}
 */
function findById(id) {
	return User.findById(id);
}

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
