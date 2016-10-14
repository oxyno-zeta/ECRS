/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 26/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.projects')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('header.projects', {
                abstract: true
            });
    }

})();
