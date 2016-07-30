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
			create: create,
			getById: getById
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
		 * Get by id.
		 * @param id {String} id
		 * @returns {*}
		 */
		function getById(id) {
			var deferred = $q.defer();
			projectResource.get({id: id}, deferred.resolve, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Create Project.
		 * @param data {Object} Project data
		 * @returns {*}
		 */
		function create(data) {
			var deferred = $q.defer();
			projectResource.save(null, data, deferred.resolve, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Get all projects.
		 * @returns {*}
		 */
		function getAll() {
			var deferred = $q.defer();
			projectResource.query(null, deferred.resolve, deferred.reject);
			return deferred.promise;
		}
	}

})();

