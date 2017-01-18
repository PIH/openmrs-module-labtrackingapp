angular.module("labTrackingOrderDetailsController", [])
    .controller("orderDetailsController", ['$scope', '$window', '$uibModal', 'LabTrackingOrder', 'LabTrackingDataService',
        'orderUuid',
        function ($scope, $window, $uibModal, LabTrackingOrder, LabTrackingDataService, orderUuid) {
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

            /* save the specimen details*/
            $scope.saveSpecimenDetails = function () {
                $scope.savingModal = showSavingModal();
                return LabTrackingDataService.createOrUpdateOrderSpecimenEncounter($scope.order).then(function (resp) {
                    if (resp.status != 200) {
                        alert("Failed to save the specimen details");

                    }
                    $scope.savingModal.dismiss('cancel');
                    return resp;
                });
            };

            /*
             shows the saving modal box, while the data is being saved
             */
            function showSavingModal() {
                return $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'saveSpecimenDetails.html',
                    size: 'sm'
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
            },
            templateUrl: 'labtrackingOrderDetails-specimen.page'
        };
    })
    .directive('orderResultsPanel', function () {
        return {
            scope: {
                order: '=',
            },
            controller: function ($scope) {
                $scope.dateBoxOptions = {
                    opened: false,
                    format: 'dd-MMM-yyyy',
                    options: {
                        dateDisabled: false,
                        formatYear: 'yy',
                        minDate: $scope.minDate,
                        startingDay: 1,
                        showWeeks: false
                    },
                    altInputFormats: ['M!/d!/yyyy']
                };
                $scope.showResultsDateBox = function () {
                    //for some reason the value isn't binding, if it does, then you can remove this line
                    if( $scope.order.sampleDate.value == null){
                        $scope.dateBoxOptions.options.minDate = new Date();
                    }
                    else{
                        $scope.dateBoxOptions.options.minDate = $scope.order.sampleDate.value;
                    }
                    $scope.dateBoxOptions.opened = true;
                };
            },
            templateUrl: 'labtrackingOrderDetails-results.page'
        };
    });

