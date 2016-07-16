/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const expressJwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const configurationService = require('../../services/core/configurationService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	middleware: {
		securityToken: securityToken
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
 * @returns {*}
 */
function securityToken() {
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
	});
}
