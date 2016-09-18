/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 06/08/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.project.statistics')
		.controller('VersionsStatisticsModalController', VersionsStatisticsModalController);

	/** @ngInject */
	function VersionsStatisticsModalController($mdDialog) {
		var vm = this;
		// Functions
		vm.close = close;

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Close modal.
		 */
		function close() {
			$mdDialog.hide();
		}
	}

})();

