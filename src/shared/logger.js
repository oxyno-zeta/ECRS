/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */

const winston = require('winston');
const _ = require('lodash');
const configurationService = require('../services/configurationService');

// Configuration
const configBase = {
	file: {
		filename: 'server.log',
		json: false,
		level: configurationService.getLogLevel()
	},
	console: {
		colorize: true,
		level: configurationService.getLogLevel()
	}
};

// Create logger
const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(_.assignIn({}, configBase.console)),
		new winston.transports.File(_.assignIn({name: 'logs'}, configBase.file))
	],
	exceptionHandlers: [
		new (winston.transports.Console)(_.assignIn({}, configBase.console)),
		new winston.transports.File(_.assignIn({name: 'exceptions'}, configBase.file))
	]
});

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	middleware: {
		connectLogger: connectLogger
	},
	debug: logger.debug,
	info: logger.info,
	error: logger.error,
	warn: logger.warn
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Connect Logger.
 * @returns {Function} Logger Middleware
 */
function connectLogger(){
	// Example taken from log4js
	return function(req, res, next) {

		// Wait for finish to log
		res.on('finish', function () {
			// Default values for some keys
			var default_tokens = {};
			default_tokens[':url'] = req.originalUrl;
			default_tokens[':protocol'] = req.protocol;
			default_tokens[':hostname'] = req.hostname;
			default_tokens[':method'] = req.method;
			default_tokens[':status'] = res.__statusCode || res.statusCode;
			default_tokens[':response-time'] = res.responseTime;
			default_tokens[':date'] = new Date().toUTCString();
			default_tokens[':referrer'] = req.headers.referer || req.headers.referrer || '';
			default_tokens[':http-version'] = req.httpVersionMajor + '.' + req.httpVersionMinor;
			default_tokens[':remote-addr'] =
				req.headers['x-forwarded-for'] ||
				req.ip ||
				req._remoteAddress ||
				(req.socket &&
					(req.socket.remoteAddress ||
						(req.socket.socket && req.socket.socket.remoteAddress)
					)
				);
			default_tokens[':user-agent'] = req.headers['user-agent'];
			default_tokens[':content-length'] = (res._headers && res._headers['content-length']) ||
				(res.__headers && res.__headers['Content-Length']) ||
				'-';

			let logFunction = logger.info;

			// Select log function by status code
			if (res.statusCode) {
				if (res.statusCode >= 300) logFunction = logger.warn;
				if (res.statusCode >= 400) logFunction = logger.error;
			}

			// Template
			let template = `IP: "${default_tokens[':remote-addr']}" "${default_tokens[':method']} ` +
				`${default_tokens[':url']} ${default_tokens[':http-version']}" ${default_tokens[':status']}` +
				`     Protocol:"${default_tokens[':protocol']}" User-agent:"${default_tokens[':user-agent']}"` +
				` Host:"${default_tokens[':hostname']}"`;

			// Log
			logFunction(template);
		});

		// Call next !
		next();
	}
}
