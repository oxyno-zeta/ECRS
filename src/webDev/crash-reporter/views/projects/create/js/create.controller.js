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
	function ProjectCreateController($mdToast, $interval, projectsService) {
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

		function create() {
			// Change data
			vm.project.projectUrl = null;

			// Send
			projectsService.create(vm.project).then(function (result) {
				console.log(result);
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

