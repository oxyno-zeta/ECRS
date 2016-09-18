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
const {rolesObj, roles, validation} = require('../models/userModel');
const userDao = require('../dao/userDao');
const securityService = require('./core/securityService');
const mailService = require('./mailService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	rolesObj: rolesObj,
	roles: roles,
	userValidation: validation,
	initialize: initialize,
	saveOrUpdateFromGithub: saveOrUpdateFromGithub,
	findByUsernameForLocal: findByUsernameForLocal,
	localLogin: localLogin,
	findById: findById,
	findAllWithPagination: findAllWithPagination,
	saveForInstance: saveForInstance,
	checkOldPasswordAndChangePassword: checkOldPasswordAndChangePassword,
	changePassword: changePassword,
	countAll: countAll,
	removeById: removeById,
	checkIsUserLastAdministrator: checkIsUserLastAdministrator,
	createNewUser: createNewUser,
	updateUser: updateUser,
	register: register,
	findUserByProjectId: findUserByProjectId
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
	return new Promise(function (resolve, reject) {
		let salt = securityService.generateSaltSync();
		securityService.generateHash(userData.password, salt).then(function (hash) {
			let userDataForBuild = {
				username: userData.username,
				email: userData.email,
				photo: null,
				role: userData.role,
				local: {
					hash: hash,
					salt: salt
				},
				github: {
					accessToken: null,
					id: null,
					profileUrl: null
				}
			};

			let user = userMapper.build(userDataForBuild);
			userDao.save(user).then(resolve).catch(reject);
		}).catch(reject);
	});
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

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
		// Give normal role
		userData.role = rolesObj.normal;
		// Save in database
		createForLocal(userData).then((userInstance) => {
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
	// Apply update
	if (!_.isNull(userData.email) || !_.isUndefined(userData.email)) {
		userInstance.email = userData.email;
	}

	if (!_.isNull(userData.role) || !_.isUndefined(userData.role)) {
		userInstance.role = userData.role;
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
	return new Promise((resolve, reject) => {
		userDao.findOtherAdministrator(user).then((otherAdmin) => {
			resolve(_.isNull(otherAdmin));
		}).catch(reject);
	});
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
	// Create new salt
	let newSalt = securityService.generateSaltSync();
	// Generate Hash
	return securityService.generateHash(newPassword, newSalt).then(function (newHash) {
		user.local.salt = newSalt;
		user.local.hash = newHash;

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
		securityService.compare(oldPassword, user.local.hash, user.local.salt).then(function (isOk) {
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
	return new Promise(function (resolve, reject) {
		findByUsernameForLocal(username).then(function (user) {
			securityService.compare(password, user.local.hash, user.local.salt).then(function (result) {
				if (result) {
					resolve(user);
				}
				else {
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
	return new Promise(function (resolve, reject) {
		logger.debug('Begin initialize...');
		let userData = {
			username: 'admin',
			password: 'admin',
			role: rolesObj.admin
		};

		findByUsernameForLocal(userData.username).then(function (result) {
			if (!_.isNull(result)) {
				logger.debug('User "admin" already exist in database');
				resolve();
				return;
			}

			// Check if need another administrator
			userDao.findAllByRole(rolesObj.admin).then(function (users) {
				// Check there are users with admin role
				if (!_.isNull(users) && users.length !== 0) {
					// There are others admin
					logger.debug('Another user with admin role exists => Don\'t create a new one');
					resolve();
					return;
				}

				// Save new user
				logger.debug('Save admin user in database');
				createForLocal(userData)
					.then(function (result) {
						logger.debug('End initialize...');
						resolve(result);
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
	return new Promise(function (resolve, reject) {
		userDao.findByGithubId(userData.githubId).then(function (result) {
			// Check if user exists in database
			if (_.isUndefined(result) || _.isNull(result)) {
				// Doesn't exists => create new one
				let userDataForBuilder = {
					username: userData.username,
					email: null,
					photo: null,
					role: rolesObj.normal,
					github: {
						id: userData.githubId,
						accessToken: userData.accessToken,
						profileUrl: userData.profileUrl
					},
					local: {
						hash: null,
						salt: null
					}
				};
				// Get email
				if (_.isUndefined(userData.emails) && _.isArray(userData.emails) && userData.emails.length !== 0) {
					userDataForBuilder.email = userData.emails[0].value;
				}
				// Get photo
				if (_.isUndefined(userData.photos) && _.isArray(userData.photos) && userData.photos.length !== 0) {
					userDataForBuilder.photo = userData.photos[0].value;
				}
				// Update result
				result = userMapper.build(userDataForBuilder);
			}
			else {
				// Already exists => need update

				// Update general data
				result.github.accessToken = userData.accessToken;
				result.github.id = userData.githubId;
				result.github.profileUrl = userData.profileUrl;

				if (_.isUndefined(userData.username) || _.isNull(userData.username)) {
					result.username = userData.username;
				}

				// Update email
				if (_.isUndefined(userData.emails) && _.isArray(userData.emails) && userData.emails.length !== 0) {
					result.email = userData.emails[0].value;
				}
				// Update photo
				if (_.isUndefined(userData.photos) && _.isArray(userData.photos) && userData.photos.length !== 0) {
					result.photo = userData.photos[0].value;
				}
			}

			// Save it in database
			userDao.save(result).then(resolve).catch(reject);
		}).catch(reject);
	});
}
