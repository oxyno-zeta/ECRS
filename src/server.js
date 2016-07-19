/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 05/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const serveStatic = require('serve-static');
const compression = require('compression');
const logger = require('./shared/logger')('[Server]');
const api = require('./api/api');
const configurationService = require('./services/core/configurationService');
const initializeService = require('./services/core/initializeService');
const apiSecurity = require('./api/core/apiSecurity');
const apiError = require('./api/core/apiError');
const app = express();

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	prepare: prepare,
	listenSync: listenSync
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Prepare server.
 * @returns {Promise} Promise
 */
function prepare() {
	return new Promise(function (resolve, reject) {
		logger.info('Initialize server...');

		initializeService.run().then(function () {
			logger.info('Preparing server...');

			// Put express application in place
			app.use(logger.middleware.connectLogger());

			// Put security
			app.use(helmet());

			// Parse application/x-www-form-urlencoded
			app.use(bodyParser.urlencoded({extended: false}));

			// Parse application/json
			app.use(bodyParser.json());

			// Cookie parser
			app.use(cookieParser());

			// Put compression
			app.use(compression());

			// Static files and views
			app.set('views', __dirname + '/views');
			app.use('/bower_components', serveStatic(__dirname + '/bower_components/'));
			app.use(serveStatic(__dirname + '/views/'));
			
			// Application security
			app.use(apiSecurity.middleware.securityToken(api.getPathsWithoutSecurity()));

			// Put api
			app.use(api.expose());

			// Error cleaner
			app.use(apiError.middleware.errorCleaner());

			resolve();
		}, function (err) {
			logger.error(err);
			reject();
		});
	});
}

/**
 * Listen server.
 */
function listenSync() {
	logger.info(`Server listening on port : ${configurationService.getPort()}`);
	app.listen(configurationService.getPort());
}
