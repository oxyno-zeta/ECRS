/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 05/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const urlJoin = require('url-join');
const logger = require('../shared/logger')('[API]');
const crashLog = require('./crash-log/crash-log');
const apiAuth = require('./core/apiAuth');
const prefix = '/api/v1/';

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	getPathsWithoutSecurity: getPathsWithoutSecurity,
	expose: expose
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get paths without security.
 * @returns {Array}
 */
function getPathsWithoutSecurity() {
	let pathsWithoutSecurity = [];
	// Prepare
	// Crash log api
	let tmp1 = crashLog.pathsWithoutSecurity.map(function (item) {
		return urlJoin(prefix, item);
	});
	pathsWithoutSecurity = pathsWithoutSecurity.concat(tmp1);
	// Auth api
	let tmp2 = apiAuth.pathsWithoutSecurity.map(function (item) {
		return urlJoin(prefix, item);
	});
	pathsWithoutSecurity = pathsWithoutSecurity.concat(tmp2);

	// Result
	return pathsWithoutSecurity;
}

/**
 * Expose Api.
 * @return {*} Express Router
 */
function expose() {
	logger.debug('Putting API in place...');

	var router = express.Router();

	// Add auth
	router.use(prefix, apiAuth.getRouter());

	// Api without security
	router.use(prefix, crashLog.expose());

	return router;
}
