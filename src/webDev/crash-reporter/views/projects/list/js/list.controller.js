/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.projects.list')
		.controller('ProjectsController', ProjectsController);

	/** @ngInject */
	function ProjectsController(projectList, $log) {
		var vm = this;
		// Variables
		vm.projectList = projectList;
		// Functions
		vm.openProject = openProject;
		vm.newProject = newProject;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		function newProject() {
			modalService.projects.createModal().then($log.debug, $log.error);
		}

		/**
		 * Open project.
		 * @param project {Object} Project
		 */
		function openProject(project) {
			// Open
		}

	}

})();

