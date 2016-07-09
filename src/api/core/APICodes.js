/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 09/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********      CONSTANTS      ******** */
/* ************************************* */

// Client errors
const clientErrors = {
	BAD_REQUEST: {
		code: 400,
		reason: 'Bad request'
	},
	NOT_AUTHORIZED: {
		code : 401,
		reason: 'Not Authorized'
	},
	FORBIDDEN: {
		code: 403,
		reason: 'Forbidden'
	},
	NOT_FOUND: {
		code: 404,
		reason: 'Not Found'
	},
	CONFLICT: {
		code: 409,
		reason: 'Conflict'
	}
};

// Server errors
const serverErrors = {
	INTERNAL_ERROR: {
		code: 500,
		reason: 'Internal error'
	}
};

// Normal codes
const normal = {
	OK: {
		code: 200,
		reason: undefined
	},
	CREATED: {
		code: 201,
		reason: undefined
	},
	NO_CONTENT: {
		code: 204,
		reason: undefined
	}
};

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */

module.exports = {
	clientErrors: clientErrors,
	normal: normal,
	serverErrors: serverErrors
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */


