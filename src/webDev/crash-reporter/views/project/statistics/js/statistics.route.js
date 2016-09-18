/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 04/08/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.project.statistics')
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
			.state('header.project.statistics', {
				url: '/statistics',
				views: {
					'content@header.project': {
						templateUrl: 'crash-reporter/views/project/statistics/statistics.html',
						controller: 'ProjectStatisticsController',
						controllerAs: 'projectStatisticsCtrl'
					}
				}
			});
	}

})();