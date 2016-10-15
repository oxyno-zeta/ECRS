/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 15/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.administration')
        .controller('AdministrationController', AdministrationController);

    /** @ngInject */
    function AdministrationController($mdSidenav) {
        var vm = this;
        // Variables
        // Functions
        vm.openSideNav = openSideNav;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Open Side Nav.
         */
        function openSideNav() {
            $mdSidenav('leftAdminMenu')
                .toggle();
        }
    }

})();
