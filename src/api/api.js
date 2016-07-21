/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 05/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const express = require('express');
const urlJoin = require('url-join');
const logger = require('../shared/logger')('[API]');
const crashLog = require('./crash-log/crash-log');
const apiAuth = require('./core/apiAuth');
const login = require('./login/login');
const user = require('./user/user');
const configuration = require('./configuration/configuration');
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

/**
 * Map function.
 * @param item
 * @returns {*}
 */
function mapFunction(item) {
	if (_.isString(item)) {
		return urlJoin(prefix, item);
	}

	if (_.isObject(item) && _.isString(item.url)) {
		item.url = urlJoin(prefix, item.url);
	}

	return item;
}

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
	let tmp1 = crashLog.pathsWithoutSecurity.map(mapFunction);
	pathsWithoutSecurity = pathsWithoutSecurity.concat(tmp1);
	// Auth api
	let tmp2 = apiAuth.pathsWithoutSecurity.map(mapFunction);
	pathsWithoutSecurity = pathsWithoutSecurity.concat(tmp2);
	// Login api
	let tmp3 = login.pathsWithoutSecurity.map(mapFunction);
	pathsWithoutSecurity = pathsWithoutSecurity.concat(tmp3);
	// Configuration api
	let tmp4 = configuration.pathsWithoutSecurity.map(mapFunction);
	pathsWithoutSecurity = pathsWithoutSecurity.concat(tmp4);

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

	// Api Crash log
	router.use(prefix, crashLog.expose());

	// Api login
	router.use(prefix, login.expose());

	// Api configuration
	router.use(prefix, configuration.expose());

	// User configuration
	router.use(prefix, user.expose());

	return router;
}
