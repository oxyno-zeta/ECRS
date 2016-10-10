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
        callback: '/auth/github/callback',
    },
};
const pathsWithoutSecurity = [
    {
        url: urls.github.main,
        methods: ['GET'],
    },
    {
        url: urls.github.callback,
        methods: ['GET'],
    },
];

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    pathsWithoutSecurity,
    initAuth,
    getRouter,
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
    const time2daysInMs = 172800000;
    // Add cookie
    res.cookie('id_token',
        apiSecurity.encode({
            id: req.user.id,
        }, {
            expiresIn: '2 days',
        }),
        {
            expires: ((new Date()).getTime() + time2daysInMs),
            maxAge: time2daysInMs,
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
    const router = express.Router();

    router.use(passport.initialize());

    if (configurationService.auth.github.isEnabled()) {
        router.get(urls.github.main,
            passport.authenticate('github', {
                scope: ['user:email'],
            }));

        router.get(urls.github.callback,
            passport.authenticate('github', {
                failureRedirect: '/auth/github',
            }), githubCallback);
    }

    return router;
}

/**
 * Initialize auth.
 * @returns {Promise}
 */
function initAuth() {
    return new Promise((resolve) => {
        logger.debug('Begin initialize...');

        // Put Github strategy if Github Oauth enabled
        if (configurationService.auth.github.isEnabled()) {
            const githubStrategy = new GitHubStrategy({
                clientID: configurationService.auth.github.getClientId(),
                clientSecret: configurationService.auth.github.getClientSecret(),
            }, (accessToken, refreshToken, profile, done) => {
                const userData = {
                    githubId: profile.id,
                    username: profile.username,
                    profileUrl: profile.profileUrl,
                    emails: profile.emails,
                    photos: profile.photos,
                    accessToken,
                };
                userService.saveOrUpdateFromGithub(userData).then(result => done(null, result)).catch(done);
            });
            passport.use(githubStrategy);
        }

        // Serialize user
        passport.serializeUser((user, done) => done(null, userMapper.formatToApi(user)));

        // Deserialize user
        passport.deserializeUser((user, done) => done(null, user));

        logger.debug('End initialize');

        // Resolve promise
        resolve();
    });
}

