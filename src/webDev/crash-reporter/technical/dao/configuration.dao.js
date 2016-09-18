/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 21/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical.dao')
		.factory('configurationDao', configurationDao);

	/** @ngInject */
	function configurationDao($q, $resource, CONFIG) {
		var service = {
			getConfiguration: getConfiguration
		};

		/* ************************************* */
		/* ********  PRIVATE VARIABLES  ******** */
		/* ************************************* */

		var configurationResource = $resource(CONFIG.URL.PREFIX + '/configurations', {}, {});


		return service;

		////////////////

		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Get configuration.
		 * @returns {*}
		 */
		function getConfiguration() {
			var deferred = $q.defer();
			configurationResource.get(deferred.resolve, deferred.reject);
			return deferred.promise;
		}
	}

})();

