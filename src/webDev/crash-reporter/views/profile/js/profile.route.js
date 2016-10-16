/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider.state('header.profile', {
            url: '/profile',
            abstract: true,
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