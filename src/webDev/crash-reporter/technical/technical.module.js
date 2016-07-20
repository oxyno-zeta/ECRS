/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.technical', [
			'crash-reporter.technical.cache',
			'crash-reporter.technical.dao',
			'crash-reporter.technical.service'
		]);

})();