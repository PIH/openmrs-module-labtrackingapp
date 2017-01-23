angular.module("labTrackingPrintController", [])
    .controller("printController", ['$scope', '$window', '$timeout','LabTrackingOrder', 'LabTrackingDataService', 'orderUuid',
        function ($scope, $window, $timeout, LabTrackingOrder, LabTrackingDataService, orderUuid) {
            $scope.order = null;
            $scope.concepts = LabTrackingOrder.concepts;
            $scope.loadOrder = function (orderUuid) {
                return LabTrackingDataService.loadOrder(orderUuid).then(function (resp) {
                    if (resp.status.code == 200) {
                        $scope.order = resp.data;

                    }
                    else {
                        $scope.errorMessage = resp.status.msg;
                    }
                    return resp;
                });
            };



            return $scope.loadOrder(orderUuid).then(function(){
                $timeout(function(){$window.print()}, 500);
            });

        }]);

