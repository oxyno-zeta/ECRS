/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.loading')
		.factory('loadingService', loadingService);

	/** @ngInject */
	function loadingService($q, $mdDialog) {
		var service = {
			startLoading: startLoading,
			stopLoading: stopLoading
		};
		var loadingInstance = null;
		var stopCount = 0;
		return service;

		////////////////

		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Stop loading.
		 * @param rearm {Boolean} rearm loading system
		 */
		function stopLoading(rearm) {
			if (rearm) {
				stopCount = 0;
			}
			else {
				stopCount--;
			}

			if (loadingInstance) {
				$mdDialog.hide(loadingInstance);
			}
		}

		/**
		 * Start loading.
		 */
		function startLoading() {
			// Reset stop count
			stopCount = 0;
			if (!loadingInstance) {
				loadingInstance = $mdDialog.show({
					templateUrl: 'crash-reporter/loading/loading.html',
					clickOutsideToClose: false,
					escapeToClose: false,
					onRemoving: function () {
						loadingInstance = null;
					},
					onComplete: function () {
						if (stopCount < 0) {
							stopLoading(true);
							stopCount = 0;
						}
					}
				});
			}
		}
	}

})();

