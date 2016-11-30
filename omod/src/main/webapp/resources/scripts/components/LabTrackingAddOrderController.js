angular.module("labTrackingAddOrderController", [])
    .controller("addOrderController", ['$scope', 'LabTrackingOrder', 'LabTrackingDataService','patientUuid', 'locationUuid',
        function ($scope, LabTrackingOrder, LabTrackingDataService, patientUuid, locationUuid) {
            // used to determine if we should disable things
            $scope.order = new LabTrackingOrder(patientUuid, locationUuid);

            $scope.handleSaveOrder = function(){
                return LabTrackingDataService.saveOrder($scope.order);
            }
        }]);

