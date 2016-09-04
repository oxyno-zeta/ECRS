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
			changeCurrentPassword: changeCurrentPassword,
			changePasswordForUser: changePasswordForUser,
			getAll: getAll,
			remove: remove,
			createUser: createUser,
			getRoles: getRoles,
			updateUser: updateUser
		};

		/* ************************************* */
		/* ********  PRIVATE VARIABLES  ******** */
		/* ************************************* */

		var userResource = $resource(CONFIG.URL.PREFIX + '/users/:id/:verb1', {}, {
			put: {
				method: 'PUT'
			}
		});


		return service;

		////////////////

		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Update user.
		 * @param id {String} id
		 * @param data {Object} user data
		 * @returns {*}
		 */
		function updateUser(id, data) {
			var deferred = $q.defer();
			userResource.put({id: id}, data, function (result) {
				deferred.resolve(result.toJSON());
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Get roles.
		 * @returns {*}
		 */
		function getRoles() {
			var deferred = $q.defer();
			userResource.query({id: 'roles'}, deferred.resolve, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Create User.
		 * @param userData {Object} user data
		 * @returns {*}
		 */
		function createUser(userData) {
			var deferred = $q.defer();
			userResource.save({}, userData, function (result) {
				deferred.resolve(result.toJSON());
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Remove user from id.
		 * @param userId {String} user id
		 * @returns {*}
		 */
		function remove(userId) {
			var deferred = $q.defer();
			userResource.delete({id: userId}, function () {
				deferred.resolve();
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Change password for user.
		 * @param userId {String} user id
		 * @param newPassword {String} new password
		 * @returns {*}
		 */
		function changePasswordForUser(userId, newPassword) {
			var deferred = $q.defer();
			var body = {
				newPassword: newPassword
			};
			userResource.put({id: userId, verb1: 'password'}, body, function (result) {
				deferred.resolve(result.toJSON());
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Get all.
		 * @param limit {Integer} limit
		 * @param skip {Integer} skip
		 * @param sort {Object} sort
		 */
		function getAll(limit, skip, sort) {
			var deferred = $q.defer();
			var params = {};

			if (limit) {
				params.limit = limit;
			}

			if (skip) {
				params.skip = skip;
			}

			if (sort) {
				params.sort = sort;
			}

			userResource.get(params, function (result) {
				deferred.resolve(result.toJSON());
			}, deferred.reject);
			return deferred.promise;
		}

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
			userResource.put({id: 'current', verb1: 'password'}, body, deferred.resolve, deferred.reject);
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

