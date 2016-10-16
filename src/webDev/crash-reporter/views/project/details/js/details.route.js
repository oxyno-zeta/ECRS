/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 27/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.project.details')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('header.project', {
                url: '/project/:projectId',
                views: {
                    'content@header': {
                        templateUrl: 'crash-reporter/views/project/details/details.html',
                        controller: 'ProjectDetailsController',
                        controllerAs: 'projectDetailsCtrl'
                    }
                },
                resolve: {
                    project: function ($stateParams, projectsService) {
                        return projectsService.getById($stateParams.projectId);
                    },
                    crashLogsPostUrl: function ($stateParams, configurationService) {
                        return configurationService.getCrashLogsPostUrl($stateParams.projectId);
                    }
                }
            });
    }

})();
