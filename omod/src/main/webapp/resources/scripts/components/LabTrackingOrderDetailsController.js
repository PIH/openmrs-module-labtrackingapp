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

            $scope.clientDatetime = new Date();

            /*
             loads the queue from the openmrs web services
             */
            $scope.loadOrder = function (orderUuid) {
                $scope.lastUpdatedAtInMillis = new Date().getTime();

                return LabTrackingDataService.loadOrder(orderUuid).then(function (resp) {
                    if (resp.status.code == 200) {
                        $scope.order = resp.data;
                        $scope.order.serverDatetime = $scope.clientDatetime;
                        if($scope.order.sampleDate.value == null){
                            //if we don't have a sample date, then set a default value
                            $scope.order.sampleDate.value =  $scope.clientDatetime;
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

              $scope.specimenSentDateBoxOptions = {
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

              $scope.showSentDateBox = function () {
                $scope.specimenSentDateBoxOptions.opened = true;
              };

              $scope.specimenReturnedDateBoxOptions = {
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

              $scope.showReturnedDateBox = function () {
                $scope.specimenReturnedDateBoxOptions.opened = true;
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

                  $scope.searchDx = function(name) {
                    return LabTrackingDataService.searchDx(name).then(function(response) {
                      var dxArray = [];
                      if (LabTrackingDataService.isOk(response)) {
                        for (var i = 0; i < response.data.results.length; ++i) {
                          var item = response.data.results[i];
                          dxArray.push({ value: item.concept.uuid, label: item.concept.display})
                        }
                      }
                      return dxArray;
                    }, function (err) {
                      throw err;
                    });

                  }

                  $scope.formatDiagnosis = function (diagnosis) {
                    return diagnosis !== null &&  typeof diagnosis === 'object' ? diagnosis.label : diagnosis;
                  }
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

                /* removes PDF file from the list of files to be uploaded to the server*/
                $scope.removePdfFile = function(file) {
                  if ( file.obsUuid ) {
                    LabTrackingDataService.deleteResultsPdf($scope.order, file).then(function (status) {
                      if (status == "200") {
                        $scope.order.files = $scope.order.files.filter(pdf => pdf.obsUuid != file.obsUuid);
                      }
                    });
                  } else {
                    // the file has not been uploaded yet
                    $scope.order.files = $scope.order.files.filter(pdf => pdf.label != file.label);
                  }
                }

                /*  uploads the PDF to the server
                 * @param file - the HTML form file elelemt*/
                $scope.uploadPdf = function (files) {
                    //just set the value, we will update when we save the encounter
                  if (files && files.length ) {
                    for (let i = 0; i < files.length; i++) {
                      $scope.order.files.push({
                        value: files[i],
                        label: files[i].name,
                      });
                    }
                  }
                  if ($scope.order.resultDate.value == null) {
                      $scope.order.resultDate.value =  new Date();
                  }
                };

            },
            templateUrl: 'labtrackingOrderDetails-results.page'
        };
    });

