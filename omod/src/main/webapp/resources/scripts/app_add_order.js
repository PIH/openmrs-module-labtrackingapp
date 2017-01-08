'use strict';

// // Declare app level module which depends on views, and components
angular.module('labTrackingApp', [
    'ngAnimate', 'ngSanitize', 'ui.bootstrap', //used for the auto-complete widget
    'session',
    'labTrackingDataService',
    'encounterFactory',
    'labTrackingOrderFactory',
    'labTrackingAddOrderController'
]);
