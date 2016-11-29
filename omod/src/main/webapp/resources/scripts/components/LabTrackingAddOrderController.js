angular.module("labTrackingAddOrderController", [])
    .controller("addOrderController", ['$scope', 'LabTrackingOrder',
        function ($scope, LabTrackingOrder) {
            // used to determine if we should disable things
            $scope.order = new LabTrackingOrder();
        }]);

