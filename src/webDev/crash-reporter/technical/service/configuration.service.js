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
	function configurationService(configurationDao) {
		var service = {
			getConfiguration: getConfiguration
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
		 * Get configuration.
		 * @returns {*}
		 */
		function getConfiguration() {
			return configurationDao.getConfiguration();
		}
	}

})();

