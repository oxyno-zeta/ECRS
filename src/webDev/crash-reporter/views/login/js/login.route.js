/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.login')
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
			.state('header.login', {
				url: '/login',
				views: {
					'content@header': {
						templateUrl: 'crash-reporter/views/login/login.html',
						controller: 'LoginController',
						controllerAs: 'loginCtrl'
					}
				},
				resolve: {
					configuration: function (configurationService) {
						return configurationService.getConfiguration();
					}
				}
			});
	}

})();