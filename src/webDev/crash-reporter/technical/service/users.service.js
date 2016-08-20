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
			changeCurrentPassword: changeCurrentPassword
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

