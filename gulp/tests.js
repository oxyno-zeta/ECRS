/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 24/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const gulp = require('gulp');
const gulpMocha = require('gulp-mocha');
const gulpIstanbul = require('gulp-istanbul');
const runSequence = require('run-sequence');

const conf = require('./conf');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('tests', (cb) => {
    runSequence('clean:tests', 'tests:backend', 'tests:move:backend', cb);
});

gulp.task('tests:move:backend', () => {
    gulp.src(conf.tests.move.files)
        .pipe(gulp.dest(conf.tests.move.backend));
});

gulp.task('tests:backend', (cb) => {
    gulp.src(conf.tests.backend.toTest)
        .pipe(gulpIstanbul()) // Covering files
        .pipe(gulpIstanbul.hookRequire()) // Force `require` to return covered files
        .once('finish', () => {
            gulp.src(conf.tests.backend.files)
                .pipe(gulpMocha(conf.tests.backend.options))
                .once('error', function (err) {
                    // Check if test failed of something else
                    if (err.message.indexOf('test failed') !== -1) {
                        // Test fail
                        return;
                    }

                    // Print error
                    console.error(err);
                    // Continue even if there is an error
                    this.emit('end');
                })
                .pipe(gulpIstanbul.writeReports()) // Creating the reports after tests ran
                .once('end', cb);
        });
});
