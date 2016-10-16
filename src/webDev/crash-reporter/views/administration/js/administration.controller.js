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
    function AdministrationController($state, $mdSidenav) {
        var vm = this;
        // Variables
        // Functions
        vm.openSideNav = openSideNav;
        vm.goAndCloseSideNav = goAndCloseSideNav;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Go to state and Close SideNav.
         * @param stateName
         */
        function goAndCloseSideNav(stateName) {
            $state.go(stateName).then(function () {
                $mdSidenav('leftAdminMenu')
                    .toggle();
            });
        }

        /**
         * Open Side Nav.
         */
        function openSideNav() {
            $mdSidenav('leftAdminMenu')
                .toggle();
        }
    }

})();
