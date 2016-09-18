/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 01/09/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.administration.users')
		.controller('AdminUpdateUserController', AdminUpdateUserController);

	/** @ngInject */
	function AdminUpdateUserController($mdDialog, $mdToast, usersService, roles, user) {
		var vm = this;
		// Variables
		vm.roles = roles;
		vm.user = user;
		// Functions
		vm.close = close;
		vm.update = update;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Update user.
		 */
		function update() {
			usersService.updateUser(vm.user.id, vm.user).then(function (data) {
				$mdDialog.hide(data);
			}, function () {
				// Error
				var toast = $mdToast.simple()
					.textContent('Update user failed !')
					.position('top right')
					.hideDelay(3000);
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