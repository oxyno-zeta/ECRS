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

/**
 * Get all projects.
 * @param req
 * @param res
 */
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
		APIResponse.sendResponse(res, projectMapper.formatListToApi(results), APICodes.SUCCESS.OK);
	}, function (err) {
		logger.error(err);
		APIResponse.sendResponse(req, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
	});
}

/**
 * Create Project.
 * @param req
 * @param res
 */
function create(req, res) {
	// Get default body
	let body = APIResponse.getDefaultResponseBody();
	// Check body
	req.checkBody('name', 'Invalid Name').notEmpty();
	req.checkBody('projectUrl', 'Invalid Project Url').isUrl(false);

	let errors = req.validationErrors();
	// Check if validation failed
	if (errors) {
		body.errors = errors;
		APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
		return;
	}

	let data = {
		name: req.body.name.trim(),
		projectUrl: req.body.projectUrl
	};

	// Check if project name already exist in database
	projectService.findByName(data.name).then(function (result) {
		if (!_.isNull(result)) {
			// Conflict
			APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.CONFLICT);
			return;
		}

		// Create in database
		projectService.create(data).then(function (result) {
			APIResponse.sendResponse(res, projectMapper.formatToApi(result), APICodes.SUCCESS.CREATED);
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
	logger.debug('Putting projects API...');
	var router = express.Router();

	router.get('/projects', apiSecurity.middleware.populateUser(), getProjects);
	router.post('/projects', apiSecurity.middleware.populateUser(), create);

	return router;
}

