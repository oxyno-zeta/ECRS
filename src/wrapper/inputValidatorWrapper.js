/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 24/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const isUrl = require('is-url');
const emailValidator = require("email-validator");
const _ = require('lodash');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	isUrlSync: isUrlSync,
	isArraySync: _.isArray,
	isEmailSync: isEmailSync
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Is email sync.
 * @param value {Object} Value to test
 * @param mandatory {Boolean} Is field mandatory
 * @returns {*}
 */
function isEmailSync(value, mandatory) {
	if (_.isUndefined(value) || _.isNull(value)) {
		return !mandatory;
	}

	return emailValidator.validate(value);
}

/**
 * Is Url Sync.
 * @param value {Object} Value to test
 * @param mandatory {Boolean} Is field mandatory
 * @returns {*}
 */
function isUrlSync(value, mandatory) {
	if (_.isUndefined(value) || _.isNull(value)) {
		return !mandatory;
	}

	return isUrl(value);
}
