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

	return router;
}

