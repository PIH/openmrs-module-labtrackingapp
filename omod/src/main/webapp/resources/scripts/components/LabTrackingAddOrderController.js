angular.module("labTrackingAddOrderController", [])
    .controller("addOrderController", ['$scope', 'LabTrackingOrder', 'LabTrackingDataService','patientUuid', 'locationUuid',
        function ($scope, LabTrackingOrder, LabTrackingDataService, patientUuid, locationUuid) {
            // used to determine if we should disable things
            $scope.order = new LabTrackingOrder(patientUuid, locationUuid);
            $scope.error = null;
            $scope.debugInfo = null;
            $scope.was_saved = false;
            $scope.handleSaveOrder = function(){
                return LabTrackingDataService.saveOrder($scope.order).then(function(res){
                    if(LabTrackingDataService.isOk(res)){
                        $scope.was_saved = true;
                    }
                    else if(res !== undefined && res.status !== undefined){
                       console.log(res);
                       $scope.error = res.data.error.message;
                       $scope.debugInfo = res;
                    }
                    else if(res !== undefined && res.message !== undefined){
                        $scope.error = res.message;
                        $scope.debugInfo = res;
                    }
                    else{

                    }
                });
            }
        }]);

