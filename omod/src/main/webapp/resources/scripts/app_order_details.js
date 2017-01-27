'use strict';

angular.module('labTrackingApp', [
    'ngAnimate', 'ngSanitize', 'ui.bootstrap', //used for the auto-complete widget
    'ngFileUpload', //used for the file uploads
    'uicommons.filters',
    'session',
    'labTrackingDataService',
    'encounterFactory',
    'labTrackingOrderFactory',
    'labTrackingOrderDetailsController'
]);
