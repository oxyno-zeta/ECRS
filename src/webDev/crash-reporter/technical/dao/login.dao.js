/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 20/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical.dao')
		.factory('loginDao', loginDao);

	/** @ngInject */
	function loginDao($q, $resource, CONFIG) {
		var service = {
			login: login,
			urls: {
				auth: {
					github: CONFIG.URL.PREFIX + '/auth/github'
				}
			}
		};

		/* ************************************* */
		/* ********  PRIVATE VARIABLES  ******** */
		/* ************************************* */

		var loginResource = $resource(CONFIG.URL.PREFIX + '/login', {}, {});


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
			var deferred = $q.defer();
			var body = {
				username: username,
				password: password
			};

			loginResource.save(body, deferred.resolve, deferred.reject);

			return deferred.promise;
		}
	}

})();

