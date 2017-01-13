angular.module("labTrackingOrderDetailsController", [])
    .controller("orderDetailsController", ['$scope', '$window', 'LabTrackingOrder', 'LabTrackingDataService',
        'orderUuid',
        function ($scope, $window, LabTrackingOrder, LabTrackingDataService, orderUuid) {
            // used to determine if we should disable things
            $scope.concepts = LabTrackingOrder.concepts;
            $scope.order = new LabTrackingOrder();
            $scope.errorMessage = null;
            $scope.providers = []; // the proviers in the system
            $scope.locations = []; //the locations in the system
            $scope.diagnoses = []; //the diagnoses in the system
            $scope.procedures = []; //the procedures in the system
            /*
            loads the queue from the openmrs web services
            */
            $scope.loadOrder = function (orderUuid) {
                $scope.lastUpdatedAtInMillis = new Date().getTime();

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

            /*
             cancels the speciment details page and goes to the monitor page
             * */
            $scope.cancelSpecimenDetails = function () {
                $window.location.href = 'labtrackingViewQueue.page';
            };

            return $scope.loadOrder(orderUuid).then(function (resp) {
                return LabTrackingDataService.loadProviders().then(function (resp2) {
                    if (resp2.status.code == 200) {
                        $scope.providers = resp2.data;
                    }
                    return LabTrackingDataService.loadLocations().then(function (resp3) {
                        if (resp3.status.code == 200) {
                            $scope.locations = resp3.data;
                        }
                        return LabTrackingDataService.loadProcedures().then(function(res2){
                            $scope.procedures = res2.data;
                            return LabTrackingDataService.loadDiagnonses().then(function(res3){
                                $scope.diagnoses = res3.data;
                            })
                        })
                    });
                });
            });

        }])
    .directive('orderDebugPanel', function () {
        return {
            scope: {
                order: '=',
            },
            templateUrl: 'labtrackingOrderDetails-debug.page'
        };
    })
    .directive('orderDetailsPanel', function () {
        return {
            scope: {
                order: '=',
            },
            templateUrl: 'labtrackingOrderDetails-order.page'
        };
    })
    .directive('orderSpecimenPanel', function () {
        return {
            scope: {
                order: '=',
                providers: '=',
                locations: '=',
                procedures: '=',
                diagnoses: '=',
                concepts: '=',
                cancelSpecimenDetails: '&'
            },
            controller: function ($scope, $window, LabTrackingDataService) {

                $scope.originalOrderUrgency = $scope.order.urgency;
                /* save the specimen details*/
                $scope.saveSpecimenDetails = function () {
                    return LabTrackingDataService.createOrUpdateOrderSpecimenEncounter($scope.order).then(function (resp) {
                        if (resp.status == 200) {
                            if ($scope.originalOrderUrgency) {
                                //we need to update the urgency for the order
                            }
                        }
                        else {
                            return resp;
                        }

                    });
                };

            },
            templateUrl: 'labtrackingOrderDetails-specimen.page'
        };
    })
    .directive('orderResultsPanel', function () {
        return {
            scope: {
                order: '=',
                cancelSpecimenDetails: '&'
            },
            controller: function ($scope) {
                $scope.resultsDate = {
                    opened: false,
                    value: $scope.order.resultDate.value,
                    format: 'dd-MMM-yyyy',
                    options: {
                        dateDisabled: false,
                        formatYear: 'yy',
                        maxDate: new Date(),
                        minDate: new Date(2010, 1, 1),
                        startingDay: 1,
                        showWeeks: false
                    },
                    altInputFormats: ['M!/d!/yyyy']
                };
                $scope.showResultsDateBox = function () {
                    $scope.resultsDate.opened = true;
                };

            },
            templateUrl: 'labtrackingOrderDetails-results.page'
        };
    });

