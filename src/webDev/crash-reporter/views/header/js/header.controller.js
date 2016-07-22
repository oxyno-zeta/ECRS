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
	function HeaderController($rootScope, loginService, usersService, CONFIG) {
		var vm = this;
		// Variables
		vm.isLoggedIn = loginService.isLoggedIn();
		vm.currentUser = null;
		vm.roles = CONFIG.ROLES;
		// Functions
		vm.logout = loginService.logout;

		// Activate
		activate();

		////////////////

		/**
		 * Activate
		 */
		function activate() {
			if (vm.isLoggedIn) {
				getAndSetCurrentUser();
			}
		}

		/**
		 * Get and set current user.
		 */
		function getAndSetCurrentUser() {
			usersService.getCurrent().then(function (user) {
				vm.currentUser = user;
			});
		}

		/* ************************************* */
		/* ********       UPDATE        ******** */
		/* ************************************* */

		$rootScope.$on('loginService:update:login', function () {
			vm.isLoggedIn = true;
			getAndSetCurrentUser();
		});

		$rootScope.$on('loginService:update:logout', function () {
			vm.isLoggedIn = false;
			vm.currentUser = null;
		});
	}

})();

