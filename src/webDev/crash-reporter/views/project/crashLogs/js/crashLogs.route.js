/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 08/08/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.project.crashLogs')
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
			.state('header.project.crashLogs', {
				url: '/crash-logs',
				views: {
					'content@header.project': {
						templateUrl: 'crash-reporter/views/project/crashLogs/crashLogs.html',
						controller: 'CrashLogsController',
						controllerAs: 'crashLogsCtrl'
					}
				}
			});
	}

})();