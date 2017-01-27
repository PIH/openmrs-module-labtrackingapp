'use strict';

// // Declare app level module which depends on views, and components
angular.module('labTrackingApp', [
    'ngCookies',
    'ngAnimate', 'ngSanitize', 'ui.bootstrap',
    'uicommons.filters',
    'ngFileUpload', //used for the file uploads
    'session',
    'labTrackingDataService',
    'encounterFactory',
    'labTrackingOrderFactory',
    'labTrackingViewQueueController'
]);
