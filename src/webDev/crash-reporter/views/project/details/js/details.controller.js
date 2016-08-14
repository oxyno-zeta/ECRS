/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 29/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.project.details')
		.controller('ProjectDetailsController', ProjectDetailsController);

	/** @ngInject */
	function ProjectDetailsController($state, $mdDialog, projectsService, project, crashLogsPostUrl) {
		var vm = this;
		// Variables
		vm.project = project;
		vm.crashLogsPostUrl = crashLogsPostUrl;
		vm.electronCode = '\nconst {crashReporter} = require(\'electron\')\n' +
			'\ncrashReporter.start({\n	productName: \'YourName\',' +
			'\n	companyName: \'YourCompany\',\n	submitURL: \'' + crashLogsPostUrl + '\',' +
			'\n	autoSubmit: true\n})\n';

		// Functions
		vm.isState = isState;
		vm.deleteProject = deleteProject;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Delete project.
		 */
		function deleteProject() {
			var confirm = $mdDialog.confirm()
				.title('Would you like to delete the project and all files ?')
				.textContent('This action cannot be undone.')
				.ariaLabel('Delete Project')
				.clickOutsideToClose(true)
				.escapeToClose(true)
				.ok('Ok')
				.cancel('Cancel');
			$mdDialog.show(confirm).then(function () {
				projectsService.remove(project.id).then(function () {
					$state.go('header.projects.list');
				});
			});
		}

		/**
		 * Check is State.
		 * @param stateName {String} State name
		 * @returns {*}
		 */
		function isState(stateName) {
			return $state.is(stateName);
		}

	}

})();

