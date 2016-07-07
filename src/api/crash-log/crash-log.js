/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const multer = require('multer');
const logger = require('../../shared/logger');
const configurationService = require('../../services/configurationService');
const upload = multer({ dest: configurationService.getLogUploadDirectory() });

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
	logger.debug('Putting crash log without security API...');
	var router = express.Router();

	// Post crash log
	router.post('/crash/log', upload.single('upload_file_minidump'), postCrashLog);

	return router;
}
