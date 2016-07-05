/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var express = require('express');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	withoutSecurity: {
		expose: exposeWithoutSecurity
	}
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Post Crash log.
 * @param req {Object} Request
 * @param res {Object} Response
 */
function postCrashLog(req, res){

}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Expose API without security.
 * @returns {*} Express Router
 */
function exposeWithoutSecurity(){
	var router = express.Router();

	// Post crash log
	router.post('/crash/log', postCrashLog);

	return router;
}
