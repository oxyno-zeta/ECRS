/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile.password')
        .controller('PasswordProfileController', PasswordProfileController);

    /** @ngInject */
    function PasswordProfileController($mdToast, $state, usersService) {
        var vm = this;
        // Variables
        vm.oldPassword = '';
        vm.newPassword = '';
        vm.confirmPassword = '';
        // Functions
        vm.changePassword = changePassword;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Change password for current user.
         */
        function changePassword() {
            usersService.changeCurrentPassword(vm.oldPassword, vm.newPassword).then(function () {
                // OK
                var toast = $mdToast.simple()
                    .textContent('Change password Succeed !')
                    .position('top right')
                    .hideDelay(3000);
                // Show toast
                $mdToast.show(toast);
                // Go to profile
                $state.go('header.profile.user');
            }, function () {
                // Error
                var toast = $mdToast.simple()
                    .textContent('Change password failed !')
                    .position('top right')
                    .hideDelay(3000);
                // Show toast
                $mdToast.show(toast);
            });
        }

    }

})();
