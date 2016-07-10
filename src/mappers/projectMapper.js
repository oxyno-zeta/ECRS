/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 09/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const {Project} = require('../models/projectModel');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
	formatToApi: formatToApi,
	build: build
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Build.
 * @param data {Object} Project data
 * @returns {*} Project
 */
function build(data){
	return new Project(data);
}

/**
 * Format to API.
 * @param projectObject {Object} Project Object
 * @returns {{name: *, projectUrl: string}}
 */
function formatToApi(projectObject){
	return {
		name: projectObject.name,
		projectUrl: projectObject.url
	};
}
