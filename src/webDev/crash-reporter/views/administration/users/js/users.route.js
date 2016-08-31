/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 28/08/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.administration.users')
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($stateProvider) {
		$stateProvider.state('header.administration.users', {
			url: '/users',
			views: {
				'content@header': {
					controller: 'AdministrationUsersController',
					controllerAs: 'adminUsersCtrl',
					templateUrl: 'crash-reporter/views/administration/users/users.html'
				}
			},
			resolve: {
				user: function (usersService) {
					return usersService.getCurrent();
				}
			}
		});
	}

})();