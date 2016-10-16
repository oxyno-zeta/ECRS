/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 14/08/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile.user')
        .controller('UserProfileController', UserProfileController);

    /** @ngInject */
    function UserProfileController($mdToast, usersService, user) {
        var vm = this;
        // Variables
        vm.user = user;
        // Functions
        vm.getRoleName = getRoleName;
        vm.getAccountType = getAccountType;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

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
