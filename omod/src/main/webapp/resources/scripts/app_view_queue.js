'use strict';

// // Declare app level module which depends on views, and components
angular.module('labTrackingApp', [
    'ngDialog',
    'uicommons.filters',
    'session',
    'labTrackingDataService',
    'encounterFactory',
    'labTrackingOrderFactory',
    'labTrackingViewQueueController'
]);
