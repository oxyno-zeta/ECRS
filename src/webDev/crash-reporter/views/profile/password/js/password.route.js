/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile.password')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider.state('header.profile.password', {
            url: '/password',
            views: {
                'content@header.profile': {
                    templateUrl: 'crash-reporter/views/profile/password/password.html',
                    controller: 'PasswordProfileController',
                    controllerAs: 'passwordProfileCtrl'
                }
            },
            resolve: {
                user: function (usersService) {
                    return usersService.getCurrent();
                }
            },
            onEnter: function ($state, user) {
                if (user.github.id) {
                    // User is Github User
                    $state.go('header.profile.user');
                }
            }
        });
    }

})();