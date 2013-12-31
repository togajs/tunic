'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: require('./package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                force: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            build: {
                src: 'lib/**/*.js'
            },
            test: {
                src: 'test/**/*-spec.js'
            }
        },

        browserify: {
            options: {
                transform: ['brfs']
            },
            build: {
                options: {
                    standalone: '<%= pkg.name %>'
                },
                src: '<%= jshint.build.src %>',
                dest: 'index.js'
            },
            cover: {
                options: {
                    transform: ['brfs', 'coverify']
                },
                src: '<%= jshint.test.src %>',
                dest: 'test/cover.js'
            },
            test: {
                options: {
                    debug: true
                },
                src: '<%= jshint.test.src %>',
                dest: 'test/index.js'
            }
        },

        simplemocha: {
            options: {
                reporter: 'spec',
                ui: 'bdd'
            },
            cover: {
                src: '<%= browserify.cover.dest %>'
            },
            test: {
                src: '<%= browserify.test.dest %>'
            }
        },

        'saucelabs-mocha': {
            all: {
                options: {
                    urls: ['http://127.0.0.1:9999/test/runner.html'],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers: [
                        { browserName: 'chrome',            platform: 'WIN8' },
                        { browserName: 'firefox',           platform: 'WIN8' },
                        { browserName: 'internet explorer', platform: 'XP',        version: '8' },
                        { browserName: 'internet explorer', platform: 'VISTA',     version: '9' },
                        { browserName: 'internet explorer', platform: 'WIN8',      version: '10' },
                        { broswerName: 'safari',            platform: 'OS X 10.9', version: '7' }
                    ],
                    testname: 'mocha tests',
                    tags: ['master']
                }
            }
        },

        connect: {
            server: {
                options: {
                    base: '',
                    port: 9999
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            all: {
                files: [
                    '<%= jshint.build.src %>',
                    '<%= jshint.test.src %>'
                ],
                tasks: ['default']
            }
        }
    });

    grunt.registerTask('default', ['lint', 'test', 'build']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('build', ['browserify:build']);
    grunt.registerTask('cover', ['browserify:cover', 'simplemocha:cover']);
    grunt.registerTask('test', ['browserify:test', 'simplemocha:test', 'connect', 'saucelabs-mocha']);
};
