/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const _ = require('lodash');
const logger = require('../../shared/logger');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const configurationService = require('../../services/configurationService');
const crashLogService = require('../../services/crashLogService');
const projectService = require('../../services/projectService');
const crashLogMapper = require('../../mappers/crashLogMapper');
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
	// Get default body
	let body = APIResponse.getDefaultResponseBody();
	// Get project Id
	let projectId = req.params.projectId;
	// Check if project id exists
	if (_.isUndefined(projectId) || _.isNull(projectId)){
		APIResponse.sendResponse(res, body, APICodes.clientErrors.BAD_REQUEST);
		// Stop here
		return;
	}

	logger.debug(`Project Id : ${projectId}`);

	// Find Project by id
	projectService.findById(projectId).then(function(project){
		let file = req.file;
		// Create file object if not exists
		if (_.isUndefined(file) || _.isNull(file)) {
			file = {};
		}
		let requestBody = req.body;

		// Update request body
		requestBody.upload_file_minidump = file.filename;

		logger.debug(`File : ${JSON.stringify(file)}`);
		logger.debug(`Body : ${JSON.stringify(requestBody)}`);

		// Continue function
		function go() {
			crashLogService.saveNewCrashLog(requestBody, project).then(function (crashLog) {
				body = _.assignIn(body, crashLogMapper.formatToApi(crashLog));
				APIResponse.sendResponse(res, body, APICodes.normal.CREATED);
			}, function (err) {
				logger.error(err);
				APIResponse.sendResponse(res, body, APICodes.serverErrors.INTERNAL_ERROR);
			});
		}

		if (!_.isUndefined(requestBody.upload_file_minidump) && !_.isNull(requestBody.upload_file_minidump)) {

			let uploadFilePath = path.join(configurationService.getLogUploadDirectory(), requestBody.upload_file_minidump);
			let newFilePath = path.join(configurationService.getAppCrashLogDirectory(), requestBody.upload_file_minidump);

			// Check if file exist
			fs.exists(uploadFilePath, function (isExist) {

				// Move file if exists
				if (isExist) {
					logger.debug('File exist => move it');

					fs.rename(uploadFilePath, newFilePath, function (err) {
						if (err) {
							APIResponse.sendResponse(res, body, APICodes.serverErrors.INTERNAL_ERROR);
						}
						else {
							logger.debug('File moved => Continue');
							go();
						}
					});
				}
				else {
					logger.debug('No file => Continue');
					go();
				}
			});
		}
		else {
			go();
		}
	}, function(err){
		logger.error(err);
		// Send response
		APIResponse.sendResponse(res, body, APICodes.clientErrors.NOT_FOUND);
	});
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
	router.post('/crash/log/:projectId', upload.single('upload_file_minidump'), postCrashLog);

	return router;
}
