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
const logger = require('../../shared/logger')('[Login API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const userService = require('../../services/userService');
const userMapper = require('../../mappers/userMapper');
const apiSecurity = require('../core/apiSecurity');
const pathsWithoutSecurity = ['/login'];

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	expose: expose,
	pathsWithoutSecurity: pathsWithoutSecurity
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Login.
 * @param req
 * @param res
 */
function login(req, res) {
	// Get default body
	let body = APIResponse.getDefaultResponseBody();
	// Check body
	req.checkBody('username', 'Invalid Username').notEmpty();
	req.checkBody('password', 'Invalid Password').notEmpty();
	let errors = req.validationErrors();
	// Check if validation failed
	if (errors) {
		body.errors = errors;
		APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
		return;
	}

	// Validation succeed => next
	let username = req.body.username;
	let password = req.body.password;

	// Search user in database
	userService.findByUsernameForLocal(username).then(function (user) {
		if (_.isNull(user)) {
			// User not found in database
			APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.UNAUTHORIZED);
			return;
		}

		// Do the login part.
		userService.localLogin(username, password).then(function (user) {
			if (_.isNull(user)) {
				APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.UNAUTHORIZED);
				return;
			}

			let time2daysInMs = 172800000;
			res.cookie('id_token',
				apiSecurity.encode({id: user.id}, {
					expiresIn: '2 days'
				}),
				{
					expires: ((new Date).getTime() + time2daysInMs),
					maxAge: time2daysInMs
				});
			// Update body
			body.user = userMapper.formatToApi(user);
			APIResponse.sendResponse(res, body, APICodes.SUCCESS.OK);
		}, function (err) {
			logger.error(err);
			APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
		});
	}, function (err) {
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
	logger.debug('Putting user API...');
	var router = express.Router();

	router.post('/login', login);

	return router;
}

