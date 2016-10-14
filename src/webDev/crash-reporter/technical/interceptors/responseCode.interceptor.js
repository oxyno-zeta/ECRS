/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 21/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.technical.interceptors')
        .factory('responseCodeInterceptor', responseCodeInterceptor);

    /** @ngInject */
    function responseCodeInterceptor($q, $rootScope) {
        var service = {
            responseError: responseError
        };
        return service;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Response error.
         * @param response
         * @returns {*}
         */
        function responseError(response) {
            switch (response.status) {
                case 401:
                    $rootScope.$broadcast('errorResponse:unauthorized');
                    break;
                default:
                    break;
            }

            return $q.reject(response);
        }
    }

})();
