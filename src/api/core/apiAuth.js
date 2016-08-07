/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 14/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const logger = require('../../shared/logger')('[Auth API]');
const configurationService = require('../../services/core/configurationService');
const apiSecurity = require('./apiSecurity');
const userService = require('../../services/userService');
const userMapper = require('../../mappers/userMapper');
// Variables
const urls = {
	github: {
		main: '/auth/github',
		callback: '/auth/github/callback'
	}
};
const pathsWithoutSecurity = [
	{
		url: urls.github.main,
		methods: ['GET']
	}, {
		url: urls.github.callback,
		methods: ['GET']
	}
];

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
	pathsWithoutSecurity: pathsWithoutSecurity,
	initAuth: initAuth,
	getRouter: getRouter
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Github callback.
 * @param req
 * @param res
 */
function githubCallback(req, res) {
	let time2daysInMs = 172800000;
	// Add cookie
	res.cookie('id_token',
		apiSecurity.encode({id: req.user.id}, {
			expiresIn: '2 days'
		}),
		{
			expires: ((new Date).getTime() + time2daysInMs),
			maxAge: time2daysInMs
		});
	res.redirect('/');
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get router.
 * @returns {*}
 */
function getRouter() {
	let router = express.Router();

	router.use(passport.initialize());

	if (configurationService.auth.github.isEnabled()) {
		router.get(urls.github.main,
			passport.authenticate('github', {scope: ['user:email']}));

		router.get(urls.github.callback,
			passport.authenticate('github', {failureRedirect: '/auth/github'}), githubCallback);
	}

	return router;
}

/**
 * Initialize auth.
 * @returns {Promise}
 */
function initAuth() {
	return new Promise(function (resolve) {
		logger.debug('Begin initialize...');

		// Put Github strategy if Github Oauth enabled
		if (configurationService.auth.github.isEnabled()) {
			passport.use(new GitHubStrategy({
					clientID: configurationService.auth.github.getClientId(),
					clientSecret: configurationService.auth.github.getClientSecret()
				},
				function (accessToken, refreshToken, profile, done) {
					let userData = {
						githubId: profile.id,
						username: profile.username,
						profileUrl: profile.profileUrl,
						emails: profile.emails,
						photos: profile.photos,
						accessToken: accessToken
					};
					userService.saveOrUpdateFromGithub(userData).then(function (result) {
						done(null, result);
					}, function (err) {
						done(err);
					});
				}
			));
		}

		// Serialize user
		passport.serializeUser(function (user, done) {
			done(null, userMapper.formatToApi(user));
		});

		// Deserialize user
		passport.deserializeUser(function (user, done) {
			done(null, user);
		});

		logger.debug('End initialize');

		// Resolve promise
		resolve();
	});
}

