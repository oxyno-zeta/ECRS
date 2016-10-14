/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 20/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.technical.service')
        .factory('loginService', loginService);

    /** @ngInject */
    function loginService($cookies, $rootScope, $state, loginDao) {
        var service = {
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            urls: loginDao.urls
        };

        ////////////////

        /* ************************************* */
        /* ********       WATCHER       ******** */
        /* ************************************* */

        $rootScope.$watch(function () {
            return $cookies.get('id_token');
        }, function (newValue, oldValue) {
            if (_.isString(newValue) && _.isUndefined(oldValue)) {
                $rootScope.$broadcast('loginService:update:login');
            }

            if (_.isString(oldValue) && _.isUndefined(newValue)) {
                $rootScope.$broadcast('loginService:update:logout');
            }
        });

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Logout.
         */
        function logout() {
            // Delete cookie name
            $cookies.remove('id_token');

            // Redirect to login page
            $state.go('header.login', {reload: true});
        }

        /**
         * Is logged in.
         * @returns {boolean}
         */
        function isLoggedIn() {
            return !_.isUndefined($cookies.get('id_token'));
        }

        /**
         * Login.
         * @param username {String} Username
         * @param password {String} Password
         * @returns {*}
         */
        function login(username, password) {
            return loginDao.login(username, password);
        }

        return service;
    }

})();
