/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 20/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter')
        .constant('CONFIG', {
            'URL': {
                'PREFIX': '/api/v1'
            },
            'ROLES': {
                admin: 'admin',
                normal: 'normal'
            }
        });

})();
