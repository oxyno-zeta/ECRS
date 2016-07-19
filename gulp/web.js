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
var minifyHtml = require('gulp-minify-html');
var angularTemplatecache = require('gulp-angular-templatecache');
var wiredep = require('wiredep').stream;
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var csso = require('gulp-csso');
var uglifySaveLicense = require('uglify-save-license');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');
var del = require('del');
var browserSync = require('browser-sync');
var conf = require('./conf');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

gulp.task('web:partials', function () {
	return gulp.src([
			path.join(conf.sources.web.dir, '/**/*.html'),
			path.join('!' + conf.sources.web.dir, '/index.html')
		])
		.pipe(minifyHtml({
			empty: true,
			spare: true,
			quotes: true
		}))
		.pipe(angularTemplatecache('templateCacheHtml.js', {
			module: 'crash-reporter'
		}))
		.pipe(gulp.dest(conf.sources.web.dist));
});

gulp.task('web:sass', function () {
	var injectFiles = gulp.src([
		path.join(conf.sources.web.dir, '/**/*.scss'),
		path.join('!' + conf.sources.web.dir, '/crash-reporter.scss')
	]);

	var injectOptions = {
		transform: function (filePath) {
			filePath = filePath.replace(conf.sources.web.dir + '/', '');
			return '@import "' + filePath + '";';
		},
		starttag: '// inject',
		endtag: '// endinject',
		addRootSlash: false
	};

	return gulp.src(path.join(conf.sources.web.dir, '/crash-reporter.scss'))
		.pipe(inject(injectFiles, injectOptions))
		.pipe(sourcemaps.init())
		.pipe(sass()).on('error', sass.logError)
		.pipe(autoprefixer({
			browsers: ['last 4 versions']
		})).on('error', console.error)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(conf.sources.web.dist));
});

gulp.task('web:js', function () {
	return gulp.src([
		path.join(conf.sources.web.dir, '/**/*.js')
	]).pipe(gulp.dest(conf.sources.web.dist));
});

gulp.task('web:inject', function () {
	var injectStyles = gulp.src([
		path.join(conf.sources.web.dist, '/**/*.css')
	], {
		read: false
	});

	var injectScripts = gulp.src([
			path.join(conf.sources.web.dist, '/**/*.js')
		])
		.pipe(angularFilesort()).on('error', console.error);

	var injectOptions = {
		ignorePath: [conf.sources.web.dist],
		addRootSlash: false
	};

	return gulp.src(path.join(conf.sources.web.dir, '/index.html'))
		.pipe(inject(injectStyles, injectOptions))
		.pipe(inject(injectScripts, injectOptions))
		.pipe(wiredep({}, conf.other.wiredepConf)).on('error', console.error)
		.pipe(gulp.dest(conf.sources.web.dist));
});

gulp.task('web:fonts', function () {
	var paths = [];
	paths = paths.concat(conf.sources.other.fonts);

	return gulp.src(paths)
		.pipe(gulp.dest(path.join(conf.sources.web.dist, 'fonts')));
});

gulp.task('web:clean', function () {
	return del(conf.sources.web.dist);
});

gulp.task('web:dev', function (cb) {
	return runSequence('web:clean', ['web:partials', 'web:sass', 'web:js', 'web:fonts'], 'web:inject', cb);
});

gulp.task('web:watch', ['web:dev'], function () {
	gulp.watch([
		path.join(conf.sources.web.dir, '/**/*')
	], ['web:dev'], function () {
		browserSync.reload({
			stream: true
		});
	});
});

gulp.task('web:release:build', ['web:dev'], function () {
	return gulp.src(path.join(conf.sources.web.dist, '/*.html'))
		.pipe(useref())
		.pipe(gulpif('*.js', ngAnnotate()))
		.pipe(gulpif('*.js', uglify({
			preserveComments: uglifySaveLicense
		})))
		.pipe(gulpif('*.css', csso()))
		.pipe(gulpif('*.html', minifyHtml({
			empty: true,
			spare: true,
			quotes: true,
			conditionals: true
		})))
		.pipe(gulp.dest(conf.release.tmp.web));
});

gulp.task('web:release:clean', function () {
	return del(conf.release.tmp.web);
});

gulp.task('web:release', function (cb) {
	return runSequence('web:release:clean', 'web:release:build', cb);
});


