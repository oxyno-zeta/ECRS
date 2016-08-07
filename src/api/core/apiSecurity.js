/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const expressJwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const APIResponse = require('./APIResponse');
const APICodes = require('./APICodes');
const configurationService = require('../../services/core/configurationService');
const userService = require('../../services/userService');
const logger = require('../../shared/logger')('[API Security]');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	middleware: {
		securityToken: securityToken,
		populateUser: populateUser
	},
	encode: encode
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Populate user middleware (Must be placed after token middleware).
 * @returns {Function}
 */
function populateUser() {
	return function (req, res, next) {
		let userId = req.user.id;
		let body = APIResponse.getDefaultResponseBody();

		userService.findById(userId).then(function (user) {
			if (_.isNull(user)) {
				// User not found in database
				APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.UNAUTHORIZED);
				return;
			}

			// Next
			req.userDb = user;
			next();
		}).catch(function (err) {
			logger.error(err);
			APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
		});
	};
}

/**
 * Encode data.
 * @param data {Object} Data to encode
 * @param options {Object} Options
 * @returns {*}
 */
function encode(data, options = {}) {
	return jsonwebtoken.sign(data, configurationService.auth.getJwtSecret(), options);
}

/**
 * Security Token.
 * @param pathsWithoutSecurity {Array} Paths Without Security
 * @returns {*}
 */
function securityToken(pathsWithoutSecurity) {
	return expressJwt({
		secret: configurationService.auth.getJwtSecret(),
		getToken: function (req) {
			if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
				return req.headers.authorization.split(' ')[1];
			} else if (req.cookies && req.cookies.id_token) {
				return req.cookies.id_token;
			}
			return null;
		}
	}).unless({path: pathsWithoutSecurity});
}
