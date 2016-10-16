/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 29/08/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.administration.users')
        .controller('AdminUserChangePasswordController', AdminUserChangePasswordController);

    /** @ngInject */
    function AdminUserChangePasswordController($mdDialog, $mdToast, usersService, user) {
        var vm = this;
        // Variables
        vm.newPassword = null;
        vm.confirmPassword = null;
        // Functions
        vm.close = close;
        vm.changePassword = changePassword;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Change password.
         */
        function changePassword() {
            usersService.changePasswordForUser(user, vm.newPassword)
                .then($mdDialog.hide, function () {
                    // Error
                    var toast = $mdToast.simple()
                        .textContent('Change password failed !')
                        .position('top right')
                        .hideDelay(3000);
                    // Show toast
                    $mdToast.show(toast);
                });
        }

        /**
         * Close modal.
         */
        function close() {
            $mdDialog.cancel();
        }
    }

})();
