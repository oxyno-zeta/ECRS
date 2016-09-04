/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 01/09/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.administration.users')
		.controller('AdminAddNewUserController', AdminAddNewUserController);

	/** @ngInject */
	function AdminAddNewUserController($mdDialog, $mdToast, usersService, roles) {
		var vm = this;
		// Variables
		vm.username = null;
		vm.password = null;
		vm.confirmPassword = null;
		vm.email = null;
		vm.roles = roles;
		vm.role = null;
		// Functions
		vm.close = close;
		vm.create = create;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Create user.
		 */
		function create() {
			var userData = {
				username: vm.username,
				password: vm.password,
				email: vm.email,
				role: vm.role
			};
			usersService.createUser(userData).then($mdDialog.hide, function (err) {
				// Error
				var toast = $mdToast.simple()
					.textContent('Add user failed !')
					.position('top right')
					.hideDelay(3000);

				if (err.status === 409) {
					// Conflict
					toast.textContent('Conflict User !');
				}
				// Show toast
				$mdToast.show(toast);
			});
		}

		/**
		 * Close modal.
		 */
		function close() {
			$mdDialog.hide();
		}
	}

})();