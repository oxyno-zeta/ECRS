/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 21/07/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.technical.service')
        .factory('configurationService', configurationService);

    /** @ngInject */
    function configurationService($q, configurationDao, CONFIG) {
        var service = {
            getConfiguration: getConfiguration,
            getCrashLogsPostUrl: getCrashLogsPostUrl,
            getBaseCrashLogsDownloadUrl: getBaseCrashLogsDownloadUrl
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
         * Get base Crash logs Download url.
         * @returns {*}
         */
        function getBaseCrashLogsDownloadUrl() {
            var url = CONFIG.URL.PREFIX;
            url += '/crash-logs/downloads/';
            return url;
        }

        /**
         * Get crash logs post url.
         * @param projectId {String} id
         * @returns {*}
         */
        function getCrashLogsPostUrl(projectId) {
            var deferred = $q.defer();
            configurationDao.getConfiguration().then(function (config) {
                var url = config.backendUrl;
                url += CONFIG.URL.PREFIX;
                url += '/crash-logs/projects/';
                url += projectId;
                deferred.resolve(url);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get configuration.
         * @returns {*}
         */
        function getConfiguration() {
            return configurationDao.getConfiguration();
        }
    }

})();
