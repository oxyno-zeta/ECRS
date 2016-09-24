/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 05/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const express = require('express');
const urlJoin = require('url-join');
const logger = require('../shared/logger')('[API]');
const crashLog = require('./crash-log/crash-log');
const apiAuth = require('./core/apiAuth');
const login = require('./login/login');
const user = require('./user/user');
const projects = require('./projects/projects');
const configuration = require('./configuration/configuration');
const register = require('./register/register');

const prefix = '/api/v1/';

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    getPathsWithoutSecurity,
    expose,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Map function.
 * @param item
 * @returns {*}
 */
function mapFunction(item) {
    if (_.isString(item)) {
        return urlJoin(prefix, item);
    }

    const itemUpdated = item;
    if (_.isObject(item) && _.isString(item.url)) {
        itemUpdated.url = urlJoin(prefix, item.url);
    }

    return itemUpdated;
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get paths without security.
 * @returns {Array}
 */
function getPathsWithoutSecurity() {
    let pathsWithoutSecurity = [];
    // Prepare
    // Crash log api
    pathsWithoutSecurity = pathsWithoutSecurity.concat(crashLog.pathsWithoutSecurity.map(mapFunction));
    // Auth api
    pathsWithoutSecurity = pathsWithoutSecurity.concat(apiAuth.pathsWithoutSecurity.map(mapFunction));
    // Login api
    pathsWithoutSecurity = pathsWithoutSecurity.concat(login.pathsWithoutSecurity.map(mapFunction));
    // Configuration api
    pathsWithoutSecurity = pathsWithoutSecurity.concat(configuration.pathsWithoutSecurity.map(mapFunction));
    // Register api
    pathsWithoutSecurity = pathsWithoutSecurity.concat(register.pathsWithoutSecurity.map(mapFunction));

    // Result
    return pathsWithoutSecurity;
}

/**
 * Expose Api.
 * @return {*} Express Router
 */
function expose() {
    logger.debug('Putting API in place...');

    const router = express.Router();

    // Add auth
    router.use(prefix, apiAuth.getRouter());

    // Api Crash log
    router.use(prefix, crashLog.expose());

    // Api login
    router.use(prefix, login.expose());

    // Api register
    router.use(prefix, register.expose());

    // Api configuration
    router.use(prefix, configuration.expose());

    // Api User
    router.use(prefix, user.expose());

    // Api Projects
    router.use(prefix, projects.expose());

    return router;
}
