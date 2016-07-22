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
			getCurrent: getCurrent
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
		 * Get current user.
		 * @returns {*}
		 */
		function getCurrent() {
			return usersDao.getCurrent();
		}
	}

})();

