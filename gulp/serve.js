/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const gulp = require('gulp');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('serve', cb => (
    runSequence('backend:nodemon', 'web:watch', 'browser-sync', cb)
));

gulp.task('browser-sync', () => (
    browserSync.init(null, {
        proxy: 'http://localhost:2000',
        files: ['src/**/*.*'],
        browser: 'google-chrome',
        port: 7000,
    })
));
