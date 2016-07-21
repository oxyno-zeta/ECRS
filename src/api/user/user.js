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
	let userId = req.user.id;
	let body = APIResponse.getDefaultResponseBody();

	userService.findById(userId).then(function (user) {
		if (_.isNull(user)) {
			APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
			return;
		}

		// Update body
		body.user = userMapper.formatToApi(user);
		APIResponse.sendResponse(res, body, APICodes.SUCCESS.OK);
	}, function (err) {
		logger.error(err);
		APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
	})
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

	router.get('/users/current', getCurrentUser);

	return router;
}

