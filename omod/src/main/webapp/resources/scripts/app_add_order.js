'use strict';

// // Declare app level module which depends on views, and components
angular.module('labTrackingApp', [
    'ngAnimate', 'ngSanitize', 'ui.bootstrap', //used for the auto-complete widget
    'uicommons.filters',
    'session',
    'ngFileUpload', //used for the file uploads
    'labTrackingDataService',
    'encounterFactory',
    'labTrackingOrderFactory',
    'labTrackingAddOrderController'
]);
