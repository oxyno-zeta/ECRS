/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($state, $mdSidenav, user) {
        var vm = this;
        // Variables
        vm.user = user;
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
                $mdSidenav('leftProfileMenu')
                    .toggle();
            });
        }

        /**
         * Open Side Nav.
         */
        function openSideNav() {
            $mdSidenav('leftProfileMenu')
                .toggle();
        }
    }

})();
