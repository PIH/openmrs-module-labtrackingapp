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

            $scope.serverDatetime = new Date($filter('serverDate')(serverDatetime));  // we use the current Date from the server, not the client, to avoid problems if times aren't in sync

            /*
             loads the queue from the openmrs web services
             */
            $scope.loadOrder = function (orderUuid) {
                $scope.lastUpdatedAtInMillis = new Date().getTime();

                return LabTrackingDataService.loadOrder(orderUuid).then(function (resp) {
                    if (resp.status.code == 200) {
                        $scope.order = resp.data;
                        $scope.order.serverDatetime = $scope.serverDatetime;
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

            /* checks if you can submit the form*/
            $scope.readyToSubmit = function () {
                return ( $scope.order.processedDate.value && $scope.order.accessionNumber.value);
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
                        $scope.data_loading = false;
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
            controller: function ($scope, LabTrackingDataService) {
              $scope.downloadPdf = function () {
                LabTrackingDataService.downloadPdf($scope.order);
              };
              $scope.formatDiagnosis = function (diagnosis) {
                return diagnosis !== null &&  typeof diagnosis === 'object' ? diagnosis.label : diagnosis;
              }
              $scope.hasSpecimenCollection = function (order) {
                return order.specimenDetailsEncounter !== null && order.specimenDetailsEncounter.uuid !== null;
              }
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
                providers: '=',
                locations: '=',
                concepts: '=',
            },
            controller: function($scope) {
              $scope.formatDiagnosis = function (diagnosis) {
                return diagnosis !== null &&  typeof diagnosis === 'object' ? diagnosis.label : diagnosis;
              }
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
                concepts: '=',
            },
            controller: function ($scope) {

                $scope.procedureDateBoxOptions = {
                    opened: false,
                    format: 'dd-MMM-yyyy',
                    options: {
                        dateDisabled: false,
                        formatYear: 'yy',
                        minDate: $scope.order.sampleDate.value,
                        maxDate:  new Date(),
                        showWeeks: false
                    },
                    altInputFormats: ['M!/d!/yyyy']
                };

                if($scope.order.processedDate.value == null){
                    //if we don't have a processedDate date, then set a default value
                    $scope.order.processedDate.value =  $scope.order.serverDatetime;
                }
                /*shows the date box for the sample date*/
                $scope.showProcedureDateBox = function () {
                    $scope.procedureDateBoxOptions.opened = true;
                };

              $scope.immunoDateBoxOptions = {
                opened: false,
                format: 'dd-MMM-yyyy',
                options: {
                  dateDisabled: false,
                  formatYear: 'yy',
                  minDate: $scope.order.sampleDate.value,
                  maxDate:  new Date(),
                  showWeeks: false
                },
                altInputFormats: ['M!/d!/yyyy']
              };

              /*shows the date box for the date when the immunohistochemistry was sent to Boston*/
              $scope.showImmunoDateBox = function () {
                $scope.immunoDateBoxOptions.opened = true;
              };

            },
            templateUrl: 'labtrackingOrderDetails-specimen.page'
        };
    })
    .directive('orderSpecimenPanelReadOnly', function () {
      return {
        scope: {
          order: '=',
        },
        templateUrl: 'labtrackingOrderDetails-specimen-readOnly.page'
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
                if($scope.order.resultDate.value == null){
                    //if we don't have a result date, then set a default value
                    $scope.order.resultDate.value =  $scope.order.serverDatetime;
                }

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

