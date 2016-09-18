/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('serve', function (cb) {
	return runSequence('backend:nodemon', 'web:watch', 'browser-sync', cb);
});

gulp.task('browser-sync', function () {
	return browserSync.init(null, {
		proxy: 'http://localhost:2000',
		files: ['src/**/*.*'],
		browser: 'google-chrome',
		port: 7000
	});
});
