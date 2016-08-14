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
	function projectsService($q, projectsDao) {
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
		return service;

		////////////////

		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Delete project
		 * @param id {String} id
		 * @returns {*}
		 */
		function remove(id) {
			return projectsDao.remove(id);
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
			return projectsDao.getProjectCrashLogs(project, limit, skip, sort);
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
			projectsDao.statisticsNumberByVersionByDate(id, versions, startDate).then(function (data) {
				var results = [];
				var result;

				// Loop on key/value first depth
				_.forEach(data, function (obj1, key1) {
					result = {
						key: key1,
						values: []
					};

					// Loop on key/value second depth
					_.forEach(obj1, function (value2, key2) {
						result.values.push({
							x: _.parseInt(key2),
							y: value2
						});
					});

					results.push(result);
				});

				deferred.resolve(results);
			}, deferred.reject);
			return deferred.promise;
		}

		/**
		 * Get versions in project.
		 * @param id {String} id
		 * @returns {*}
		 */
		function getAllVersions(id) {
			return projectsDao.getAllVersions(id);
		}

		/**
		 * Statistics Number By Date.
		 * @param id {String} id
		 * @param startDate {Date} Start date
		 * @returns {*}
		 */
		function statisticsNumberByDate(id, startDate) {
			var deferred = $q.defer();
			projectsDao.statisticsNumberByDate(id, startDate).then(function (data) {
				// Transform data
				var result = {
					key: 'Data',
					values: []
				};
				_.forEach(data, function (value, key) {
					result.values.push({
						x: _.parseInt(key),
						y: value
					});
				});

				// Create array
				result = [result];

				deferred.resolve(result);
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
			projectsDao.statisticsNumberByVersion(id).then(function (data) {
				// Transform data
				var results = [];
				_.forEach(data, function (value, key) {
					results.push({
						x: key,
						y: value
					});
				});
				deferred.resolve(results);
			}, deferred.reject);
			return deferred.promise;
		}

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

