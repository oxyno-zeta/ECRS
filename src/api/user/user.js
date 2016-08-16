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

	userService.changePassword(user, oldPassword, newPassword).then(function (result) {
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

	router.get('/users/current', apiSecurity.middleware.populateUser(), getCurrentUser);
	router.post('/users/current/password', apiSecurity.middleware.populateUser(), changeCurrentPassword);

	return router;
}

