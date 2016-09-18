/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.header')
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider.state('header', {
			abstract: true,
			views: {
				content: {
					templateUrl: 'crash-reporter/views/header/header.html',
					controller: 'HeaderController',
					controllerAs: 'headerCtrl'
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