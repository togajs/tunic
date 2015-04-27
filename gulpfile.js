'use strict';

var gulp = require('gulp'),
	path = require('path'),

	paths = {
		gulp: 'gulpfile.js',
		src:  'index.js',
		test: 'test/**/*.{e2e,spec}.js',
		dist: 'dist',
	};

gulp.task('default', ['test']);

gulp.task('lint', function () {
	var eslint = require('gulp-eslint');

	return gulp
		.src([paths.gulp, paths.src, paths.test])
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('build', function () {
	var babel = require('gulp-babel');

	return gulp
		.src(paths.src)
		.pipe(babel())
		.pipe(gulp.dest(paths.dist));
});

gulp.task('cover', ['build'], function () {
	var istanbul = require('gulp-istanbul');

	return gulp
		.src(path.join(paths.dist, paths.src))
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});

gulp.task('test', ['lint', 'cover'], function () {
	var istanbul = require('gulp-istanbul'),
		mocha = require('gulp-mocha');

	return gulp
		.src(paths.test)
		.pipe(mocha({ reporter: 'spec' }))
		.pipe(istanbul.writeReports());
});
