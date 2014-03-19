'use strict';

var gulp = require('gulp');

var paths = {
    src: './lib/tunic.js',
    dest: 'index.js',
    test: './test/**/*Spec.js'
};

// Lint

gulp.task('lint', function () {
    var jshint = require('gulp-jshint');

    return gulp.src([paths.src, paths.test])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// Test

gulp.task('test-client', function () {
    var karma = require('gulp-karma');

    return gulp.src('') // no file
        .pipe(karma({
            action: 'run',
            configFile: 'karmafile.js'
        }));
});

gulp.task('test-node', function () {
    var jasmine = require('gulp-jasmine');

    return gulp.src(paths.test)
        .pipe(jasmine({
            verbose: true
        }));
});

gulp.task('test', ['test-client', 'test-node']);

// Build

gulp.task('build', ['lint', 'test'], function () {
    var browserify = require('browserify');
    var source = require('vinyl-source-stream');
    var streamify = require('gulp-streamify');
    var uglify = require('gulp-uglify');

    return browserify(paths.src)
        .bundle()
        .pipe(source(paths.dest))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('.'));
});

// Default

gulp.task('default', ['build']);
