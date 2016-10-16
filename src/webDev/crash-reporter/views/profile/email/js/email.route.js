/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile.email')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider.state('header.profile.email', {
            url: '/email',
            views: {
                'content@header.profile': {
                    templateUrl: 'crash-reporter/views/profile/email/email.html',
                    controller: 'EmailProfileController',
                    controllerAs: 'emailProfileCtrl'
                }
            }
        });
    }

})();