'use strict';

module.exports = function (config) {
    config.set({
        browsers: ['Chrome', 'Firefox'],
        frameworks: ['browserify', 'jasmine'],
        reporters: ['coverage', 'mocha'],
        files: [{
            pattern: 'lib/**/*.js',
            included: false
        }],
        browserify: {
            files: ['test/**/*Spec.js'],
            debug: true
        },
        preprocessors: {
            'lib/**/*.js': ['coverage'],
            '/**/*.browserify': ['browserify']
        }
    });
};
