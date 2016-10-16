/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 21/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.initialize')
        .run(runRoute);

    /** @ngInject */
    function runRoute($rootScope, $state, loginService) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (!loginService.isLoggedIn() && !(_.isEqual(toState.url, '/login') ||
                _.isEqual(toState.url, '/register'))) {
                event.preventDefault();
                $state.go('header.login');
            }

            if (loginService.isLoggedIn() &&
                (_.isEqual(toState.url, '/login') || _.isEqual(toState.url, '/register'))) {
                event.preventDefault();
                $state.go('header.projects.list');
            }
        });

        $rootScope.$on('errorResponse:unauthorized', function () {
            $state.go('header.login', {reload: true});
        });
    }

})();
