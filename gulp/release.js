/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const path = require('path');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const es = require('event-stream');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const conf = require('./conf');
const packageJSON = require('../package.json');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Filter for only directories with files in
 * @param esMap
 * @returns {*}
 */
function onlyDirs(esMap) {
    return esMap.map((file, cb) => {
        if (file.stat.isFile()) {
            return cb(null, file);
        }
        return cb();
    });
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('release', cb => (
    runSequence('clean:release:tmp', 'prepare:sources', 'web:release',
        ['tar-raspberrypi', 'tar-x64'], ['docker:raspberrypi', 'docker:x64'], cb)
));

gulp.task('prepare:sources', () => (
    gulp.src(conf.sources.backend)
        .pipe(onlyDirs(es))
        .pipe(gulp.dest(conf.release.tmp.main))
));

gulp.task('tar-raspberrypi', () => (
    gulp.src(conf.release.tmp.files)
        .pipe(tar('archive.tar'))
        .pipe(gzip())
        .pipe(gulp.dest(path.join(conf.release.dist.raspberrypi, packageJSON.version)))
));

gulp.task('tar-x64', () => (
    gulp.src(conf.release.tmp.files)
        .pipe(tar('archive.tar'))
        .pipe(gzip())
        .pipe(gulp.dest(path.join(conf.release.dist.x64, packageJSON.version)))
));
