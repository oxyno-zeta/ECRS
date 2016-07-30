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
			getAll: getAll,
			create: create,
			getById: getById
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
		 * Get by id.
		 * @param id {String} id
		 * @returns {*}
		 */
		function getById(id) {
			return projectsDao.getById(id);
		}

		/**
		 * Create Project.
		 * @param data {Object} Project data
		 * @returns {*}
		 */
		function create(data) {
			return projectsDao.create(data);
		}

		/**
		 * Get all projects.
		 * @returns {*}
		 */
		function getAll() {
			return projectsDao.getAll();
		}
	}

})();

