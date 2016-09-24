/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 05/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const _ = require('lodash');
const logger = require('../../shared/logger')('[Register API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const userService = require('../../services/userService');
const userMapper = require('../../mappers/userMapper');
const configurationService = require('../../services/core/configurationService');

const pathsWithoutSecurity = [
    {
        url: '/register',
        methods: ['POST'],
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
 * Register.
 * @param req
 * @param res
 */
function register(req, res) {
    // Get default response body
    const body = APIResponse.getDefaultResponseBody();

    // Validation
    req.checkBody('username', 'Invalid Username').notEmpty();
    req.checkBody('password', 'Invalid Password').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail(false);

    const errors = req.validationErrors();
    // Check if validation failed
    if (errors) {
        body.errors = errors;
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    //
    const userData = {
        username: req.body.username.toLowerCase(),
        password: req.body.password,
        email: req.body.email.toLowerCase(),
    };

    // Check if username already exists
    userService.findByUsernameForLocal(userData.username).then((userDb) => {
        if (!_.isNull(userDb)) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.CONFLICT);
            return;
        }

        // Ok can be added
        userService.register(userData).then((user) => {
            APIResponse.sendResponse(res, userMapper.formatToApi(user), APICodes.SUCCESS.CREATED);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
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
    logger.debug('Putting Register API...');
    const router = express.Router();

    if (configurationService.isLocalRegisterEnabled()) {
        router.post('/register', register);
    }

    return router;
}
