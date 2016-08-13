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
const serveStatic = require('serve-static');
const logger = require('../../shared/logger')('[CrashLog API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const configurationService = require('../../services/core/configurationService');
const crashLogService = require('../../services/crashLogService');
const projectService = require('../../services/projectService');
const upload = multer({
	dest: configurationService.getLogUploadDirectory(),
	limits: {
		fileSize: 2 * 1000 * 1000 // 2 Mb
	}
});
const pathsWithoutSecurity = [
	{
		url: /.*crash-logs\/.*/ig,
		methods: ['POST']
	}
];

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	expose: expose,
	pathsWithoutSecurity: pathsWithoutSecurity
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Post Crash log.
 * @param req {Object} Request
 * @param res {Object} Response
 */
function postCrashLog(req, res) {
	// Get default body
	let body = APIResponse.getDefaultResponseBody();
	// Get project Id
	let projectId = req.params.projectId;
	// Check if project id exists
	if (_.isUndefined(projectId) || _.isNull(projectId)) {
		APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
		// Stop here
		return;
	}

	logger.debug(`Project Id : ${projectId}`);

	// Find Project by id
	projectService.findById(projectId).then(function (project) {
		// Check if project exists in database
		if (_.isUndefined(project) || _.isNull(project)) {
			// Send response
			APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
			return;
		}

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
				APIResponse.sendTextResponse(res, crashLog._id, APICodes.SUCCESS.CREATED);
			}).catch(function (err) {
				logger.error(err);
				APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
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
							APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
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
	}).catch(function (err) {
		logger.error(err);
		// Send response
		APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
	});
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Expose API.
 * @returns {*} Express Router
 */
function expose() {
	logger.debug('Putting crash log API...');
	var router = express.Router();

	// Post crash log
	router.post('/crash-logs/projects/:projectId', upload.single('upload_file_minidump'), postCrashLog);
	// Download crash log (with upload_file_dump id)
	router.use('/crash-logs/downloads/', serveStatic(configurationService.getAppCrashLogDirectory(), {
		fallthrough: false
	}));

	return router;
}
