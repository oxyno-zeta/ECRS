/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var es = require('event-stream');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var conf = require('./conf');
var packageJSON = require('../package.json');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Filter for only directories with files in
 * @param es
 * @returns {*}
 */
function onlyDirs(es) {
	return es.map(function (file, cb) {
		if (file.stat.isFile()) {
			return cb(null, file);
		} else {
			return cb();
		}
	});
}


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('release', function (cb) {
	runSequence('clean:release:tmp', ['prepare:sources', 'web:release'], 'tar', cb);
});

gulp.task('prepare:sources', function () {
	return gulp.src(conf.sources.backend)
		.pipe(onlyDirs(es))
		.pipe(gulp.dest(conf.release.tmp.main));
});

gulp.task('tar', function () {
	return gulp.src(conf.release.tmp.files)
		.pipe(tar('archive.tar'))
		.pipe(gzip())
		.pipe(gulp.dest(path.join(conf.release.dist.main, packageJSON.version)));
});
