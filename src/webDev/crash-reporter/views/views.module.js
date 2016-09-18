/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views', [
			'crash-reporter.views.header',
			'crash-reporter.views.projects',
			'crash-reporter.views.login',
			'crash-reporter.views.project',
			'crash-reporter.views.profile',
			'crash-reporter.views.administration',
			'crash-reporter.views.register'
		]);

})();