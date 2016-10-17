/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 21/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.technical.dao')
        .factory('configurationDao', configurationDao);

    /** @ngInject */
    function configurationDao($q, $resource, CONFIG) {
        var service = {
            getConfiguration: getConfiguration,
            getAllConfiguration: getAllConfiguration
        };

        /* ************************************* */
        /* ********  PRIVATE VARIABLES  ******** */
        /* ************************************* */

        var configurationResource = $resource(CONFIG.URL.PREFIX + '/configurations/:verb', {}, {});

        return service;

        ////////////////

        /* ************************************* */
        /* ********  PRIVATE FUNCTIONS  ******** */
        /* ************************************* */

        /* ************************************* */
        /* ********   PUBLIC FUNCTIONS  ******** */
        /* ************************************* */

        /**
         * Get all configuration.
         * @returns {*}
         */
        function getAllConfiguration() {
            var deferred = $q.defer();
            configurationResource.get({verb: 'all'}, deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get configuration.
         * @returns {*}
         */
        function getConfiguration() {
            var deferred = $q.defer();
            configurationResource.get({verb: 'public'}, deferred.resolve, deferred.reject);
            return deferred.promise;
        }
    }

})();
