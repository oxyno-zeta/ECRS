/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 16/10/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('crash-reporter.views.profile', [
            'crash-reporter.views.profile.user',
            'crash-reporter.views.profile.email',
            'crash-reporter.views.profile.password'
        ]);

})();