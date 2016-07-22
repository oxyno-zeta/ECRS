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
			getCurrent: getCurrent
		};

		/* ************************************* */
		/* ********  PRIVATE VARIABLES  ******** */
		/* ************************************* */

		var userResource = $resource(CONFIG.URL.PREFIX + '/users/:id', {}, {});


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
			var deferred = $q.defer();
			userResource.get({id: 'current'}, function (result) {
				deferred.resolve(result.user);
			}, deferred.reject);
			return deferred.promise;
		}
	}

})();

