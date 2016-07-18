/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */


/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

module.exports = {
	sources: {
		backend: [
			'src/**/*',
			'!src/webDev/**/*',
			'package.json',
			'README.md',
			'LICENSE.md'
		],
		web: {
			dir: 'src/webDev/',
			dist: 'src/views/'
		}
	},
	other: {
		wiredepConf: {
			directory: 'src/bower_components',
			exclude: []
		}
	},
	release: {
		tmp: {
			main: '.tmp/',
			web: '.tmp/views/',
			files: '.tmp/**/*'
		},
		dist: {
			main: 'dist/'
		}
	}
};
