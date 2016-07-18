/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var gulp = require('gulp');
var del = require('del');
var conf = require('./conf');


/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('clean', ['clean:release:tmp']);

gulp.task('clean:all', ['clean:release:tmp', 'clean:release:dist', 'clean:web']);

gulp.task('clean:web', function () {
	return del(conf.sources.web.dist);
});

gulp.task('clean:release:dist', function () {
	return del(conf.release.dist.main);
});

gulp.task('clean:release:tmp', function () {
	return del(conf.release.tmp.main);
});

