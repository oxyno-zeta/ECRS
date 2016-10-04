/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const _ = require('lodash');
const logger = require('../../shared/logger')('[Projects API]');
const APIResponse = require('../core/APIResponse');
const APICodes = require('../core/APICodes');
const apiSecurity = require('../core/apiSecurity');
const projectService = require('../../services/projectService');
const userService = require('../../services/userService');

const rolesObj = userService.rolesObj;
const projectMapper = require('../../mappers/projectMapper');
const crashLogMapper = require('../../mappers/crashLogMapper');
const crashLogService = require('../../services/crashLogService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    expose,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get all projects.
 * @param req
 * @param res
 */
function getAllProjects(req, res) {
    const body = APIResponse.getDefaultResponseBody();
    let promise = null;
    // Get user
    const user = req.userDb;
    // Check if user is administrator
    if (_.isEqual(user.role, rolesObj.admin)) {
        promise = projectService.findAll();
    } else {
        promise = projectService.findByIds(user.projects);
    }

    promise.then((results) => {
        APIResponse.sendResponse(res, projectMapper.formatListToApi(results), APICodes.SUCCESS.OK);
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Create Project.
 * @param req
 * @param res
 */
function create(req, res) {
    // Get default body
    const body = APIResponse.getDefaultResponseBody();
    // Check body
    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('projectUrl', 'Not an Url').isUrl(false);

    const errors = req.validationErrors();
    // Check if validation failed
    if (errors) {
        body.errors = errors;
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    const name = req.body.name.trim();
    let projectUrl = req.body.projectUrl;
    // Trim if possible
    if (projectUrl) {
        projectUrl = projectUrl.trim();
    }

    // Check if name exists
    if (!name) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    const data = {
        name,
        projectUrl,
    };

    // Get user
    const user = req.userDb;

    // Check if project name already exist in database
    projectService.findByName(data.name).then((result) => {
        if (result) {
            // Conflict
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.CONFLICT);
            return;
        }

        // Create in database
        projectService.create(data, user).then((result2) => {
            APIResponse.sendResponse(res, projectMapper.formatToApi(result2), APICodes.SUCCESS.CREATED);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Get project.
 * @param req
 * @param res
 */
function getProject(req, res) {
    const body = APIResponse.getDefaultResponseBody();
    // Get project id
    const projectId = req.params.id;

    let promise = null;
    // Get user
    const user = req.userDb;
    // Check if user is administrator
    if (_.isEqual(user.role, rolesObj.admin) || user.projects.indexOf(projectId) !== -1) {
        promise = projectService.findById(projectId);
    }

    // Check if promise exist
    if (!promise) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
        return;
    }

    promise.then((result) => {
        // Check if exists
        if (!result) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        APIResponse.sendResponse(res, projectMapper.formatToApi(result), APICodes.SUCCESS.OK);
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Statistics Number By Version.
 * @param req
 * @param res
 */
function statisticsNumberByVersion(req, res) {
    const body = APIResponse.getDefaultResponseBody();
    // Get project id
    const projectId = req.params.id;

    let promise = null;
    // Get user
    const user = req.userDb;
    // Check if user is administrator
    if (_.isEqual(user.role, rolesObj.admin) || user.projects.indexOf(projectId) !== -1) {
        promise = projectService.findById(projectId);
    }

    // Check if promise exist
    if (!promise) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
        return;
    }

    promise.then((project) => {
        // Check if project exists
        if (!project) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        projectService.statisticsNumberByVersion(project).then((statistics) => {
            APIResponse.sendResponse(res, statistics, APICodes.SUCCESS.OK);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Get all Versions for specific project.
 * @param req
 * @param res
 */
function getAllVersions(req, res) {
    const body = APIResponse.getDefaultResponseBody();
    // Get project id
    const projectId = req.params.id;

    let promise = null;
    // Get user
    const user = req.userDb;
    // Check if user is administrator
    if (_.isEqual(user.role, rolesObj.admin) || user.projects.indexOf(projectId) !== -1) {
        promise = projectService.findById(projectId);
    }

    // Check if promise exist
    if (!promise) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
        return;
    }

    promise.then((project) => {
        // Check if project exists
        if (!project) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        projectService.getAllVersions(projectId).then((versions) => {
            APIResponse.sendArrayResponse(res, versions, APICodes.SUCCESS.OK);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Statistics Number by Date.
 * @param req
 * @param res
 */
function statisticsNumberByDate(req, res) {
    const body = APIResponse.getDefaultResponseBody();

    // Check Query
    req.checkQuery('startDate', 'Invalid Start Date (not timestamp)').isInt();

    const errors = req.validationErrors();
    // Check if validation failed
    if (errors) {
        body.errors = errors;
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    // Get project id
    const projectId = req.params.id;
    // Get start date
    const startDate = req.query.startDate;

    let promise = null;
    // Get user
    const user = req.userDb;
    // Check if user is administrator
    if (_.isEqual(user.role, rolesObj.admin) || user.projects.indexOf(projectId) !== -1) {
        promise = projectService.findById(projectId);
    }

    // Check if promise exist
    if (!promise) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
        return;
    }

    promise.then((project) => {
        // Check if project exists
        if (!project) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        projectService.statisticsNumberByDate(projectId, startDate).then((statistics) => {
            APIResponse.sendResponse(res, statistics, APICodes.SUCCESS.OK);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Statistics number by version by date.
 * @param req
 * @param res
 */
function statisticsNumberByVersionByDate(req, res) {
    const body = APIResponse.getDefaultResponseBody();
    // Get versions
    let versions = req.query.versions;

    // Check if it is a String
    if (_.isString(versions)) {
        versions = [versions];
    }

    // Check if it is array
    if (!_.isArray(versions)) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
        return;
    }

    // Get start date
    let startDate = req.query.startDate;
    // Change type if necessary
    if (!(_.isUndefined(startDate) || _.isNull(startDate)) && !_.isInteger(startDate)) {
        startDate = _.parseInt(startDate);

        // Check if it is int only if startDate exists
        if (!_.isInteger(startDate)) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.BAD_REQUEST);
            return;
        }
    }

    // Get project id
    const projectId = req.params.id;

    let promise = null;
    // Get user
    const user = req.userDb;
    // Check if user is administrator
    if (_.isEqual(user.role, rolesObj.admin) || user.projects.indexOf(projectId) !== -1) {
        promise = projectService.findById(projectId);
    }

    // Check if promise exist
    if (!promise) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
        return;
    }

    promise.then((project) => {
        // Check if project exists
        if (!project) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        if (!startDate) {
            promise = projectService.statisticsNumberByVersionByDate(projectId, versions);
        } else {
            promise = projectService.statisticsNumberByVersionByDateAndStartDate(projectId, versions, startDate);
        }

        promise.then((statistics) => {
            APIResponse.sendResponse(res, statistics, APICodes.SUCCESS.OK);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Get project crash logs.
 * @param req
 * @param res
 */
function getProjectCrashLogs(req, res) {
    const body = APIResponse.getDefaultResponseBody();
    // Get project id
    const projectId = req.params.id;

    let promise = null;
    // Get user
    const user = req.userDb;
    // Check if user is administrator
    if (_.isEqual(user.role, rolesObj.admin) || user.projects.indexOf(projectId) !== -1) {
        promise = projectService.findById(projectId);
    }

    // Check if promise exist
    if (promise) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
        return;
    }

    // Get pagination element
    let limit = req.query.limit;
    if (limit && _.isString(limit)) {
        limit = _.parseInt(limit);
    }
    let skip = req.query.skip;
    if (skip && _.isString(skip)) {
        skip = _.parseInt(skip);
    }
    let sort = req.query.sort;
    if (!_.isUndefined(sort)) {
        if (_.isString(sort)) {
            try {
                sort = JSON.parse(sort);
            } catch (e) {
                sort = {};
            }
        }
        if (_.isObject(sort)) {
            // Transform id key
            if (Object.prototype.hasOwnProperty.call(sort, 'id')) {
                sort._id = sort.id;
                delete sort.id;
            }
        }
    }

    promise.then((result) => {
        // Check if exists
        if (result) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        crashLogService.findByIdsWithPagination(result.crashLogList, limit, skip, sort).then((crashLogList) => {
            APIResponse.sendResponse(res, {
                total: result.crashLogList.length,
                items: crashLogMapper.formatListToApi(crashLogList),
            }, APICodes.SUCCESS.OK);
        }).catch((err) => {
            logger.error(err);
            APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
        });
    }).catch((err) => {
        logger.error(err);
        APIResponse.sendResponse(res, body, APICodes.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    });
}

/**
 * Delete Project.
 * @param req
 * @param res
 */
function deleteProject(req, res) {
    const body = APIResponse.getDefaultResponseBody();
    // Get project id
    const projectId = req.params.id;

    let promise = null;
    // Get user
    const user = req.userDb;
    // Check if user is administrator
    if (_.isEqual(user.role, rolesObj.admin) || user.projects.indexOf(projectId) !== -1) {
        promise = projectService.findById(projectId);
    }

    // Check if promise exist
    if (promise) {
        APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.FORBIDDEN);
        return;
    }

    promise.then((result) => {
        // Check if exists
        if (result) {
            APIResponse.sendResponse(res, body, APICodes.CLIENT_ERROR.NOT_FOUND);
            return;
        }

        projectService.deleteRecursivelyById(projectId).then(() => {
            APIResponse.sendResponse(res, null, APICodes.SUCCESS.NO_CONTENT);
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
    logger.debug('Putting projects API...');
    const router = express.Router();

    router.get('/projects', apiSecurity.middleware.populateUser(), getAllProjects);
    router.post('/projects', apiSecurity.middleware.populateUser(), create);
    router.get('/projects/:id/versions', apiSecurity.middleware.populateUser(), getAllVersions);
    router.get('/projects/:id', apiSecurity.middleware.populateUser(), getProject);
    router.delete('/projects/:id', apiSecurity.middleware.populateUser(), deleteProject);
    router.get('/projects/:id/crash-logs', apiSecurity.middleware.populateUser(), getProjectCrashLogs);
    // Statistics
    router.get('/projects/:id/statistics/number/version', apiSecurity.middleware.populateUser(),
        statisticsNumberByVersion);
    router.get('/projects/:id/statistics/number/date', apiSecurity.middleware.populateUser(), statisticsNumberByDate);
    router.get('/projects/:id/statistics/number/version/date', apiSecurity.middleware.populateUser(),
        statisticsNumberByVersionByDate);

    return router;
}

