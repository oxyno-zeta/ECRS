/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 26/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.projects.create')
		.controller('ProjectCreateController', ProjectCreateController);

	/** @ngInject */
	function ProjectCreateController($state, $mdToast, projectsService) {
		var vm = this;
		// Variables
		vm.project = {
			name: null,
			projectUrl: null
		};
		// Functions
		vm.create = create;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Create.
		 */
		function create() {
			// Change data
			vm.project.projectUrl = null;

			// Send
			projectsService.create(vm.project).then(function (result) {
				$state.go('header.project', {projectId: result.id});
			}, function (err) {
				var text = (err.statusText || 'Internal Error') + ' !';
				// Error
				var toast = $mdToast.simple()
					.textContent(text)
					.position('top right')
					.hideDelay(3000);
				// Show toast
				$mdToast.show(toast);
			});
		}

	}

})();

