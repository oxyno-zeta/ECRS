/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const logger = require('../shared/logger')('[UserService]');
const userMapper = require('../mappers/userMapper');
const {
    rolesObj, roles, validation,
    } = require('../models/userModel');
const userDao = require('../dao/userDao');
const securityService = require('./core/securityService');
const mailService = require('./mailService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    userValidation: validation,
    rolesObj,
    roles,
    initialize,
    saveOrUpdateFromGithub,
    findByUsernameForLocal,
    localLogin,
    findById,
    findAllWithPagination,
    saveForInstance,
    checkOldPasswordAndChangePassword,
    changePassword,
    countAll,
    removeById,
    checkIsUserLastAdministrator,
    createNewUser,
    updateUser,
    register,
    findUserByProjectId,
    updateEmail,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Create for local user.
 * @param userData {Object} User data
 * @returns {Promise}
 */
function createForLocal(userData) {
    return new Promise((resolve, reject) => {
        const salt = securityService.generateSaltSync();
        securityService.generateHash(userData.password, salt).then((hash) => {
            const userDataForBuild = {
                username: userData.username,
                email: userData.email,
                photo: null,
                role: userData.role,
                local: {
                    hash,
                    salt,
                },
                github: {
                    accessToken: null,
                    id: null,
                    profileUrl: null,
                },
            };

            const user = userMapper.build(userDataForBuild);
            userDao.save(user).then(resolve).catch(reject);
        }).catch(reject);
    });
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Update email.
 * @param userInstance {Object} user instance
 * @param email {String} email
 * @returns {*|Promise}
 */
function updateEmail(userInstance, email) {
    const userInstanceUpdated = userInstance;
    // Update email
    userInstanceUpdated.email = email;
    // Save update
    return userDao.save(userInstanceUpdated);
}

/**
 * Find user by project id.
 * @param projectId {String} project id
 * @returns {*}
 */
function findUserByProjectId(projectId) {
    return userDao.findByProjectId(projectId);
}

/**
 * Register.
 * @param userData {Object} user data
 * @returns {Promise}
 */
function register(userData) {
    return new Promise((resolve, reject) => {
        const userDataObject = userData;
        // Give normal role
        userDataObject.role = rolesObj.normal;
        // Save in database
        createForLocal(userDataObject).then((userInstance) => {
            // Resolve
            resolve(userInstance);

            // Send email if user has email
            // Don't need to wait email sending (backend task)
            if (userInstance.email && !_.isEqual(userInstance.email, '')) {
                mailService.sendRegisterEmail(userInstance.email).then(logger.debug).catch(logger.error);
            }
        }).catch(reject);
    });
}

/**
 * Update user.
 * @param userInstance {Object} user instance
 * @param userData {Object} user data
 * @returns {*|Promise}
 */
function updateUser(userInstance, userData) {
    const userInstanceUpdated = userInstance;
    // Apply update
    if (userData.email) {
        userInstanceUpdated.email = userData.email;
    }

    if (userData.role) {
        userInstanceUpdated.role = userData.role;
    }

    return userDao.save(userInstance);
}

/**
 * Create new user.
 * @param userData {Object} user data
 * @returns {Promise}
 */
function createNewUser(userData) {
    return createForLocal(userData);
}

/**
 * Check is user last administrator
 * @param user {Object} user
 * @returns {Promise}
 */
function checkIsUserLastAdministrator(user) {
    return new Promise((resolve, reject) => (
        userDao.findOtherAdministrator(user).then(otherAdmin => resolve(_.isNull(otherAdmin))).catch(reject)
    ));
}

/**
 * Remove by id.
 * @param id {String} User id
 * @returns {*}
 */
function removeById(id) {
    return userDao.removeById(id);
}

/**
 * Count all users.
 * @returns {*}
 */
function countAll() {
    return userDao.countAll();
}

/**
 * Find all with pagination.
 * @param limit {Integer} limit
 * @param skip {Integer} skip
 * @param sort {Object} sort object
 * @returns {*}
 */
function findAllWithPagination(limit, skip, sort) {
    return userDao.findAllWithPagination(limit, skip, sort);
}

/**
 * Change password for a user.
 * @param user {Object} User
 * @param newPassword {String} new password
 * @returns {Promise}
 */
function changePassword(user, newPassword) {
    const userInstance = user;
    // Create new salt
    const newSalt = securityService.generateSaltSync();
    // Generate Hash
    return securityService.generateHash(newPassword, newSalt).then((newHash) => {
        userInstance.local.salt = newSalt;
        userInstance.local.hash = newHash;

        // Save new user data
        return userDao.save(user);
    });
}

/**
 * Check old password and change password for a user.
 * @param user {Object} User
 * @param oldPassword {String} old password
 * @param newPassword {String} new password
 * @returns {Promise}
 */
function checkOldPasswordAndChangePassword(user, oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
        securityService.compare(oldPassword, user.local.hash, user.local.salt).then((isOk) => {
            if (!isOk) {
                throw new Error('Wrong old password');
            }

            // Save new password
            changePassword(user, newPassword).then(resolve).catch(reject);
        }).catch(reject);
    });
}

/**
 * Save for instance.
 * @param userInstance {Object} user instance
 * @returns {*|Promise}
 */
function saveForInstance(userInstance) {
    return userDao.save(userInstance);
}

/**
 * Find by id.
 * @param id {String} id
 * @returns {*}
 */
function findById(id) {
    return userDao.findById(id);
}

/**
 * Local login.
 * @param username {String} Username
 * @param password {String} Password
 * @returns {Promise}
 */
function localLogin(username, password) {
    return new Promise((resolve, reject) => {
        findByUsernameForLocal(username).then((user) => {
            securityService.compare(password, user.local.hash, user.local.salt).then((result) => {
                if (result) {
                    resolve(user);
                } else {
                    resolve(null);
                }
            }).catch(reject);
        }).catch(reject);
    });
}

/**
 * Find by username for local.
 * @param username {String} username
 * @returns {*}
 */
function findByUsernameForLocal(username) {
    return userDao.findByUsernameWithLocalHashNotNull(username);
}

/**
 * Initialize.
 * @returns {Promise}
 */
function initialize() {
    return new Promise((resolve, reject) => {
        logger.debug('Begin initialize...');
        const userData = {
            username: 'admin',
            password: 'admin',
            role: rolesObj.admin,
        };

        findByUsernameForLocal(userData.username).then((result) => {
            if (result) {
                logger.debug('User "admin" already exist in database');
                resolve();
                return;
            }

            // Check if need another administrator
            userDao.findAllByRole(rolesObj.admin).then((users) => {
                // Check there are users with admin role
                if (users && users.length !== 0) {
                    // There are others admin
                    logger.debug('Another user with admin role exists => Don\'t create a new one');
                    resolve();
                    return;
                }

                // Save new user
                logger.debug('Save admin user in database');
                createForLocal(userData)
                    .then((result2) => {
                        logger.debug('End initialize...');
                        resolve(result2);
                    }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    });
}

/**
 * Save or Update from Github.
 * @param userData {Object} User data from Github
 * @returns {Promise}
 */
function saveOrUpdateFromGithub(userData) {
    return new Promise((resolve, reject) => {
        userDao.findByGithubId(userData.githubId).then((result) => {
            let userInDatabase = result;
            // Check if user exists in database
            if (_.isUndefined(userInDatabase) || _.isNull(userInDatabase)) {
                // Doesn't exists => create new one
                const userDataForBuilder = {
                    username: userData.username,
                    email: null,
                    photo: null,
                    role: rolesObj.normal,
                    github: {
                        id: userData.githubId,
                        accessToken: userData.accessToken,
                        profileUrl: userData.profileUrl,
                    },
                    local: {
                        hash: null,
                        salt: null,
                    },
                };
                // Get email
                if (userData.emails && _.isArray(userData.emails) && userData.emails.length !== 0) {
                    userDataForBuilder.email = userData.emails[0].value;
                }
                // Get photo
                if (userData.photos && _.isArray(userData.photos) && userData.photos.length !== 0) {
                    userDataForBuilder.photo = userData.photos[0].value;
                }
                // Update result
                userInDatabase = userMapper.build(userDataForBuilder);
            } else {
                // Already exists => need update

                // Update general data
                userInDatabase.github.accessToken = userData.accessToken;
                userInDatabase.github.id = userData.githubId;
                userInDatabase.github.profileUrl = userData.profileUrl;

                if (userData.username) {
                    userInDatabase.username = userData.username;
                }

                // Update email
                if (userData.emails && _.isArray(userData.emails) && userData.emails.length !== 0) {
                    userInDatabase.email = userData.emails[0].value;
                }
                // Update photo
                if (userData.photos && _.isArray(userData.photos) && userData.photos.length !== 0) {
                    userInDatabase.photo = userData.photos[0].value;
                }
            }

            // Save it in database
            userDao.save(userInDatabase).then(resolve).catch(reject);
        }).catch(reject);
    });
}
