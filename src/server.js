/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var express = require('express');
var helmet = require('helmet');
var api = require('./api/api');
var configurationService = require('./services/configurationService');
var app = express();

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

	// Put api
	app.use(api.expose());
}

/**
 * Listen server.
 */
function listen(){
	app.listen(configurationService.getPort());
}
