angular.module("labTrackingAddOrderController", [])
    .controller("addOrderController", ['$scope', 'LabTrackingOrder', 'LabTrackingDataService','patientUuid', 'locationUuid',
        function ($scope, LabTrackingOrder, LabTrackingDataService, patientUuid, locationUuid) {
            // used to determine if we should disable things
            $scope.order = new LabTrackingOrder(patientUuid, locationUuid);
            $scope.error = null;
            $scope.debugInfo = {foo:'bar'};
            console.log($scope.debugInfo)
            $scope.handleSaveOrder = function(){
                return LabTrackingDataService.saveOrder($scope.order).then(function(res){
                    if(res !== undefined && res.status !== undefined && res.status != 200){
                       console.log(res);
                       $scope.error = res.data.error.message;
                       $scope.debugInfo = res;
                    }
                    else if(res !== undefined && res.message !== undefined){
                        $scope.error = res.message;
                        $scope.debugInfo = res;
                    }
                });
            }
        }]);

