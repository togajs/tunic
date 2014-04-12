'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');

var paths = {
    gulp: './gulpfile.js',
    src: './index.js',
    test: './test/**/*Spec.js'
};

gulp.task('default', ['lint', 'test']);

gulp.task('lint', function () {
    return gulp
        .src([paths.gulp, paths.src, paths.test])
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('cover', function () {
    return gulp
        .src(paths.src)
        .pipe(istanbul());
});

gulp.task('test', ['cover'], function () {
    return gulp
        .src(paths.test)
        .pipe(jasmine({ verbose: true }))
        .pipe(istanbul.writeReports());
});

gulp.task('watch', function () {
    gulp.watch(paths.src, ['test']);
    gulp.watch(paths.test, ['test']);
});
