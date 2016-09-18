/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 13/09/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical.service')
		.factory('registerService', registerService);

	/** @ngInject */
	function registerService(registerDao) {
		var service = {
			register: register
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
		 * Register.
		 * @param userData {Object} user data
		 * @returns {*}
		 */
		function register(userData) {
			return registerDao.register(userData);
		}
	}

})();

