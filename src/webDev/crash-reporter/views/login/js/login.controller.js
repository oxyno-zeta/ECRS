/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 20/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.login')
		.controller('LoginController', LoginController);

	/** @ngInject */
	function LoginController(loginService, $log) {
		var vm = this;
		// Variables
		vm.username = null;
		vm.password = null;
		vm.submitDisabled = true;
		// Functions
		vm.login = login;
		vm.activateSubmit = activateSubmit;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Activate submit ?
		 */
		function activateSubmit() {
			if (_.isNull(vm.username) || _.isEmpty(vm.username)) {
				vm.submitDisabled = true;
				return;
			}

			if (_.isNull(vm.password) || _.isEmpty(vm.password)) {
				vm.submitDisabled = true;
				return;
			}

			vm.submitDisabled = false;
		}

		/**
		 * Login.
		 */
		function login() {
			loginService.login(vm.username, vm.password).then($log.debug, $log.error);
		}

	}

})();

