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
			getById: getById,
			statisticsNumberByVersion: statisticsNumberByVersion,
			statisticsNumberByDate: statisticsNumberByDate,
			getAllVersions: getAllVersions,
			statisticsNumberByVersionByDate: statisticsNumberByVersionByDate,
			getProjectCrashLogs: getProjectCrashLogs,
			remove: remove
		};

		/* ************************************* */
		/* ********  PRIVATE VARIABLES  ******** */
		/* ************************************* */

		var projectResource = $resource(CONFIG.URL.PREFIX + '/projects/:id/:verb1', {}, {});
		var projectStatisticsResource =
			$resource(CONFIG.URL.PREFIX + '/projects/:id/statistics/number/:verb1/:verb2', {}, {});


		return service;

		////////////////

		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Delete project.
		 * @param id {String} id
		 * @returns {*}
		 */
		function remove(id) {
			var deferred = $q.defer();
			projectResource.delete({id: id}, deferred.resolve, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Get project crash logs.
		 * @param project {Object} project
		 * @param limit {Integer} limit
		 * @param skip {Integer} skip
		 * @param sort {Object} sort
		 * @returns {*}
		 */
		function getProjectCrashLogs(project, limit, skip, sort) {
			var deferred = $q.defer();
			var params = {
				id: project.id,
				verb1: 'crash-logs'
			};

			if (limit) {
				params.limit = limit;
			}

			if (skip) {
				params.skip = skip;
			}

			if (sort) {
				params.sort = sort;
			}

			projectResource.get(params, function (result) {
				deferred.resolve(result.toJSON());
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Statistics Number by version by date.
		 * @param id {String} id
		 * @param versions {Array} versions
		 * @param startDate {Date} Start date
		 * @returns {*}
		 */
		function statisticsNumberByVersionByDate(id, versions, startDate) {
			var deferred = $q.defer();
			var timestamp;
			// Get timestamp if necessary
			if (startDate) {
				timestamp = startDate.getTime();
			}

			projectStatisticsResource.get({
				id: id, verb1: 'version',
				verb2: 'date', versions: versions, startDate: timestamp
			}, function (result) {
				deferred.resolve(result.toJSON());
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Get versions in project.
		 * @param id {String} id
		 * @returns {*}
		 */
		function getAllVersions(id) {
			var deferred = $q.defer();
			projectResource.query({id: id, verb1: 'versions'}, deferred.resolve, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Statistics Number By Date.
		 * @param id {String} id
		 * @param startDate {Date} Start date
		 * @returns {*}
		 */
		function statisticsNumberByDate(id, startDate) {
			var deferred = $q.defer();
			projectStatisticsResource.get({id: id, verb1: 'date', startDate: startDate.getTime()}, function (result) {
				deferred.resolve(result.toJSON());
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Statistics Number By Version.
		 * @param id {String} id
		 * @returns {*}
		 */
		function statisticsNumberByVersion(id) {
			var deferred = $q.defer();
			projectStatisticsResource.get({id: id, verb1: 'version'}, function (result) {
				deferred.resolve(result.toJSON());
			}, deferred.reject);
			return deferred.promise;
		}

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

