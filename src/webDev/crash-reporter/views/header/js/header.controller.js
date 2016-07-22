/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.header')
		.controller('HeaderController', HeaderController);

	/** @ngInject */
	function HeaderController($rootScope, loginService) {
		var vm = this;
		// Variables
		vm.isLoggedIn = loginService.isLoggedIn();
		// Functions

		////////////////


		/* ************************************* */
		/* ********       UPDATE        ******** */
		/* ************************************* */

		$rootScope.$on('loginService:update:login', function () {
			vm.isLoggedIn = true;
		});

		$rootScope.$on('loginService:update:logout', function () {
			vm.isLoggedIn = false;
		});
	}

})();

