/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 22/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.projects.list')
        .controller('ProjectsController', ProjectsController);

    /** @ngInject */
    function ProjectsController(projectList) {
        var vm = this;
        // Variables
        vm.projectList = projectList;
        // Functions

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

    }

})();
