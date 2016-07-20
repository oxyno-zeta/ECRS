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
	function loginService(loginDao) {
		var service = {
			login: login
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
		 * Login.
		 * @param username {String} Username
		 * @param password {String} Password
		 * @returns {*}
		 */
		function login(username, password) {
			return loginDao.login(username, password);
		}
	}

})();

