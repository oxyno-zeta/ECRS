/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical.service')
		.factory('projectsService', projectsService);

	/** @ngInject */
	function projectsService(projectsDao) {
		var service = {
			getAll: getAll
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
		 * Get all projects.
		 * @returns {*}
		 */
		function getAll() {
			return projectsDao.getAll();
		}
	}

})();

