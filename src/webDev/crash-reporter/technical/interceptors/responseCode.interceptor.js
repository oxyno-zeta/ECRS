/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 21/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical.interceptors')
		.factory('responseCodeInterceptor', responseCodeInterceptor);

	/** @ngInject */
	function responseCodeInterceptor($q, $rootScope) {
		var service = {
			responseError: responseError
		};
		return service;

		////////////////

		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		function responseError(response) {
			switch (response.status) {
				case 401:
					$rootScope.$broadcast('errorResponse:unauthorized');
					$q.reject(response);
					break;
				default:
					$q.reject(response);
			}
		}
	}

})();

