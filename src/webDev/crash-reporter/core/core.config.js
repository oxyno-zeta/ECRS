/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.core')
        .config(routeConfig)
        .config(loadingConfig);

    /** @ngInject */
    function routeConfig($urlRouterProvider, $httpProvider) {
        // Default url
        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('responseCodeInterceptor');
    }

    /** @ngInject */
    function loadingConfig(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }

})();