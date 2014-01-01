'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    // require('time-grunt')(grunt);

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
            unit: {
                src: 'test/**/*-spec.js'
            }
        },

        browserify: {
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
                src: '<%= jshint.unit.src %>',
                dest: 'test/cover.js'
            },
            unit: {
                options: {
                    debug: true,
                    transform: ['brfs']
                },
                src: '<%= jshint.unit.src %>',
                dest: 'test/unit.js'
            }
        },

        simplemocha: {
            options: {
                reporter: 'spec',
                require: ['expect.js'],
                ui: 'bdd'
            },
            cover: {
                src: '<%= browserify.cover.dest %>'
            },
            unit: {
                src: '<%= browserify.unit.dest %>'
            }
        },

        karma: {
            options: {
                port: 9999,
                frameworks: ['mocha', 'expect'],
                files: ['<%= browserify.unit.dest %>']
            },
            dev: {
                autoWatch: true,
                singleRun: false,
                reporters: ['mocha'],
                browsers: ['Chrome', 'Firefox', 'Safari']
            },
            sauce: {
                autoWatch: false,
                singleRun: true,
                reporters: ['mocha', 'saucelabs'],
                sauseLabs: {
                    testName: 'unit tests',
                    tags: ['master']
                },
                customLaunchers: {
                    sChrome: {
                        base: 'SauceLabs',
                        browserName: 'chrome',
                        platform: 'WIN8'
                    },
                    sFirefox: {
                        base: 'SauceLabs',
                        browserName: 'firefox',
                        platform: 'WIN8'
                    },
                    sIE10: {
                        base: 'SauceLabs',
                        browserName: 'internet explorer',
                        platform: 'WIN8',
                        version: '10'
                    },
                    sOpera: {
                        base: 'SauceLabs',
                        browserName: 'opera',
                        platform: 'WIN8'
                    },
                    sSafari: {
                        base: 'SauceLabs',
                        browserName: 'safari',
                        version: '7'
                    }
                },
                browsers: ['sChrome', 'sFirefox', 'sIE10', 'sOpera', 'sSafari']
            }
        },

        clean: {
            build: ['<%= browserify.build.dest %>'],
            cover: ['<%= browserify.cover.dest %>'],
            unit: ['<%= browserify.unit.dest %>']
        },

        watch: {
            options: {
                livereload: true
            },
            dev: {
                files: [
                    '<%= jshint.build.src %>',
                    '<%= jshint.unit.src %>'
                ],
                tasks: ['lint', 'test', 'build']
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: {
                tasks: ['karma:dev', 'watch:dev']
            }
        }
    });

    grunt.registerTask('default', ['lint', 'test', 'build']);

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['clean:unit', 'browserify:unit', 'simplemocha:unit']);
    grunt.registerTask('build', ['clean:build', 'browserify:build']);

    grunt.registerTask('dev', ['concurrent:dev']);
    grunt.registerTask('travis', ['simplemocha:unit', 'karma:sauce']);
    grunt.registerTask('cover', ['clean:cover', 'browserify:cover', 'simplemocha:cover']);
};
