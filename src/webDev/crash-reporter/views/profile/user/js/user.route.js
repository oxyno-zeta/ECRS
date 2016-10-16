/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 14/08/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile.user')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('header.profile.user', {
                url: '/user',
                views: {
                    'content@header.profile': {
                        templateUrl: 'crash-reporter/views/profile/user/user.html',
                        controller: 'UserProfileController',
                        controllerAs: 'userProfileCtrl'
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
