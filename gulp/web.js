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
const minifyHtml = require('gulp-minify-html');
const angularTemplatecache = require('gulp-angular-templatecache');
const wiredep = require('wiredep').stream;
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const inject = require('gulp-inject');
const angularFilesort = require('gulp-angular-filesort');
const csso = require('gulp-csso');
const uglifySaveLicense = require('uglify-save-license');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const runSequence = require('run-sequence');
const del = require('del');
const browserSync = require('browser-sync');
const conf = require('./conf');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('web:partials', () => (
    gulp
        .src([
            path.join(conf.sources.web.dir, '/**/*.html'),
            path.join(`!${conf.sources.web.dir}`, '/index.html'),
        ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
        }))
        .pipe(angularTemplatecache('templateCacheHtml.js', {
            module: 'crash-reporter',
        }))
        .pipe(gulp.dest(conf.sources.web.dist))
));

gulp.task('web:sass', () => {
    const injectFiles = gulp.src([
        path.join(conf.sources.web.dir, '/**/*.scss'),
        path.join(`!${conf.sources.web.dir}`, '/crash-reporter.scss'),
    ]);

    const injectOptions = {
        transform: (filePath) => {
            const newFilePath = filePath.replace(`${conf.sources.web.dir}/`, '');
            return `@import "${newFilePath}";`;
        },
        starttag: '// inject',
        endtag: '// endinject',
        addRootSlash: false,
    };

    return gulp.src(path.join(conf.sources.web.dir, '/crash-reporter.scss'))
        .pipe(inject(injectFiles, injectOptions))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
        }))
        .on('error', console.error)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(conf.sources.web.dist));
});

gulp.task('web:js', () => (
    gulp.src([
        path.join(conf.sources.web.dir, '/**/*.js'),
    ]).pipe(gulp.dest(conf.sources.web.dist))
));

gulp.task('web:inject', () => {
    const injectStyles = gulp.src([
        path.join(conf.sources.web.dist, '/**/*.css'),
    ], {
        read: false,
    });

    const injectScripts = gulp
        .src([
            path.join(conf.sources.web.dist, '/**/*.js'),
        ])
        .pipe(angularFilesort()).on('error', console.error);

    const injectOptions = {
        ignorePath: [conf.sources.web.dist],
        addRootSlash: false,
    };

    return gulp.src(path.join(conf.sources.web.dir, '/index.html'))
        .pipe(inject(injectStyles, injectOptions))
        .pipe(inject(injectScripts, injectOptions))
        .pipe(wiredep({}, conf.other.wiredepConf))
        .on('error', (err) => {
            console.error(err);
            // Check if we are on TRAVIS-CI
            if (process.env.TRAVIS) {
                throw new Error(err);
            }
        })
        .pipe(gulp.dest(conf.sources.web.dist));
})
;

gulp.task('web:fonts', () => (
    gulp.src(conf.sources.other.fonts)
        .pipe(gulp.dest(path.join(conf.sources.web.dist, 'fonts')))
));

gulp.task('web:img', () => (
    gulp.src([
        path.join(conf.sources.web.dir, '/**/*.{svg,jpg,jpeg,gif,png}'),
    ]).pipe(gulp.dest(conf.sources.web.dist))
));

gulp.task('web:clean', () => del(conf.sources.web.dist));

gulp.task('web:dev', cb => (
    runSequence('web:clean', ['web:partials', 'web:sass', 'web:js', 'web:img', 'web:fonts'], 'web:inject', cb)
));

gulp.task('web:watch', ['web:dev'], () => (
    gulp.watch([
        path.join(conf.sources.web.dir, '/**/*'),
    ], ['web:dev'], () => (
        browserSync.reload({
            stream: true,
        })
    ))
));

gulp.task('web:release:build', ['web:dev'], () => (
    gulp.src(path.join(conf.sources.web.dist, '/*.html'))
        .pipe(useref())
        .pipe(gulpif('*.js', ngAnnotate()))
        .pipe(gulpif('*.js', uglify({
            preserveComments: uglifySaveLicense,
        })))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulpif('*.html', minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true,
        })))
        .pipe(gulp.dest(conf.release.tmp.web))
));

gulp.task('web:release:clean', () => (
    del(conf.release.tmp.web)
));

gulp.task('web:release:resources', done => (
    runSequence('web:release:resources:fonts', 'web:release:resources:img', done)
));

gulp.task('web:release:resources:fonts', () => (
    gulp.src(conf.sources.other.fonts)
        .pipe(gulp.dest(path.join(conf.release.tmp.web, 'styles', 'fonts')))
));

gulp.task('web:release:resources:img', () => (
    gulp.src([
        path.join(conf.sources.web.dir, '/**/*.{svg,jpg,jpeg,gif,png}'),
    ]).pipe(gulp.dest(conf.release.tmp.web))
));

gulp.task('web:release', cb => runSequence('web:release:clean', 'web:release:build', 'web:release:resources', cb));
