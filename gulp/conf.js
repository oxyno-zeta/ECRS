/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 03/07/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */


/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */


/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

module.exports = {
    sources: {
        backend: [
            'src/**/*',
            '!src/webDev/**/*',
            '!src/bower_components/**/*',
            'package.json',
            'README.md',
            'LICENSE.md',
            'CHANGELOG.md',
        ],
        web: {
            dir: 'src/webDev/',
            dist: 'src/views/',
        },
        other: {
            fonts: ['src/bower_components/font-awesome/fonts/*'],
        },
    },
    tests: {
        resultDir: {
            main: 'coverage/',
            backend: 'coverage/backend',
            frontend: 'coverage/frontend',
        },
        backend: {
            toTest: [
                'src/**/*.js',
                '!src/views',
                '!src/views/**/*',
                '!src/bower_components/',
                '!src/bower_components/**/*',
            ],
            files: [
                'tests/backend/**/*.js',
            ],
            options: {
                reporter: 'spec',
                report: 'lcovonly',
                timeout: 10000,
                color: true,
                bail: false, // True : stop after first fail
            },
        },
    },
    other: {
        wiredepConf: {
            directory: 'src/bower_components',
            exclude: [],
        },
    },
    release: {
        tmp: {
            main: '.tmp/',
            web: '.tmp/views/',
            files: '.tmp/**/*',
        },
        dist: {
            main: 'dist/',
            raspberrypi: 'dist/raspberrypi/',
            x64: 'dist/x64/',
        },
    },
    docker: {
        version: {
            x64: 'node:latest',
            raspberrypi: 'hypriot/rpi-node:latest',
        },
        file: 'Dockerfile',
    },
};
