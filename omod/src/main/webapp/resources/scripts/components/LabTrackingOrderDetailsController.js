angular.module("labTrackingOrderDetailsController", [])
    .config(function($templateRequestProvider){
        $templateRequestProvider.httpOptions({
            headers: { Accept: 'text/html' }
        });
    })
    .controller("orderDetailsController", ['$scope', '$window', '$http', '$filter', '$uibModal', 'Upload',
        'LabTrackingOrder', 'LabTrackingDataService', 'Encounter', 'orderUuid', 'patientUuid', 'serverDatetime', 'returnUrl', 'pageType',
        function ($scope, $window, $http, $filter, $uibModal, Upload,
                  LabTrackingOrder, LabTrackingDataService, Encounter, orderUuid, patientUuid, serverDatetime, returnUrl, pageType) {
            // used to determine if we should disable things
            $scope.pageType = pageType; //determines what we should show for editting
            $scope.data_loading = true;
            $scope.concepts = LabTrackingOrder.concepts;
            $scope.order = new LabTrackingOrder();
            $scope.errorMessage = null;
            $scope.providers = []; // the proviers in the system
            $scope.locations = []; //the locations in the system
            $scope.diagnoses = []; //the oncology diagnoses in the system
            $scope.alldiagnoses = []; //all the diagnoses in the system
            $scope.procedures = []; //the procedures in the system

            $scope.serverDatetime = new Date($filter('serverDate')(serverDatetime));  // we use the current Date from the server, not the client, to avoid problems if times aren't in sync

            /*
             loads the queue from the openmrs web services
             */
            $scope.loadOrder = function (orderUuid) {
                $scope.lastUpdatedAtInMillis = new Date().getTime();

                return LabTrackingDataService.loadOrder(orderUuid).then(function (resp) {
                    if (resp.status.code == 200) {
                        $scope.order = resp.data;
                        if($scope.order.sampleDate.value == null){
                            //if we don't have a sample date, then set a default value
                            $scope.order.sampleDate.value =  $scope.serverDatetime;
                        }
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
                    //$scope.savingModal.dismiss('cancel'); //don't need to dismiss, b/c we are just goint to the list page
                    $window.location.href = returnUrl;
                    //return resp;
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

            /* returns to the list page */
            $scope.returnToList = function () {
                $window.location.href = returnUrl;
            };


            /* prints the order*/
            $scope.printOrder = function () {
                $window.open(LabTrackingDataService.getPrintPageUrl($scope.order.uuid, $scope.order.patient.value), '_blank');
            };


            /*
             cancels the speciment details page and goes to the monitor page
             * */
            $scope.cancelSpecimenDetails = function () {
                $window.location.href = returnUrl;
            };

            /*
             shows the cancel dialog
             @param order - the order to view the details for
             @return none
             */
            $scope.showCancelOrder = function (order) {
                //nothing to do
            };

            /*
             handles canceling an order
             @param order - the order to view the details for
             @return none
             */
            $scope.handleCancelOrder = function () {
                var order = $scope.order;

                LabTrackingDataService.cancelOrder(order.uuid).then(function (res) {
                    if (res.status.code < 400) {
                        $scope.returnToList();
                    }
                    else {
                        alert("There was some sort of error");
                    }
                })
            };

            /* dismisses the cancel dialog*/
            $scope.dismissCancelOrder = function () {
                //nothing to do
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
                        return LabTrackingDataService.loadProcedures().then(function (res2) {
                            $scope.procedures = res2.data;
                            return LabTrackingDataService.loadDiagnonses().then(function (res3) {
                                $scope.diagnoses = res3.data;
                                return LabTrackingDataService.loadHumDiagnoses().then(function(humDiagnoses){
                                    $scope.alldiagnoses = humDiagnoses;
                                    $scope.data_loading = false;
                                });
                            })
                        })
                    });
                });
            });

        }])
    .directive('orderReadOnlyPanel', function () {
        return {
            scope: {
                order: '=',
                concepts: '=',
            },
            templateUrl: 'labtrackingOrderReadOnly.page'
        };
    })
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
                alldiagnoses: '=',
                concepts: '=',
            },
            controller: function ($scope) {
                $scope.selectedProcedures = $scope.order.proceduresForSpecimen; //the list of procedures available, used to manage the UI state
                $scope.tempProcedures = [];  //the temp list of procedures that have been selected, used to manage the UI state


                $scope.procedureDateBoxOptions = {
                    opened: false,
                    format: 'dd-MMM-yyyy',
                    options: {
                        dateDisabled: false,
                        formatYear: 'yy',
                        minDate: $scope.order.requestDate.value,
                        maxDate:  new Date(),
                        showWeeks: false
                    },
                    altInputFormats: ['M!/d!/yyyy']
                };

                /*shows the date box for the sample date*/
                $scope.showProcedureDateBox = function () {
                    $scope.procedureDateBoxOptions.opened = true;
                };

                
                /* init procedures */
                $scope.initProcedures = function () {
                    for (var i = 0; i < $scope.selectedProcedures.length; ++i) {
                        for (var j = 0; j < $scope.procedures.length; ++j) {
                            if ($scope.procedures[j].value == $scope.selectedProcedures[i].value) {
                                $scope.procedures.splice(j, 1);
                                break;
                            }
                        }
                    }
                };
                /* adds a procedures to the list*/
                $scope.addProcedure = function () {
                    for (var i = 0; i < $scope.selectedProcedures.length; ++i) {
                        if ($scope.order.proceduresForSpecimen.length > 2) {
                            //we only allow 3, so get out
                            return;
                        }
                        $scope.order.proceduresForSpecimen.push($scope.selectedProcedures[i]);
                        for (var j = 0; j < $scope.procedures.length; ++j) {
                            if ($scope.procedures[j].value == $scope.selectedProcedures[i].value) {
                                $scope.procedures.splice(j, 1);
                                break;
                            }
                        }
                    }
                };

                /*removes a procedure from the list*/
                $scope.removeProcedure = function () {
                    for (var i = 0; i < $scope.tempProcedures.length; ++i) {
                        $scope.procedures.push($scope.tempProcedures[i]);
                        for (var j = 0; j < $scope.order.proceduresForSpecimen.length; ++j) {
                            if ($scope.order.proceduresForSpecimen[j].value == $scope.tempProcedures[i].value) {
                                $scope.order.proceduresForSpecimen.splice(j, 1);
                                break;
                            }
                        }
                    }

                };

                $scope.initProcedures();
            },
            templateUrl: 'labtrackingOrderDetails-specimen.page'
        };
    })
    .directive('orderResultsPanel', function () {
        return {
            scope: {
                order: '=',
            },
            controller: function ($scope, $http, Upload, Encounter, LabTrackingDataService, LabTrackingOrder) {
                $scope.dateBoxOptions = {
                    opened: false,
                    format: 'dd-MMM-yyyy',
                    options: {
                        dateDisabled: false,
                        formatYear: 'yy',
                        minDate: null,
                        maxDate: new Date(),
                        startingDay: 1,
                        showWeeks: false
                    },
                    altInputFormats: ['M!/d!/yyyy']
                };

                /*shows the date box for the reults date*/
                $scope.showResultsDateBox = function () {
                    //for some reason the value isn't binding, if it does, then you can remove this line
                    if ($scope.order.sampleDate.value == null) {
                        $scope.dateBoxOptions.options.minDate =  new Date();
                    }
                    else {
                        $scope.dateBoxOptions.options.minDate = $scope.order.sampleDate.value;
                    }
                    $scope.dateBoxOptions.opened = true;
                };

                /*handles downloading the PDF, see http://stackoverflow.com/questions/283956/is-there-any-way-to-specify-a-suggested-filename-when-using-data-uri/6943481#6943481
                 * for details about how/why it id done like this*/
                $scope.downloadPdf = function () {
                    LabTrackingDataService.downloadPdf($scope.order);
                };

                /*removes the PDF*/
                $scope.removePdf = function () {
                    return LabTrackingDataService.deleteResultsPdf($scope.order);
                };

                /*  uploads the PDF to the server
                 * @param file - the HTML form file elelemt*/
                $scope.uploadPdf = function (file) {
                    //just set the value, we will update when we save the encounter
                    $scope.order.file.value = file;
                    $scope.order.file.label = file.name;
                    if ($scope.order.resultDate.value == null) {
                        $scope.order.resultDate.value =  new Date();
                    }
                };

            },
            templateUrl: 'labtrackingOrderDetails-results.page'
        };
    });

