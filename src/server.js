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
	// Put express application in place
	// TODO Configure express logger

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
	app.listen(configurationService.getPort());
}
