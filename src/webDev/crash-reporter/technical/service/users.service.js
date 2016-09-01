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
			remove: remove
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

