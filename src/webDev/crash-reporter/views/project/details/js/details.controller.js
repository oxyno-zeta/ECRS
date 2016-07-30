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
	function ProjectDetailsController(project, crashLogsPostUrl) {
		var vm = this;
		// Variables
		vm.project = project;
		vm.crashLogsPostUrl = crashLogsPostUrl;
		// Functions

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

	}

})();

