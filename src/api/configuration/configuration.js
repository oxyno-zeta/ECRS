/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 20/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const _ = require('lodash');
const logger = require('../../shared/logger')('[Configuration API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const configurationService = require('../../services/core/configurationService');
const pathsWithoutSecurity = [
	{
		url: '/configurations',
		methods: ['GET']
	}
];

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	expose: expose,
	pathsWithoutSecurity: pathsWithoutSecurity
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get configuration.
 * @param req
 * @param res
 */
function getConfiguration(req, res) {
	let body = APIResponse.getDefaultResponseBody();
	// Add body items
	let configuration = {
		auth: {
			isGithubEnabled: configurationService.auth.github.isEnabled(),
			isLocalEnabled: configurationService.auth.local.isEnabled()
		},
		isLocalRegisterEnabled: configurationService.isLocalRegisterEnabled()
	};
	body = _.assign(body, configuration);

	// Send response
	APIResponse.sendResponse(res, body, APICodes.SUCCESS.OK);
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Expose API.
 * @returns {*} Express Router
 */
function expose() {
	logger.debug('Putting configuration API...');
	var router = express.Router();

	router.get('/configurations', getConfiguration);

	return router;
}
