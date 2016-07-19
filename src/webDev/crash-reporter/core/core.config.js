/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.core')
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($urlRouterProvider) {
		// Default url
		$urlRouterProvider.otherwise('/');
	}

})();