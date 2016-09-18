/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var gulp = require('gulp');
var bump = require('gulp-bump');

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */
// MAJOR ('major') version when you make incompatible API changes
// MINOR ('minor') version when you add functionality in a backwards-compatible manner
// PATCH ('patch') version when you make backwards-compatible bug fixes.
gulp.task('bump', ['bump:minor']);

gulp.task('bump:major', function(){
	return gulp.src(['package.json', 'bower.json'])
		.pipe(bump({type:'major'}))
		.pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
	return gulp.src(['package.json', 'bower.json'])
		.pipe(bump({type:'minor'}))
		.pipe(gulp.dest('./'));
});

gulp.task('bump:patch', function(){
	return gulp.src(['package.json', 'bower.json'])
		.pipe(bump({type:'patch'}))
		.pipe(gulp.dest('./'));
});