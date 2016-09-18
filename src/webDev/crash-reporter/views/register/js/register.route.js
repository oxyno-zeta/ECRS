/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 07/09/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.register')
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider
			.state('header.register', {
				url: '/register',
				views: {
					'content@header': {
						templateUrl: 'crash-reporter/views/register/register.html',
						controller: 'RegisterController',
						controllerAs: 'registerCtrl'
					}
				}
			});
	}

})();