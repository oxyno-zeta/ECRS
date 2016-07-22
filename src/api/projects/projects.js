/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const _ = require('lodash');
const logger = require('../../shared/logger')('[Projects API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const apiSecurity = require('../core/apiSecurity');
const projectService = require('../../services/projectService');
const userService = require('../../services/userService');
const rolesObj = userService.rolesObj;
const projectMapper = require('../../mappers/projectMapper');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	expose: expose
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

function getProjects(req, res) {
	let body = APIResponse.getDefaultResponseBody();
	let promise = null;
	// Get user
	let user = req.userDb;
	// Check if user is administrator
	if (_.isEqual(user.role, rolesObj.admin)) {
		promise = projectService.findAll();
	}
	else {
		promise = projectService.findByIds(user.projects);
	}

	promise.then(function (results) {
		// Update body
		body.projects = projectMapper.formatListToApi(results);
		APIResponse.sendResponse(res, body, APICodes.SUCCESS.OK);
	}, function (err) {
		logger.error(err);
		APIResponse.sendResponse(req, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
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
	logger.debug('Putting projects API...');
	var router = express.Router();

	router.get('/projects', apiSecurity.middleware.populateUser(), getProjects);

	return router;
}

