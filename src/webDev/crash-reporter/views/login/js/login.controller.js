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
	function LoginController(loginService, $log, configuration) {
		var vm = this;
		// Variables
		vm.username = null;
		vm.password = null;
		vm.submitDisabled = true;
		vm.localLoginSelected = false;
		vm.configuration = configuration;
		vm.urls = loginService.urls;
		// Functions
		vm.selectLocalLogin = selectLocalLogin;
		vm.login = login;
		vm.activateSubmit = activateSubmit;
		vm.resetChoices = resetChoices;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Reset all choices.
		 */
		function resetChoices() {
			vm.localLoginSelected = false;
		}

		/**
		 * Select local login.
		 */
		function selectLocalLogin() {
			vm.localLoginSelected = true;
		}

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

