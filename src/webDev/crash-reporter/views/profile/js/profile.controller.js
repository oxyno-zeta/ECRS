/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 14/08/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($mdToast, usersService, user) {
        var vm = this;
        // Variables
        vm.user = user;
        vm.oldPassword = '';
        vm.newPassword = '';
        vm.confirmPassword = '';
        vm.newEmail = '';
        // Functions
        vm.getRoleName = getRoleName;
        vm.getAccountType = getAccountType;
        vm.changePassword = changePassword;
        vm.changeEmail = changeEmail;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Clear Data.
         */
        function clearData() {
            vm.oldPassword = '';
            vm.newPassword = '';
            vm.confirmPassword = '';
            vm.newEmail = '';
        }

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Change email.
         */
        function changeEmail() {
            usersService.updateCurrentEmail(vm.newEmail).then(function (userData) {
                // OK
                var toast = $mdToast.simple()
                    .textContent('Change Email Succeed !')
                    .position('top right')
                    .hideDelay(3000);
                // Show toast
                $mdToast.show(toast);
                // Reload data
                vm.user = userData;
                // Clear data
                clearData();
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
                // Clear data
                clearData();
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

        /**
         * Get account type.
         * @returns {*}
         */
        function getAccountType() {
            if (user.github && user.github.id) {
                return 'Github';
            }
            else {
                return 'Local';
            }
        }

        /**
         * Get Role Name.
         * @returns {*}
         */
        function getRoleName() {
            switch (user.role) {
                case 'admin':
                    return 'Administrator';
                case 'normal':
                    return 'Normal';
                default:
                    return 'Unknown';
            }
        }

    }

})();
