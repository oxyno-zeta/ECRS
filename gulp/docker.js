/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const path = require('path');
const gulp = require('gulp');
const gulpTemplate = require('gulp-template');
const conf = require('./conf');
const packageJSON = require('../package.json');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('docker:raspberrypi', () => (
    gulp.src(conf.docker.file)
        .pipe(gulpTemplate({
            from: conf.docker.version.raspberrypi,
        }))
        .pipe(gulp.dest(path.join(conf.release.dist.raspberrypi, packageJSON.version)))
));

gulp.task('docker:x64', () => (
    gulp.src(conf.docker.file)
        .pipe(gulpTemplate({
            from: conf.docker.version.x64,
        }))
        .pipe(gulp.dest(path.join(conf.release.dist.x64, packageJSON.version)))
));

