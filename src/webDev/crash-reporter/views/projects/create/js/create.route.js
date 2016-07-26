/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 26/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.projects.create')
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
			.state('header.projects.create', {
				url: '/create',
				views: {
					'content@header': {
						templateUrl: 'crash-reporter/views/projects/create/create.html',
						controller: 'ProjectCreateController',
						controllerAs: 'projectCreateCtrl'
					}
				}
			});
	}

})();