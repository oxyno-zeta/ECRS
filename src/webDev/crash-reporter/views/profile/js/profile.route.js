/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 14/08/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('header.profile', {
                url: '/profile',
                views: {
                    'content@header': {
                        templateUrl: 'crash-reporter/views/profile/profile.html',
                        controller: 'ProfileController',
                        controllerAs: 'profileCtrl'
                    }
                },
                resolve: {
                    user: function (usersService) {
                        return usersService.getCurrent();
                    }
                }
            });
    }

})();
