/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 13/09/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.register')
		.controller('RegisterController', RegisterController);

	/** @ngInject */
	function RegisterController($state, $mdToast, registerService) {
		var vm = this;
		// Variables
		vm.user = {
			username: null,
			password: null,
			email: null
		};
		vm.confirmPassword = null;
		// Functions
		vm.register = register;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		function register() {
			registerService.register(vm.user).then(function () {
				var toast = $mdToast.simple()
					.textContent('You can login now !')
					.position('top right')
					.hideDelay(3000);

				// Show toast
				$mdToast.show(toast);

				// Change state
				$state.go('header.login', {}, {reload: true});
			}, function (err) {
				// Error
				var toast = $mdToast.simple()
					.textContent('Register user failed !')
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
	}

})();

