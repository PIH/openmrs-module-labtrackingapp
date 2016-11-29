angular.module("labTrackingOrderDetailsController", [])
    .controller("orderDetailsController", ['$scope', 'LabTrackingOrder',
        function ($scope, LabTrackingOrder) {
            // used to determine if we should disable things
            $scope.order = new LabTrackingOrder();
        }]);

