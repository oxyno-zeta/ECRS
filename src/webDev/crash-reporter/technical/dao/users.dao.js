/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical.dao')
		.factory('usersDao', usersDao);

	/** @ngInject */
	function usersDao($q, $resource, CONFIG) {
		var service = {
			getCurrent: getCurrent,
			changeCurrentPassword: changeCurrentPassword
		};

		/* ************************************* */
		/* ********  PRIVATE VARIABLES  ******** */
		/* ************************************* */

		var userResource = $resource(CONFIG.URL.PREFIX + '/users/:id/:verb1', {}, {});


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
			var body = {
				oldPassword: oldPassword,
				newPassword: newPassword
			};
			var deferred = $q.defer();
			userResource.save({id: 'current', verb1: 'password'}, body, deferred.resolve, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Get current user.
		 * @returns {*}
		 */
		function getCurrent() {
			var deferred = $q.defer();
			userResource.get({id: 'current'}, deferred.resolve, deferred.reject);
			return deferred.promise;
		}
	}

})();

