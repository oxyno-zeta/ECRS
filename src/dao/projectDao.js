/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 10/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const moment = require('moment');
const {
    Project,
    } = require('../models/projectModel');
const crashLogDao = require('./crashLogDao');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    save,
    findById,
    findByIds,
    findAll,
    findByName,
    statisticsNumberByVersion,
    statisticsNumberByDate,
    statisticsNumberByVersionByDate,
    statisticsNumberByVersionByDateAndStartDate,
    getAllVersions,
    deleteById,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * format Statistics For Number By Version By Date.
 * @param results {Array} Project list
 * @returns {{}}
 */
function formatStatisticsForNumberByVersionByDate(results) {
    const statistics = {};

    results
    // All date to midnight
        .map((item) => {
            const itemUpdated = item;
            // Update date
            itemUpdated.date = moment(item.date).millisecond(0).second(0).minute(0)
                .hours(0)
                .toDate();
            return itemUpdated;
        })
        // Create statistics
        .forEach((item) => {
            const date = item.date.getTime();
            const version = item._version;
            if (_.isUndefined(statistics[version])) {
                statistics[version] = {};
            }

            if (_.isUndefined(statistics[version][date])) {
                statistics[version][date] = 0;
            }
            statistics[version][date] += 1;
        });

    return statistics;
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Delete by id.
 * @param id {String} id
 * @returns {*}
 */
function deleteById(id) {
    return Project.findByIdAndRemove(id);
}

/**
 * Get all versions for project.
 * @param projectId {String} Project id
 * @returns {Promise}
 */
function getAllVersions(projectId) {
    return new Promise((resolve, reject) => {
        crashLogDao.findByProjectId(projectId).then((results) => {
            const versions = [];
            // Add versions
            results.forEach((item) => {
                // Check if exists in array
                if (versions.indexOf(item._version) === -1) {
                    versions.push(item._version);
                }
            });

            resolve(versions);
        }, reject);
    });
}

/**
 * Statistics number by version by date.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @returns {Promise}
 */
function statisticsNumberByVersionByDate(projectId, versions) {
    return new Promise((resolve, reject) => {
        crashLogDao.findAllByProjectIdAndVersions(projectId, versions).then((results) => {
            resolve(formatStatisticsForNumberByVersionByDate(results));
        }, reject);
    });
}

/**
 * Statistics number by version by date.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @param startDate {Integer} Start date (in timestamp ms)
 * @returns {Promise}
 */
function statisticsNumberByVersionByDateAndStartDate(projectId, versions, startDate) {
    return new Promise((resolve, reject) => {
        crashLogDao.findAllByProjectIdAndVersionsAndStartDate(projectId, versions, startDate).then((results) => {
            resolve(formatStatisticsForNumberByVersionByDate(results));
        }, reject);
    });
}

/**
 * Statistics Number By Date
 * @param projectId {String} Project Id
 * @param startDate {Integer} Start date in timestamp (in ms)
 * @returns {Promise}
 */
function statisticsNumberByDate(projectId, startDate) {
    return new Promise((resolve, reject) => {
        crashLogDao.findAllByProjectIdAndStartDate(projectId, startDate).then((results) => {
            const statistics = {};

            results
            // All date to midnight
                .map((item) => {
                    const itemUpdated = item;
                    // Update date
                    itemUpdated.date = moment(item.date).millisecond(0).second(0).minute(0)
                        .hours(0)
                        .toDate();
                    return itemUpdated;
                })
                // Create statistics
                .forEach((item) => {
                    const date = item.date.getTime();
                    if (_.isUndefined(statistics[date])) {
                        statistics[date] = 0;
                    }
                    statistics[date] += 1;
                });

            resolve(statistics);
        }, reject);
    });
}

/**
 * Statistics Number By Version.
 * @param project {Object} Project
 * @returns {Promise}
 */
function statisticsNumberByVersion(project) {
    return new Promise((resolve, reject) => {
        const statistics = {};

        // Check if crashLog list exists or not empty
        if (_.isNull(project.crashLogList) || _.isUndefined(project.crashLogList) ||
            project.crashLogList.length === 0) {
            resolve(statistics);
            return;
        }

        // Find all crash logs
        crashLogDao.findByIds(project.crashLogList).then((crashLogList) => {
            // Separate by version
            crashLogList.forEach((crashLog) => {
                if (_.isUndefined(statistics[crashLog._version])) {
                    statistics[crashLog._version] = 0;
                }
                statistics[crashLog._version] += 1;
            });

            resolve(statistics);
        }).catch(reject);
    });
}

/**
 * Find by name.
 * @param name {String} name
 * @returns {*}
 */
function findByName(name) {
    return Project.findOne({
        name,
    });
}

/**
 * Find all.
 * @returns {*}
 */
function findAll() {
    return Project.find();
}

/**
 * Find by ids.
 * @param ids {Array} Array of id.
 * @returns {Promise}
 */
function findByIds(ids) {
    // Find by id for all ids
    const promises = ids.map(findById);

    // Return all
    return Promise.all(promises);
}

/**
 * Find by Id.
 * @param id {String} Object id
 * @returns {Promise}
 */
function findById(id) {
    return Project.findById(id);
}

/**
 * Save.
 * @param projectObject {Object} Project Object
 * @returns {Promise} Promise
 */
function save(projectObject) {
    return projectObject.save();
}
