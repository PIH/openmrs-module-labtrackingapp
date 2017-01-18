'use strict';

// // Declare app level module which depends on views, and components
angular.module('labTrackingApp', [
    'ngDialog',
    'ngAnimate', 'ngSanitize', 'ui.bootstrap',
    'uicommons.filters',
    'session',
    'labTrackingDataService',
    'encounterFactory',
    'labTrackingOrderFactory',
    'labTrackingViewQueueController'
]);
