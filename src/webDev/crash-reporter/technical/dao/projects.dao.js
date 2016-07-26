/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical.dao')
		.factory('projectsDao', projectsDao);

	/** @ngInject */
	function projectsDao($q, $resource, CONFIG) {
		var service = {
			getAll: getAll,
			create: create
		};

		/* ************************************* */
		/* ********  PRIVATE VARIABLES  ******** */
		/* ************************************* */

		var projectResource = $resource(CONFIG.URL.PREFIX + '/projects/:id', {}, {});


		return service;

		////////////////

		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Create Project.
		 * @param data {Object} Project data
		 * @returns {*}
		 */
		function create(data) {
			var deferred = $q.defer();
			projectResource.save(null, data, function (result) {
				deferred.resolve(result.project);
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Get all projects.
		 * @returns {*}
		 */
		function getAll() {
			var deferred = $q.defer();
			projectResource.get(null, function (result) {
				deferred.resolve(result.projects);
			}, deferred.reject);
			return deferred.promise;
		}
	}

})();

