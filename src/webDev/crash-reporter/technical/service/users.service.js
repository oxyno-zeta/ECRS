/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.technical.service')
        .factory('usersService', usersService);

    /** @ngInject */
    function usersService(usersDao) {
        var service = {
            getCurrent: getCurrent,
            changeCurrentPassword: changeCurrentPassword,
            changePasswordForUser: changePasswordForUser,
            getAll: getAll,
            remove: remove,
            createUser: createUser,
            getRoles: getRoles,
            updateUser: updateUser,
            updateCurrentEmail: updateCurrentEmail
        };
        return service;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Update current email.
         * @param email {String} email
         * @returns {*}
         */
        function updateCurrentEmail(email) {
            return usersDao.updateCurrentEmail(email);
        }

        /**
         * Update user.
         * @param id {String} id
         * @param data {Object} user data
         * @returns {*}
         */
        function updateUser(id, data) {
            return usersDao.updateUser(id, data);
        }

        /**
         * Get roles.
         * @returns {*}
         */
        function getRoles() {
            return usersDao.getRoles();
        }

        /**
         * Create User.
         * @param userData {Object} user data
         * @returns {*}
         */
        function createUser(userData) {
            return usersDao.createUser(userData);
        }

        /**
         * Remove user from id.
         * @param userId {String} user id
         * @returns {*}
         */
        function remove(userId) {
            return usersDao.remove(userId);
        }

        /**
         * Change password for user.
         * @param user {Object} user
         * @param newPassword {String} new password
         * @returns {*}
         */
        function changePasswordForUser(user, newPassword) {
            return usersDao.changePasswordForUser(user.id, newPassword);
        }

        /**
         * Get all.
         * @param limit {Integer} limit
         * @param skip {Integer} skip
         * @param sort {Object} sort
         */
        function getAll(limit, skip, sort) {
            return usersDao.getAll(limit, skip, sort);
        }

        /**
         * Change Current Password.
         * @param oldPassword {String} old password
         * @param newPassword {String} new password
         * @returns {*}
         */
        function changeCurrentPassword(oldPassword, newPassword) {
            return usersDao.changeCurrentPassword(oldPassword, newPassword);
        }

        /**
         * Get current user.
         * @returns {*}
         */
        function getCurrent() {
            return usersDao.getCurrent();
        }
    }

})();
