/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const _ = require('lodash');
const logger = require('../../shared/logger')('[Users API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const apiSecurity = require('../core/apiSecurity');
const userService = require('../../services/userService');
const userMapper = require('../../mappers/userMapper');
const rolesObj = userService.rolesObj;

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	expose: expose
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get current user.
 * @param req
 * @param res
 */
function getCurrentUser(req, res) {
	let user = req.userDb;
	APIResponse.sendResponse(res, userMapper.formatToApi(user), APICodes.SUCCESS.OK);
}

/**
 * Change password for current user.
 * @param req
 * @param res
 * @param next
 */
function changeCurrentPassword(req, res, next) {
	// Get default body
	let body = APIResponse.getDefaultResponseBody();
	// Get user
	let user = req.userDb;

	// Check if current user is a local user
	if (!(user.local && user.local.hash)) {
		// Not a local user => Forbidden
		APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
		return;
	}

	// Check body
	req.checkBody('oldPassword', 'Invalid Old password').notEmpty();
	req.checkBody('newPassword', 'Invalid new password').notEmpty();

	let errors = req.validationErrors();
	// Check if validation failed
	if (errors) {
		body.errors = errors;
		APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
		return;
	}

	// Get data
	let oldPassword = req.body.oldPassword;
	let newPassword = req.body.newPassword;

	userService.checkOldPasswordAndChangePassword(user, oldPassword, newPassword).then(function (result) {
		APIResponse.sendResponse(res, userMapper.formatToApi(result), APICodes.SUCCESS.OK);
	}).catch(function (err) {
		if (err && err.message === 'Wrong old password') {
			// Forbidden
			body.message = err.message;
			APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
			return;
		}

		next(err);
	});
}

/**
 * Get users.
 * @param req
 * @param res
 */
function getUsers(req, res) {
	let body = APIResponse.getDefaultResponseBody();

	// Get pagination element
	let limit = req.query.limit;
	if (!_.isUndefined(limit)) {
		if (_.isString(limit)) {
			limit = _.parseInt(limit);
		}
	}
	let skip = req.query.skip;
	if (!_.isUndefined(skip)) {
		if (_.isString(skip)) {
			skip = _.parseInt(skip);
		}
	}
	let sort = req.query.sort;
	if (!_.isUndefined(sort)) {
		if (_.isString(sort)) {
			try {
				sort = JSON.parse(sort);
			}
			catch (e) {
				sort = {};
			}
		}
		if (_.isObject(sort)) {
			// Transform id key
			if (sort.hasOwnProperty('id')) {
				sort._id = sort.id;
				delete sort.id;
			}
		}
	}

	let promises = [];
	promises.push(userService.findAllWithPagination(limit, skip, sort));
	promises.push(userService.countAll());

	Promise.all(promises).then(function ([all, count]) {
		APIResponse.sendResponse(res, {
			total: count,
			items: userMapper.formatListToApi(all)
		}, APICodes.SUCCESS.OK);
	}).catch(function (err) {
		logger.error(err);
		APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
	});
}

/**
 * Change password.
 * @param req
 * @param res
 */
function changePassword(req, res) {
	let body = APIResponse.getDefaultResponseBody();

	// Validation
	req.checkBody('newPassword', 'Invalid new password').notEmpty();

	let errors = req.validationErrors();
	// Check if validation failed
	if (errors) {
		body.errors = errors;
		APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
		return;
	}

	// Get data
	let newPassword = req.body.newPassword;

	// Get user id
	let userId = req.params.id;
	// Get user from database
	userService.findById(userId).then(function (user) {
		// Check if user exists
		if (_.isNull(user)) {
			// User not found in database
			APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
			return;
		}

		// Check if current user is a local user
		if (!(user.local && user.local.hash)) {
			// Not a local user => Forbidden
			APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
			return;
		}

		userService.changePassword(user, newPassword).then(function () {
			APIResponse.sendResponse(res, userMapper.formatToApi(user), APICodes.SUCCESS.OK);
		}).catch(function (err) {
			logger.error(err);
			APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
		});
	}).catch(function (err) {
		logger.error(err);
		APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
	});
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Expose API.
 * @returns {*} Express Router
 */
function expose() {
	logger.debug('Putting users API...');
	var router = express.Router();

	router.get('/users', apiSecurity.middleware.populateUser(), apiSecurity.middleware.onlyAdministrator(), getUsers);
	router.get('/users/current', apiSecurity.middleware.populateUser(), getCurrentUser);
	router.put('/users/current/password', apiSecurity.middleware.populateUser(), changeCurrentPassword);
	router.put('/users/:id/password', apiSecurity.middleware.populateUser(),
		apiSecurity.middleware.onlyAdministrator(), changePassword);

	return router;
}

