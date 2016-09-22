/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var path = require('path');
var gulp = require('gulp');
var gulpTemplate = require('gulp-template');
var conf = require('./conf');
var packageJSON = require('../package.json');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('docker:raspberrypi', function () {
	gulp.src(conf.docker.file)
		.pipe(gulpTemplate({from: conf.docker.version.raspberrypi}))
		.pipe(gulp.dest(path.join(conf.release.dist.raspberrypi, packageJSON.version)));
});

gulp.task('docker:x64', function () {
	gulp.src(conf.docker.file)
		.pipe(gulpTemplate({from: conf.docker.version.x64}))
		.pipe(gulp.dest(path.join(conf.release.dist.x64, packageJSON.version)));
});

