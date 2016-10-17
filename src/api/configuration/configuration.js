/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 20/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const logger = require('../../shared/logger')('[Configuration API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const configurationService = require('../../services/core/configurationService');
const apiSecurity = require('../core/apiSecurity');

const pathsWithoutSecurity = [
    {
        url: '/configurations/public',
        methods: ['GET'],
    },
];

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    expose,
    pathsWithoutSecurity,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get configuration.
 * @param req
 * @param res
 */
function getConfiguration(req, res) {
    // Add body items
    const configuration = {
        auth: {
            isGithubEnabled: configurationService.auth.github.isEnabled(),
            isLocalEnabled: configurationService.auth.local.isEnabled(),
        },
        isLocalRegisterEnabled: configurationService.isLocalRegisterEnabled(),
        backendUrl: configurationService.getBackendUrl(),
    };

    // Send response
    APIResponse.sendResponse(res, configuration, APICodes.SUCCESS.OK);
}

/**
 * Get all configuration.
 * @param req
 * @param res
 */
function getAllConfiguration(req, res) {
    let configuration = configurationService.getAllConfiguration();
    // Update
    delete configuration.type;

    APIResponse.sendResponse(res, configuration, APICodes.SUCCESS.OK);
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Expose API.
 * @returns {*} Express Router
 */
function expose() {
    logger.debug('Putting configuration API...');
    const router = express.Router();

    router.get('/configurations/public', getConfiguration);
    router.get('/configurations/all', apiSecurity.middleware.populateUser(),
        apiSecurity.middleware.onlyAdministrator(), getAllConfiguration);

    return router;
}
