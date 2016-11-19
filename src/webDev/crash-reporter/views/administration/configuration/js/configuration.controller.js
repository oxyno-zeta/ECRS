/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 17/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.administration.configuration')
        .controller('AdministrationConfigurationController', AdministrationConfigurationController);

    /** @ngInject */
    function AdministrationConfigurationController(allConfiguration) {
        var vm = this;
        // Variables
        vm.allConfiguration = allConfiguration;
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

