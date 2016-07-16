/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const userMapper = require('../mappers/userMapper');
const userDao = require('../dao/userDao');
const logger = require('../shared/logger')('[UserService]');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	saveOrUpdateFromGithub: saveOrUpdateFromGithub
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Save or Update from Github.
 * @param userData {Object} User data from Github
 * @returns {Promise}
 */
function saveOrUpdateFromGithub(userData) {
	return new Promise(function (resolve, reject) {
		userDao.findFromGithubId(userData.githubId).then(function (result) {
			// Check if user exists in database
			if (_.isUndefined(result) || _.isNull(result)) {
				// Doesn't exists => create new one
				let userDataForBuilder = {
					username: userData.username,
					github: {
						id: userData.githubId,
						accessToken: userData.accessToken,
						profileUrl: userData.profileUrl
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
				result.username = userData.username;

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
			userDao.save(result).then(resolve, reject);
		}, reject);
	});
}
