angular.module("labTrackingViewQueueController", [])
    .controller("viewQueueController", ['$scope', 'LabTrackingOrder', 'LabTrackingDataService',
        function ($scope, LabTrackingOrder, LabTrackingDataService) {
            $scope.queue = [];
            $scope.loadQueue = function(){
                $scope.lastUpdatedAtInMillis = new Date().getTime();
                var locationUuid = "";
                var patientUuid = "";
                return LabTrackingDataService.loadQueue(locationUuid, patientUuid).then(function(queue){
                    $scope.queue - queue;
                });
            };
        }]);