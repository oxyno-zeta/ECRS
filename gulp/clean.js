/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const gulp = require('gulp');
const del = require('del');

const conf = require('./conf');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('clean', ['clean:release:tmp']);

gulp.task('clean:all', ['clean:release:tmp', 'clean:release:dist', 'clean:web']);

gulp.task('clean:web', () => del(conf.sources.web.dist));

gulp.task('clean:release:dist', () => del(conf.release.dist.main));

gulp.task('clean:release:tmp', () => del(conf.release.tmp.main));

gulp.task('clean:tests', () => del(conf.tests.resultDir.main));
