angular.module("labTrackingViewQueueController", [])
    .controller("viewQueueController", ['$scope', '$window', 'LabTrackingOrder', 'LabTrackingDataService',
        function ($scope, $window, LabTrackingOrder, LabTrackingDataService) {
            $scope.testOrderQueue = []; // hold the model
            $scope.errorMessage = null; // displays an error on the page if not null

            /*
            loads the queue from the openmrs web services
            */
            $scope.loadQueue = function(){
                $scope.lastUpdatedAtInMillis = new Date().getTime();
                var locationUuid = "";
                var patientUuid = "";
                return LabTrackingDataService.loadQueue(locationUuid, patientUuid).then(function(resp){
                    if(resp.status.code == 200){
                        $scope.testOrderQueue = resp.data;
                    }
                    else{
                        $scope.errorMessage = resp.status.msg;
                    }

                    console.log(resp);
                });
            };

            /*
            handles looking up the order details
            @param order - the order to view the details for
            @return none, navigates to the order details page
            */
            $scope.handleDetails = function(order){
                console.log(order);
                 $window.location.href ='labtrackingOrderDetails.page?orderUuid=' + order.order.value;
            }

            /*
            handles printing an order
            @param order - the order to view the details for
            @return none, navigates to the order print page
            */
            $scope.handlePrint = function(order){
                console.log(order);
                alert("TBD") ;
            }

            /*
            handles canceling an order
            @param order - the order to view the details for
            @return none
            */
            $scope.handleCancel = function(order){
                console.log(order);
                alert("TBD") ;
            }

            return $scope.loadQueue();
        }]);