/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.projects')
		.controller('ProjectsController', ProjectsController);

	/** @ngInject */
	function ProjectsController(projectList) {
		var vm = this;
		// Variables
		vm.projectList = projectList;
		// Functions
		vm.openProject = openProject;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Open project.
		 * @param project {Object} Project
		 */
		function openProject(project) {
			// Open
		}

	}

})();

