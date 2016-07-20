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
	function loginService($rootScope, $cookies, loginDao) {
		var service = {
			login: login,
			isLoggedIn: isLoggedIn
		};

		////////////////

		/* ************************************* */
		/* ********        WATCHER      ******** */
		/* ************************************* */

		$rootScope.$watch(function () {
			return $cookies.get('id_token');
		}, function (newValue, oldValue) {
			if (_.isUndefined(newValue) && _.isString(oldValue)) {
				$rootScope.$broadcast('login:cookieDeleted');
			}

			if (_.isString(newValue) && _.isUndefined(oldValue)) {
				$rootScope.$broadcast('login:cookieCreated');
			}
		});

		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

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

