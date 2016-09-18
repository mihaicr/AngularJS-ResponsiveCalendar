module.exports = function (grunt) {
    'use strict';
    // Project Configuration

    function enquote(str) {
        return '"' + str + '"';
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: {
                src: ['gruntfile.js', 'demo/**/*.js', 'src/**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        html2js: {
            dist: {
                options: {
                    module: null, // no bundle module for all the html2js templates
                    base: '.'
                },
                files: [{
                    expand: true,
                    src: ['template/**/*.html'],
                    dest: 'build',
                    ext: '.html.js'
                }]
            }
        },
        'string-replace': {
            dist: {
                files: {
                    'build/': 'src/rcalendar/*.js'
                },
                options: {
                    replacements: [{
                        pattern: '.module(\'ui.rCalendar\', [])',
                        replacement: '.module(\'ui.rCalendar\', [\'ui.rCalendar.tpls\'])'
                    }]
                }
            }
        },
        copy: {
            css: {
                files: [{
                    expand: true,
                    src: ['*.css'],
                    cwd: 'css/rcalendar',
                    dest: 'dist/css'
                }]
            }
        },
        concat: {
            'dist-html-modules': {
                src: 'build/template/**/*.html.js',
                dest: 'build/calendar-html-modules.js'
            },
            'dist-modules': {
                options: {
                    banner: 'angular.module("ui.rCalendar.tpls", [' + grunt.file.expand('template/**/*.html').map(enquote) + ']);\n\n',
                },
                src: 'build/src/**/*.module.js',
                dest: 'build/calendar-modules.js'
            },
            'dist-all-js': {
                src: ['build/src/**/*.js', '!build/src/**/*.module.js'],
                dest: 'dist/js/calendar-tpls.js'
            },
            'dist-all': {
                src:['build/calendar-html-modules.js', 'build/calendar-modules.js', 'dist/js/calendar-tpls.js'],
                dest: 'dist/js/calendar-tpls.js'
            }
        },
        uglify: {
            dist: {
                options: {
                    mangle: false
                },
                src: ['dist/js/calendar-tpls.js'],
                dest: 'dist/js/calendar-tpls.min.js'
            }
        },
        cssmin: {
            dist: {
                files: [{
                    'dist/css/calendar.min.css': ['css/**/*.css']
                }]
            }
        },
        clean: ['build']
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-html2js');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Build task.
    grunt.registerTask('build', [
        'jshint',
        'copy:css',
        'html2js:dist',
        'string-replace:dist',
        'concat:dist-html-modules',
        'concat:dist-modules',
        'concat:dist-all-js',
        'concat:dist-all',
        'uglify:dist',
        'cssmin:dist',
        'clean'
    ]);
};