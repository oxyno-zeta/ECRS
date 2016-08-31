/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 14/08/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.profile')
		.controller('ProfileController', ProfileController);

	/** @ngInject */
	function ProfileController($mdToast, usersService, user) {
		var vm = this;
		// Variables
		vm.user = user;
		vm.oldPassword = '';
		vm.newPassword = '';
		vm.confirmPassword = '';
		// Functions
		vm.getRoleName = getRoleName;
		vm.getAccountType = getAccountType;
		vm.changePassword = changePassword;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Change password for current user.
		 */
		function changePassword() {
			usersService.changeCurrentPassword(vm.oldPassword, vm.newPassword).then(function () {
				// OK
				var toast = $mdToast.simple()
					.textContent('Change password Succeed !')
					.position('top right')
					.hideDelay(3000);
				// Show toast
				$mdToast.show(toast);
			}, function () {
				// Error
				var toast = $mdToast.simple()
					.textContent('Change password failed !')
					.position('top right')
					.hideDelay(3000);
				// Show toast
				$mdToast.show(toast);
			});
		}

		/**
		 * Get account type.
		 * @returns {*}
		 */
		function getAccountType() {
			if (user.github && user.github.id) {
				return 'Github';
			}
			else {
				return 'Local';
			}
		}

		/**
		 * Get Role Name.
		 * @returns {*}
		 */
		function getRoleName() {
			switch (user.role) {
				case 'admin':
					return 'Administrator';
				case 'normal':
					return 'Normal';
				default:
					return 'Unknown';
			}
		}

	}

})();

