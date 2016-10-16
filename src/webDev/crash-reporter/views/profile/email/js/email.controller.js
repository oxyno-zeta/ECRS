/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile.email')
        .controller('EmailProfileController', EmailProfileController);

    /** @ngInject */
    function EmailProfileController($state, $mdToast, usersService) {
        var vm = this;
        // Variables
        vm.newEmail = '';
        // Functions
        vm.changeEmail = changeEmail;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Change email.
         */
        function changeEmail() {
            usersService.updateCurrentEmail(vm.newEmail).then(function () {
                // OK
                var toast = $mdToast.simple()
                    .textContent('Change Email Succeed !')
                    .position('top right')
                    .hideDelay(3000);
                // Show toast
                $mdToast.show(toast);
                // Go to profile
                $state.go('header.profile.user');
            }, function () {
                // Error
                var toast = $mdToast.simple()
                    .textContent('Change Email failed !')
                    .position('top right')
                    .hideDelay(3000);
                // Show toast
                $mdToast.show(toast);
            });
        }

    }

})();
