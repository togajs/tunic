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

        clean: {
            build: ['<%= browserify.build.dest %>'],
            cover: ['<%= browserify.cover.dest %>'],
            unit: ['<%= browserify.unit.dest %>']
        },

        simplemocha: {
            options: {
                reporter: 'spec',
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
                frameworks: ['mocha'],
                reporters: ['mocha'],
                files: ['<%= browserify.unit.dest %>'],
                sauceLabs: {
                    concurrent: 3,
                    startConnect: true,
                    testName: 'Toga'
                },
                customLaunchers: {
                    slChrome31:  { base: 'SauceLabs', browserName: 'chrome',            version: '31' },
                    slFirefox25: { base: 'SauceLabs', browserName: 'firefox',           version: '25' },
                    slSafari6:   { base: 'SauceLabs', browserName: 'safari',            version: '6' },
                    slIE8:       { base: 'SauceLabs', browserName: 'internet explorer', version: '8' },
                    slIE9:       { base: 'SauceLabs', browserName: 'internet explorer', version: '9' },
                    slIE10:      { base: 'SauceLabs', browserName: 'internet explorer', version: '10' },
                    slIE11:      { base: 'SauceLabs', browserName: 'internet explorer', version: '11' },
                    slAndroid4:  { base: 'SauceLabs', browserName: 'android',           version: '4' },
                    slIPhone7:   { base: 'SauceLabs', browserName: 'iphone',            version: '7' }
                }
            },
            dev: {
                options: {
                    autoWatch: true,
                    browsers: ['Chrome', 'Firefox']
                }
            },
            local: {
                options: {
                    singleRun: true,
                    browsers: ['Chrome', 'Firefox']
                }
            },
            sauce: {
                options: {
                    singleRun: true,
                    reporters: ['mocha', 'saucelabs'],
                    browsers: [/*
                        'slChrome31',
                        'slFirefox25',
                        'slSafari6',
                        'slIE8',*/
                        'slIE9',
                        'slIE10',
                        'slIE11'/*,
                        'slAndroid4',
                        'slIPhone7'*/
                    ]
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            dev: {
                files: ['<%= jshint.build.src %>', '<%= jshint.unit.src %>'],
                tasks: ['default']
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

    // Common tasks
    grunt.registerTask('default',      ['jshint', 'test', 'build']);
    grunt.registerTask('dev',          ['concurrent:dev']);

    // Build tasks
    grunt.registerTask('build',        ['clean:build', 'browserify:build']);
    grunt.registerTask('build:cover',  ['clean:cover', 'browserify:cover']);
    grunt.registerTask('build:unit',   ['clean:unit', 'browserify:unit']);

    // Test tasks
    grunt.registerTask('test',         ['build:unit', 'simplemocha:unit']);
    grunt.registerTask('test:browser', ['build:unit', 'karma:local']);
    grunt.registerTask('test:cover',   ['build:cover', 'simplemocha:cover']);
    grunt.registerTask('test:sauce',   ['build:unit', 'karma:sauce']);
};
