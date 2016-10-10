/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const _ = require('lodash');
const logger = require('../../shared/logger')('[Login API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const userService = require('../../services/userService');
const userMapper = require('../../mappers/userMapper');
const apiSecurity = require('../core/apiSecurity');
const configurationService = require('../../services/core/configurationService');

const pathsWithoutSecurity = [
    {
        url: '/login',
        methods: ['POST'],
    },
];

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    expose,
    pathsWithoutSecurity,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Login.
 * @param req
 * @param res
 */
function login(req, res) {
    // Get default body
    const body = APIResponse.getDefaultResponseBody();
    // Check body
    req.checkBody('username', 'Username Empty').notEmpty();
    req.checkBody('password', 'Password Empty').notEmpty();
    req.checkBody('username', 'Username too short')
        .stringHasMinLength(userService.userValidation.username.minLength);
    req.checkBody('password', 'Password too short')
        .stringHasMinLength(userService.userValidation.localPassword.minLength);
    const errors = req.validationErrors();
    // Check if validation failed
    if (errors) {
        body.errors = errors;
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    // Validation succeed => next
    const username = req.body.username.toLowerCase().trim();
    const password = req.body.password.trim();

    // Search user in database
    userService.findByUsernameForLocal(username).then((user) => {
        if (!user) {
            // User not found in database
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.UNAUTHORIZED);
            return;
        }

        // Do the login part.
        userService.localLogin(username, password).then((loggedUser) => {
            if (!loggedUser) {
                APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.UNAUTHORIZED);
                return;
            }

            const time2daysInMs = 172800000;
            res.cookie('id_token',
                apiSecurity.encode({
                    id: loggedUser._id,
                }, {
                    expiresIn: '2 days',
                }),
                {
                    expires: ((new Date()).getTime() + time2daysInMs),
                    maxAge: time2daysInMs,
                });
            APIResponse.sendResponse(res, userMapper.formatToApi(loggedUser), APICodes.SUCCESS.OK);
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
    logger.debug('Putting Login API...');
    const router = express.Router();

    if (configurationService.auth.local.isEnabled()) {
        router.post('/login', login);
    }

    return router;
}

