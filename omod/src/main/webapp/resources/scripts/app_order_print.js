'use strict';

// // Declare app level module which depends on views, and components
angular.module('labTrackingApp', [
    'ngDialog',
    'ngAnimate', 'ngSanitize', 'ui.bootstrap', //used for the auto-complete widget
    'uicommons.filters',
    'session',
    'labTrackingDataService',
    'encounterFactory',
    'labTrackingOrderFactory',
    'labTrackingPrintController'
]);
