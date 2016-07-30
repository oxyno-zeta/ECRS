/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 21/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical.service')
		.factory('configurationService', configurationService);

	/** @ngInject */
	function configurationService($q, configurationDao, CONFIG) {
		var service = {
			getConfiguration: getConfiguration,
			getCrashLogsPostUrl: getCrashLogsPostUrl
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
		 * Get crash logs post url.
		 * @param projectId {String} id
		 * @returns {*}
		 */
		function getCrashLogsPostUrl(projectId) {
			var deferred = $q.defer();
			configurationDao.getConfiguration().then(function (config) {
				var url = config.backendUrl;
				url += CONFIG.URL.PREFIX;
				url += '/crash-logs/';
				url += projectId;
				deferred.resolve(url);
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Get configuration.
		 * @returns {*}
		 */
		function getConfiguration() {
			return configurationDao.getConfiguration();
		}
	}

})();

