/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.initialize')
        .run(runLoading);

    /** @ngInject */
    function runLoading($rootScope, loadingService) {
        // Listening event
        $rootScope.$on('cfpLoadingBar:loaded', function () {
            // Called on every request
            loadingService.startLoading();
        });

        $rootScope.$on('cfpLoadingBar:completed', function () {
            // Called when are finished
            loadingService.stopLoading();
        });
    }

})();