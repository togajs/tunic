'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');

var paths = {
    src: './index.js',
    test: './test/**/*Spec.js'
};

gulp.task('default', ['test']);

gulp.task('lint', function () {
    return gulp
        .src([paths.src, paths.test])
        .pipe(jshint('.jshintrc'))
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
