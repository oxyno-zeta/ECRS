/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 10/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const logger = require('../shared/logger')('[ProjectService]');
const projectDao = require('../dao/projectDao');
const projectMapper = require('../mappers/projectMapper');
const crashLogService = require('./crashLogService');
const userService = require('./userService');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    findById,
    findByIds,
    findAll,
    findByName,
    create,
    statisticsNumberByVersion,
    statisticsNumberByDate,
    statisticsNumberByVersionByDate,
    statisticsNumberByVersionByDateAndStartDate,
    getAllVersions,
    deleteRecursivelyById,
    deleteRecursivelyByIds,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Delete recursively by ids.
 * @param ids {Array} project ids
 * @returns {Promise}
 */
function deleteRecursivelyByIds(ids) {
    return Promise.all(ids.map(deleteRecursivelyById));
}

/**
 * Delete recursively by id.
 * @param id {String} id
 * @returns {*}
 */
function deleteRecursivelyById(id) {
    return new Promise((resolve, reject) => {
        projectDao.findById(id).then((project) => {
            const promises = [];
            // Add promises
            project.crashLogList.forEach((localId) => {
                promises.push(new Promise((resolveLoop, rejectLoop) => {
                    // Remove from array
                    function removeFromArray() {
                        _.remove(project.crashLogList, id2 => _.isEqual(localId, id2));
                    }

                    crashLogService.deleteById(localId).then(() => {
                        // Success => Remove from array
                        removeFromArray();
                        resolveLoop();
                    }).catch(rejectLoop);
                }));
            });

            Promise.all(promises).then(() => {
                // Remove all crash logs done
                // Remove project now
                projectDao.deleteById(id).then(resolve).catch(reject);
            }).catch((err) => {
                // Continue function
                const goFunction = () => reject(err);

                // Save updated project
                projectDao.save(project).then(goFunction).catch(goFunction);
            });
        }).catch(reject);
    });
}

/**
 * Get all versions for project.
 * @param projectId {String} Project id
 * @returns {Promise}
 */
function getAllVersions(projectId) {
    return projectDao.getAllVersions(projectId);
}

/**
 * Statistics number by version by date.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @returns {Promise}
 */
function statisticsNumberByVersionByDate(projectId, versions) {
    return projectDao.statisticsNumberByVersionByDate(projectId, versions);
}

/**
 * Statistics number by version by date.
 * @param projectId {String} project id
 * @param versions {Array} Versions in array
 * @param startDate {Integer} Start date (in timestamp ms)
 * @returns {Promise}
 */
function statisticsNumberByVersionByDateAndStartDate(projectId, versions, startDate) {
    return projectDao.statisticsNumberByVersionByDateAndStartDate(projectId, versions, startDate);
}

/**
 * Statistics Number By Date
 * @param projectId {String} Project Id
 * @param startDate {Integer} Start date in timestamp (in ms)
 * @returns {Promise}
 */
function statisticsNumberByDate(projectId, startDate) {
    return projectDao.statisticsNumberByDate(projectId, startDate);
}

/**
 * Statistics Number By Version.
 * @param project {Object} Project
 * @returns {Promise}
 */
function statisticsNumberByVersion(project) {
    return projectDao.statisticsNumberByVersion(project);
}

/**
 * Create project.
 * @param data {Object} project data
 * @param userInstance {Object} user instance
 * @returns {Promise}
 */
function create(data, userInstance) {
    return new Promise((resolve, reject) => {
        // Create project instance
        const project = projectMapper.build(data);

        projectDao.save(project).then(() => {
            // Project added in database
            userInstance.projects.push(project._id);
            userService.saveForInstance(userInstance).then(() => {
                resolve(project);
            }).catch((err) => {
                // Need to try to delete project
                projectDao.deleteById(project._id).then(logger.debug).catch(logger.error);
                reject(err);
            });
        }).catch(reject);
    });
}

/**
 * Find by name.
 * @param name {String} name
 * @returns {*}
 */
function findByName(name) {
    return projectDao.findByName(name);
}

/**
 * Find all.
 * @returns {*}
 */
function findAll() {
    return projectDao.findAll();
}

/**
 * Find by ids.
 * @param ids {Array} Array of id.
 * @returns {Promise}
 */
function findByIds(ids) {
    return projectDao.findByIds(ids);
}

/**
 * Find by Id.
 * @param id {String} Object id
 * @returns {Promise}
 */
function findById(id) {
    return projectDao.findById(id);
}

