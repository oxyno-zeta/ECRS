/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 17/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.administration.configuration')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider.state('header.administration.configuration', {
            url: '/configuration',
            views: {
                'content@header.administration': {
                    templateUrl: 'crash-reporter/views/administration/configuration/configuration.html',
                    controller: 'AdministrationConfigurationController',
                    controllerAs: 'administrationConfigurationCtrl'
                }
            },
            resolve: {
                allConfiguration: function (configurationService) {
                    return configurationService.getAllConfiguration();
                }
            }
        });
    }

})();