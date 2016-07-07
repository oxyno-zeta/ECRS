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
const logger = require('./shared/logger');
const api = require('./api/api');
const configurationService = require('./services/configurationService');
const app = express();

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	prepare: prepare,
	listen: listen
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Prepare server.
 */
function prepare(){
	logger.info('Preparing server...');
	// Put express application in place
	app.use(logger.middleware.connectLogger());

	// Put security
	app.use(helmet());

	// Parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }));

	// Parse application/json
	app.use(bodyParser.json());

	// Put api
	app.use(api.expose());
}

/**
 * Listen server.
 */
function listen(){
	logger.info(`Server listening on port : ${configurationService.getPort()}`);
	app.listen(configurationService.getPort());
}
