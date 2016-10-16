/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 27/08/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.administration')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider.state('header.administration', {
            url: '/administration',
            abstract: true,
            views: {
                'content@header': {
                    templateUrl: 'crash-reporter/views/administration/administration.html',
                    controller: 'AdministrationController',
                    controllerAs: 'administrationCtrl'
                }
            }
        });
    }

})();
