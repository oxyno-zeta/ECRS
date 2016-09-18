/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 21/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.projects.list')
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
			.state('header.projects.list', {
				url: '/',
				views: {
					'content@header': {
						templateUrl: 'crash-reporter/views/projects/list/list.html',
						controller: 'ProjectsController',
						controllerAs: 'projectsCtrl'
					}
				},
				resolve: {
					projectList: function (projectsService) {
						return projectsService.getAll();
					}
				}
			});
	}

})();