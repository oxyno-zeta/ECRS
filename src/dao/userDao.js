/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const _ = require('lodash');
const {
    User,
    rolesObj,
    } = require('../models/userModel');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    save,
    findByGithubId,
    findByUsernameWithLocalHashNotNull,
    findAllByRole,
    findById,
    findAllWithPagination,
    countAll,
    removeById,
    findOtherAdministrator,
    findByProjectId,
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Find by project id.
 * @param projectId {String} Project id
 * @returns {*}
 */
function findByProjectId(projectId) {
    return User.findOne({
        projects: projectId,
    });
}

/**
 * find Other Administrator.
 * @param user {Object} user
 * @returns {*}
 */
function findOtherAdministrator(user) {
    return User.findOne({
        _id: {
            $ne: user._id,
        },
        role: rolesObj.admin,
    });
}

/**
 * Remove by id.
 * @param id {String} User id
 * @returns {*}
 */
function removeById(id) {
    return User.findByIdAndRemove(id);
}

/**
 * Count all users.
 * @returns {*}
 */
function countAll() {
    return User.find().count();
}

/**
 * Find all with pagination.
 * @param limit {Integer} limit
 * @param skip {Integer} skip
 * @param sort {Object} sort object
 * @returns {*}
 */
function findAllWithPagination(limit, skip, sort) {
    const promise = User.find();

    if (limit) {
        promise.limit(limit);
    }

    if (skip) {
        promise.skip(skip);
    }

    if (sort) {
        promise.sort(sort);
    }

    return promise;
}

/**
 * Find by id.
 * @param id {String} id
 * @returns {*}
 */
function findById(id) {
    return User.findById(id);
}

/**
 * Find all by role.
 * @param role {String} role
 * @returns {*}
 */
function findAllByRole(role) {
    return User.find({
        role,
    });
}

/**
 * Find By Username With Local Hash Not Null.
 * @param username {String} Username
 * @returns {*}
 */
function findByUsernameWithLocalHashNotNull(username) {
    return User.findOne({
        username,
        'local.hash': {
            $ne: null,
        },
    });
}

/**
 * Find By Github id.
 * @param githubId {String} Github id
 * @returns {*}
 */
function findByGithubId(githubId) {
    return User.findOne({
        'github.id': githubId,
    });
}

/**
 * Save.
 * @param userInstance {User} User Instance
 * @returns {*|Promise}
 */
function save(userInstance) {
    return userInstance.save();
}
