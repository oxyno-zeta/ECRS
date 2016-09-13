/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 13/09/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical.dao')
		.factory('registerDao', registerDao);

	/** @ngInject */
	function registerDao($q, $resource, CONFIG) {
		var service = {
			register: register
		};
		/* ************************************* */
		/* ********  PRIVATE VARIABLES  ******** */
		/* ************************************* */

		var registerResource = $resource(CONFIG.URL.PREFIX + '/register', {}, {});

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
			var deferred = $q.defer();
			registerResource.save(null, userData, deferred.resolve, deferred.reject);
			return deferred.promise;
		}
	}

})();

