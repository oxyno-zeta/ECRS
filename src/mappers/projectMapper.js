/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 09/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const {
    Project,
    } = require('../models/projectModel');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    formatToApi,
    formatListToApi,
    build,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Format List to api.
 * @param projectList {Array} Project list
 * @returns {Array}
 */
function formatListToApi(projectList) {
    return projectList.map(formatToApi);
}

/**
 * Build.
 * @param data {Object} Project data
 * @returns {*} Project
 */
function build(data) {
    const cloneData = _.cloneDeep(data);
    if (_.isUndefined(data.projectUrl)) {
        cloneData.projectUrl = null;
    }
    if (_.isUndefined(data.crashLogList)) {
        cloneData.crashLogList = [];
    }
    return new Project(cloneData);
}

/**
 * Format to API.
 * @param projectObject {Object} Project Object
 * @returns {{name: *, projectUrl: string}}
 */
function formatToApi(projectObject) {
    return {
        id: projectObject._id,
        name: projectObject.name,
        projectUrl: projectObject.projectUrl,
    };
}
