/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 09/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const logger = require('../shared/logger')('[CrashLogService]');
const configurationService = require('./core/configurationService');
const crashLogMapper = require('../mappers/crashLogMapper');
const crashLogDao = require('../dao/crashLogDao');
const projectDao = require('../dao/projectDao');
const userService = require('./userService');
const mailService = require('./mailService');

/* ************************************* */
/* ********        EXPORTS      ******** */
/* ************************************* */

module.exports = {
    saveNewCrashLog,
    save,
    findById,
    findByIdsWithPagination,
    deleteById,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Delete by id.
 * @param id {String} id
 * @returns {*}
 */
function deleteById(id) {
    return new Promise((resolve, reject) => {
        findById(id).then((crashLog) => {
            if (!crashLog) {
                reject(crashLog);
                return;
            }

            // Delete file => Not important to know if it failed
            if (crashLog.upload_file_minidump) {
                const filePath = path.join(configurationService.getAppCrashLogDirectory(),
                    crashLog.upload_file_minidump);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        logger.error(err);
                    }
                });
            }
            // Delete data
            crashLogDao.deleteById(id).then(resolve).catch(reject);
        }).catch(reject);
    });
}

/**
 * Find by ids with pagination.
 * @param ids {Array} ids
 * @param limit {Integer} limit
 * @param skip {Integer} skip
 * @param sort {Object} sort object
 * @returns {*}
 */
function findByIdsWithPagination(ids, limit, skip, sort) {
    return crashLogDao.findByIdsWithPagination(ids, limit, skip, sort);
}

/**
 * Find by id.
 * @param id {String} id
 * @returns {Promise} Promise
 */
function findById(id) {
    return crashLogDao.findById(id);
}

/**
 * Save.
 * @param crashLogObject {Object} CrashLog Object
 * @returns {Promise} Promise
 */
function save(crashLogObject) {
    return crashLogDao.save(crashLogObject);
}

/**
 * Save new crash log.
 * @param crashLogApiData
 * @param projectObject
 * @returns {Promise}
 */
function saveNewCrashLog(crashLogApiData, projectObject) {
    return new Promise((resolve, reject) => {
        // Continue function
        function go() {
            // Build CrashLog object
            const crashLog = crashLogMapper.build(crashLogApiData);

            logger.debug(`Build database object : ${crashLog.toString()}`);

            // Add project to crash log object and other way
            const projectId = projectObject._id;
            crashLog.project = projectId;
            projectObject.crashLogList.push(crashLog._id);

            // Save and update
            const promises = [];
            promises.push(crashLogDao.save(crashLog));
            promises.push(projectDao.save(projectObject));
            Promise.all(promises).then(([crashLogSaved]) => {
                resolve(crashLogSaved);

                // Find user from project
                userService.findUserByProjectId(projectId).then((userInstance) => {
                    // Send email to user if email exists
                    if (userInstance && userInstance.email && !_.isEqual(userInstance.email, '')) {
                        mailService.sendNewCrashLogEmail(userInstance.email, projectObject)
                            .then(logger.debug).catch(logger.error);
                    }
                }).catch(logger.error);
            }).catch((err) => {
                logger.error(err);
                reject(err);
            });
        }

        if (!crashLogApiData.upload_file_minidump) {
            logger.debug('No dump detected => Continue');
            go();
            return;
        }

        const uploadFilePath = path.join(configurationService.getLogUploadDirectory(),
            crashLogApiData.upload_file_minidump);
        const newFilePath = path.join(configurationService.getAppCrashLogDirectory(),
            crashLogApiData.upload_file_minidump);

        // Check if file exist
        fs.exists(uploadFilePath, (isExist) => {
            // Move file if exists
            if (isExist) {
                logger.debug('File exist => move it');

                fs.rename(uploadFilePath, newFilePath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        logger.debug('File moved => Continue');
                        go();
                    }
                });
            } else {
                logger.debug('No file => Continue');
                go();
            }
        });
    });
}
